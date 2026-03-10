const express = require('express');
const fs = require('fs');
const path = require('path');
const { execFile } = require('child_process');

const app = express();
const PORT = 3500;
const BLOG_DIR = path.resolve(__dirname, '../src/content/blog');
const PORTFOLIO_DIR = path.resolve(__dirname, '..');

app.use(express.json({ limit: '5mb' }));

// CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

// --- Helpers ---

function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { meta: {}, body: content };

  const raw = match[1];
  const body = match[2];
  const meta = {};

  const lines = raw.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) continue;

    const key = line.slice(0, colonIdx).trim();
    let value = line.slice(colonIdx + 1).trim();

    // Handle quoted strings
    if ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    // Handle arrays like ["tag1", "tag2"]
    if (value.startsWith('[')) {
      try {
        meta[key] = JSON.parse(value);
      } catch {
        meta[key] = value.replace(/[\[\]]/g, '').split(',').map(s => s.trim().replace(/^["']|["']$/g, ''));
      }
      continue;
    }

    meta[key] = value;
  }

  return { meta, body };
}

function buildFrontmatter(meta) {
  const lines = ['---'];

  if (meta.title) lines.push(`title: "${meta.title}"`);
  if (meta.description) lines.push(`description: "${meta.description}"`);
  if (meta.date) lines.push(`date: ${meta.date}`);
  if (meta.lang) lines.push(`lang: ${meta.lang}`);
  if (meta.canonicalSlug) lines.push(`canonicalSlug: "${meta.canonicalSlug}"`);
  if (meta.tags && meta.tags.length) {
    lines.push(`tags: [${meta.tags.map(t => `"${t}"`).join(', ')}]`);
  }
  if (meta.category) lines.push(`category: "${meta.category}"`);

  lines.push('---');
  return lines.join('\n');
}

function slugify(title) {
  return title
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // remove accents
    .replace(/[^a-z0-9\s-]/g, '') // remove special chars
    .replace(/\s+/g, '-')         // spaces to hyphens
    .replace(/-+/g, '-')          // collapse hyphens
    .replace(/^-|-$/g, '');       // trim hyphens
}

function generateFilename(title, lang) {
  let slug = slugify(title);
  // For translations, the slug is based on the canonical (Spanish) title
  // but we append the lang suffix
  if (lang === 'en') slug += '-en';
  else if (lang === 'gl') slug += '-gl';
  return slug + '.md';
}

function runBuildAndCommit(title) {
  const buildCmd = `cd "${PORTFOLIO_DIR}" && npx astro build 2>&1; git add -A && git commit -m "blog: ${title.replace(/"/g, '\\"')}" && git push origin master 2>&1`;
  execFile('/bin/bash', ['-c', buildCmd], { cwd: PORTFOLIO_DIR }, (err, stdout, stderr) => {
    if (err) {
      console.error('[build/commit] Error:', err.message);
      if (stderr) console.error('[build/commit] stderr:', stderr);
    } else {
      console.log('[build/commit] Done:', stdout.slice(0, 200));
    }
  });
}

// --- Routes ---

// Serve admin page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// List all posts
app.get('/api/posts', (req, res) => {
  try {
    const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.md'));
    const posts = files.map(file => {
      const content = fs.readFileSync(path.join(BLOG_DIR, file), 'utf-8');
      const { meta } = parseFrontmatter(content);
      return {
        id: file.replace('.md', ''),
        title: meta.title || file,
        description: meta.description || '',
        date: meta.date || '',
        tags: meta.tags || [],
        category: meta.category || 'profesional',
        lang: meta.lang || 'es',
        canonicalSlug: meta.canonicalSlug || null,
      };
    });
    posts.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single post
app.get('/api/posts/:id', (req, res) => {
  try {
    const filePath = path.join(BLOG_DIR, req.params.id + '.md');
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Post not found' });
    }
    const content = fs.readFileSync(filePath, 'utf-8');
    const { meta, body } = parseFrontmatter(content);
    res.json({
      id: req.params.id,
      title: meta.title || '',
      description: meta.description || '',
      date: meta.date || '',
      tags: meta.tags || [],
      category: meta.category || 'profesional',
      lang: meta.lang || 'es',
      canonicalSlug: meta.canonicalSlug || null,
      body: body.trim(),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create post
app.post('/api/posts', (req, res) => {
  try {
    const { title, description, date, tags, category, lang, canonicalSlug, body } = req.body;
    if (!title) return res.status(400).json({ error: 'Title is required' });

    const filename = generateFilename(title, lang || 'es');
    const filePath = path.join(BLOG_DIR, filename);

    if (fs.existsSync(filePath)) {
      return res.status(409).json({ error: 'Post with this slug already exists' });
    }

    const meta = { title, description, date, lang: lang || 'es', tags: tags || [], category: category || 'profesional' };
    if (canonicalSlug) meta.canonicalSlug = canonicalSlug;

    const content = buildFrontmatter(meta) + '\n\n' + (body || '') + '\n';
    fs.writeFileSync(filePath, content, 'utf-8');

    runBuildAndCommit(title);

    res.status(201).json({ id: filename.replace('.md', ''), message: 'Post created' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update post
app.put('/api/posts/:id', (req, res) => {
  try {
    const filePath = path.join(BLOG_DIR, req.params.id + '.md');
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const { title, description, date, tags, category, lang, canonicalSlug, body } = req.body;

    const meta = {
      title: title || '',
      description: description || '',
      date: date || '',
      lang: lang || 'es',
      tags: tags || [],
      category: category || 'profesional',
    };
    if (canonicalSlug) meta.canonicalSlug = canonicalSlug;

    const content = buildFrontmatter(meta) + '\n\n' + (body || '') + '\n';
    fs.writeFileSync(filePath, content, 'utf-8');

    runBuildAndCommit(title || req.params.id);

    res.json({ id: req.params.id, message: 'Post updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete post
app.delete('/api/posts/:id', (req, res) => {
  try {
    const filePath = path.join(BLOG_DIR, req.params.id + '.md');
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const content = fs.readFileSync(filePath, 'utf-8');
    const { meta } = parseFrontmatter(content);
    const title = meta.title || req.params.id;

    fs.unlinkSync(filePath);

    runBuildAndCommit(`delete: ${title}`);

    res.json({ message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Blog admin running at http://0.0.0.0:${PORT}`);
  console.log(`Blog content dir: ${BLOG_DIR}`);
});
