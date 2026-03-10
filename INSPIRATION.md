# Portfolio Inspiration Research

> Researched 2026-03-09. Visited 15+ minimal developer portfolios and analyzed patterns from curated galleries (DeadSimpleSites, Minimal Gallery, Awwwards) and multiple "best of" articles.

---

## Table of Contents

1. [Portfolios Analyzed (Detailed Notes)](#portfolios-analyzed)
2. [Common Patterns](#common-patterns)
3. [Typography & Color Patterns](#typography--color-patterns)
4. [How They Handle Projects](#how-they-handle-projects)
5. [Progressive Disclosure Pattern](#progressive-disclosure-pattern)
6. [Anti-Patterns to Avoid](#anti-patterns-to-avoid)
7. [Specific Recommendations for Julio's Portfolio](#specific-recommendations)
8. [Inspiration Resources](#inspiration-resources)

---

## Portfolios Analyzed

### ⭐ Tier 1 — Best Models for Our Goals

#### 1. Lee Robinson — [leerob.com](https://leerob.com)
**Role:** VP at Vercel, educator  
**Why it's relevant:** THE gold standard for minimal developer portfolios.

- **Layout:** Single column, centered. Just a few paragraphs of text. That's the entire homepage.
- **Text amount:** ~100 words on homepage. Two short paragraphs. 
- **Sections:** Bio paragraph → favorite writing links → external links (writing, code, social, videos, email)
- **Projects:** Not shown on homepage at all. Links to `/writing` for blog posts and GitHub for code.
- **Typography:** System font stack or clean sans-serif. Very readable, generous line-height.
- **Color:** Near-black text on white. Almost no color. Links are underlined or slightly styled.
- **What makes it work:** Every word earns its place. No filler. Links are inline in natural prose. Feels like a person talking to you, not a marketing page. Mentions personal interests (music, family) naturally.
- **Progressive disclosure:** Homepage is a doorway → each link leads to deeper content (writing page, bio page, etc.)
- **Key takeaway:** *You can have a complete portfolio with just two paragraphs and some links.*

#### 2. Brittany Chiang — [brittanychiang.com](https://brittanychiang.com)
**Role:** Senior frontend engineer at Klaviyo (ex-Apple, ex-Upstatement)  
**Why it's relevant:** Most forked developer portfolio on GitHub (6k+ stars). The archetype.

- **Layout:** Two-column layout on desktop. Left column: sticky name/title/nav + social links. Right column: scrollable content (About → Experience → Projects).
- **Text amount:** Medium. Full paragraphs for About, but scannable.
- **Sections (in order):** Hero (name + title + one-liner) → About → Experience (timeline) → Projects → Writing
- **Projects:** Card-style with title, description, and tech tags. Links to live sites and courses. Only 3 featured projects.
- **Typography:** Clean sans-serif. Tech tags in small pill badges.
- **Color:** Dark theme (navy/dark blue background). Teal/cyan accent color. Subtle hover effects.
- **What makes it work:** The two-column sticky nav means you always know where you are. Social links float on the left sidebar. The single-page scroll tells a complete story without clicking.
- **Mobile:** Collapses to single column. Works perfectly.
- **Key takeaway:** *Dark theme + one accent color + two-column layout = instant professional feel.*

#### 3. Cassidy Williams — [cassidoo.co](https://cassidoo.co)
**Role:** Senior Director of Developer Advocacy at GitHub  
**Why it's relevant:** Personality-first portfolio. Warm, human, approachable.

- **Layout:** Single column, narrow. Short intro → recent blog posts.
- **Text amount:** Very little. One paragraph intro (~40 words), then a list of recent posts.
- **Sections:** Intro paragraph → Blog posts (title + date + one-line description)
- **Projects:** Not on homepage. Blog posts serve as the content showcase.
- **Typography:** Clean, friendly sans-serif. Generous spacing.
- **Color:** Light background, minimal color.
- **What makes it work:** The intro is *fun*: "I like to make memes and dreams and software." It's a human being, not a resume. Blog posts show she's actively creating. Links to GitHub, keyboard building, music — you get to know her.
- **Key takeaway:** *Personality in the intro makes you memorable. Blog posts > project galleries for showing you're active.*

#### 4. Matej Hrescak — [hrescak.com](https://hrescak.com)
**Role:** Software designer at DoorDash  
**Why it's relevant:** Perfect balance of minimal + personality + clear navigation.

- **Layout:** Single column, centered. Extremely compact.
- **Text amount:** ~60 words. One paragraph + link row.
- **Sections:** Name + pronunciation hint → Short bio → Link row (CV, Posts, Notes, Now, GitHub)
- **Projects:** Not on homepage. Deferred to CV and other pages.
- **Typography:** Clean sans-serif. Compact but readable.
- **Color:** Minimal. Clean white/light background.
- **What makes it work:** The pronunciation hint ("Rhymes with latte") is a tiny human touch. The `/now` page is a great pattern (what are you up to right now). Links are clear: CV, Posts, Notes, Now, GitHub — you know exactly where to go.
- **Key takeaway:** *A `/now` page is a great progressive disclosure tool. Small personal touches matter.*

#### 5. Frank Chimero — [frankchimero.com](https://frankchimero.com)
**Role:** Designer/writer, former Creative Director at Modern Treasury  
**Why it's relevant:** Masterclass in "say a lot with a little."

- **Layout:** Single column, centered. Just prose.
- **Text amount:** ~150 words. A few paragraphs with inline links.
- **Sections:** Bio as natural prose. No sections, no headings. Just a story of who you are.
- **Typography:** Beautiful serif or serif-like font. Generous margins. Book-like.
- **Color:** Minimal. Warm, bookish feel.
- **What makes it work:** Reads like the opening of a book, not a website. Company names are linked inline. Personal interests at the end (museums, paperbacks, Phil Collins) make you human. No "About Me" heading — the whole page IS about them.
- **Key takeaway:** *Writing quality matters more than design. If your prose is good, you barely need structure.*

---

### ⭐ Tier 2 — Excellent References

#### 6. Johnny Rodgers — [johnnyrodgers.is](https://johnnyrodgers.is)
**Role:** Technology designer (ex-Slack/Glitch)

- **Layout:** Quote → short bio → blog posts as cards with dates.
- **Text:** Opens with a Heinlein quote, then ~50 words of intro. Blog post excerpts below.
- **Projects:** Blog posts about life/work serve as content. No separate project section.
- **What makes it work:** The blog-as-portfolio approach. Posts like "The death of Glitch, the birth of Slack" ARE the portfolio. Stories over specs.

#### 7. Brian Lovin — [brianlovin.com](https://brianlovin.com)
**Role:** Software designer at Notion

- **Layout:** Ultra-minimal. One sentence on the homepage.
- **Text:** ONE sentence: "I'm a software designer living in San Francisco, currently making AI products at Notion."
- **Navigation:** Wiki-style sidebar with multiple sections (Bookmarks, Stack, Writing, etc.)
- **What makes it work:** The wiki/digital garden approach. Homepage is just the entry point to a rich collection of pages.

#### 8. Daniel Gross — [dcgross.com](https://dcgross.com)
**Role:** Runs compute at Meta, investor

- **Layout:** Name → bullet list. That's it.
- **Text:** Sparse. Each line is one fact, linked.
- **What makes it work:** When your work speaks for itself, a simple list of facts + links is enough. No fluff.

#### 9. Adam Whitcroft — [adamwhitcroft.com](https://adamwhitcroft.com)
**Role:** Software designer, iOS developer

- **Layout:** Short intro → list of apps with descriptions.
- **Text:** Conversational intro → each app gets a name, one-line description, and year.
- **Projects:** Simple list format. App name → description → year. No screenshots on homepage.
- **What makes it work:** "A simple iOS app that..." repeated pattern is clean and scannable.

#### 10. Matt Ström-Awn — [matthewstrom.com](https://matthewstrom.com)
**Role:** Design leader (ex-Stripe, Soundcloud, WSJ)

- **Layout:** Ultra-minimal. Two short paragraphs + company links.
- **Text:** ~50 words. "I work on the future of design" → current role → previous roles.
- **What makes it work:** Confidence in brevity. Previous companies are the portfolio.

#### 11. Blake Ruprecht — [blakeruprecht.com](https://blakeruprecht.com)
**Role:** Technical writer, CompSci + MechE

- **Layout:** "Hi, I'm Blake" → short bio → example writing links → contact links.
- **Text:** ~100 words. Clear, direct.
- **What makes it work:** Writing samples as the portfolio. Resume linked as PDF. Contact at the bottom.

#### 12. Patrick Prunty — [patrickprunty.com](https://patrickprunty.com)
**Role:** Developer/writer

- **Layout:** Blog posts as primary content.
- **Text:** Post titles with one-line descriptions.
- **What makes it work:** Newsletter/blog-forward approach. Content IS the credential.

#### 13. Manuel Moreale — [manuelmoreale.com](https://manuelmoreale.com)
**Role:** Web developer/writer

- **Layout:** Pure blog. Latest post → archive by month/year.
- **Text:** Long-form writing as the entire site.
- **What makes it work:** The ultimate "content is king" approach. The site itself is so minimal it's basically a styled RSS feed.

#### 14. Rauno Freiberg — [rauno.me](https://rauno.me)
**Role:** Staff Design Engineer at Vercel

- **Layout:** OS-metaphor with dock navigation. Very creative but unique.
- **Sections:** Home → Craft → Writing. The "Craft" page showcases interaction design experiments.
- **What makes it work:** The craft page is brilliant — small interactive demos that prove skill better than any resume.
- **Note:** This is MORE designed than what we want, but the `/craft` page concept (small demos) is worth noting.

#### 15. Lauren Waller — [lauren-waller.com](https://lauren-waller.com)
**Role:** Product designer

- **Layout:** Name + short bio → large navigation links (Work, About, Shop, Contact) with hover effects.
- **Text:** ~30 words. Bio is one sentence.
- **What makes it work:** No header, no footer. Maximum minimalism. The page IS the navigation.

---

## Common Patterns

### Homepage Structure (Most Common Order)

1. **Name/Title** — Always first. Your name, your role in ~5 words.
2. **Short Bio** — 1-3 sentences max. Who you are, where you work, what you care about.
3. **Links/Navigation** — To deeper content (projects, writing, about, contact).
4. **Recent Work or Writing** — 3-5 items maximum. No more.

### What Almost Everyone Does

| Pattern | Frequency | Notes |
|---------|-----------|-------|
| Single column layout | ~80% | Narrow, centered. 600-700px max-width. |
| Name as page title | ~95% | Just the name. No taglines. |
| Short bio (< 100 words) | ~75% | Most are under 50 words |
| Inline links in prose | ~60% | Links are part of sentences, not separate sections |
| Dark/light mode toggle | ~40% | Nice to have, not required |
| Social links | ~70% | Usually GitHub, Twitter/X, LinkedIn, email |
| Blog/writing section | ~65% | Writing is the new portfolio |
| No project screenshots on homepage | ~60% | Projects linked out, not displayed inline |

### What Almost Nobody Does (on the minimal end)

- ❌ Hero images or banners
- ❌ Skill bars or percentage charts
- ❌ Testimonial sections
- ❌ "Services" sections
- ❌ Contact forms (just email links)
- ❌ Animated page transitions
- ❌ Particle effects or 3D elements
- ❌ Stock photos
- ❌ "Hire me" CTAs

---

## Typography & Color Patterns

### Typography

**Most used approach:** System font stack or one clean sans-serif.

| Font Choice | Examples Using It | Vibe |
|------------|-------------------|------|
| Inter | leerob.com, many modern sites | Clean, neutral, "designer-approved" |
| System fonts (-apple-system, etc.) | Many | Fast, native feel |
| Geist (Vercel's font) | rauno.me, leerob.com | Modern, technical |
| Serif (for writing-heavy) | frankchimero.com | Bookish, intellectual |
| Monospace accents | For code snippets, tech tags | Developer identity |

**Key observations:**
- **Font size:** Body text is usually 16-18px. Generous.
- **Line height:** 1.5-1.7. Always generous.
- **Max width:** Content rarely exceeds 680px wide. Reads like a document, not a website.
- **Headings:** Usually just bold weight of the body font, or slightly larger. No dramatic size changes.

### Color Schemes

**The three dominant approaches:**

1. **Near-black on white** (most common, ~50%)
   - Text: `#111` or `#1a1a1a` (not pure black)
   - Background: `#fff` or `#fafafa`
   - Accent: One muted color for links (blue, teal, or just underlines)
   
2. **Dark theme** (~30%)
   - Background: `#0a192f` (navy) or `#111` (near-black)
   - Text: `#ccd6f6` (light blue-gray) or `#e0e0e0`
   - Accent: Teal/cyan (`#64ffda`) or green
   - Example: brittanychiang.com
   
3. **Warm/muted** (~20%)
   - Slightly warm whites, gentle grays
   - Very subtle, almost invisible color
   - Example: frankchimero.com

**Rule of thumb:** Two colors max. Background + text. One accent for links if needed.

---

## How They Handle Projects

### Approaches (from most to least common in minimal portfolios)

#### 1. **Writing as Portfolio** (Most popular among minimal sites)
Blog posts, tutorials, and articles ARE the portfolio. No separate "projects" section.
- **Who does this:** Lee Robinson, Cassidy Williams, Josh Comeau, Patrick Prunty, Manuel Moreale
- **Format:** Title → date → one-line description → link
- **Why it works:** Shows ongoing activity, thought process, and expertise. More convincing than screenshots.

#### 2. **Simple List with Descriptions**
Project name + one-line description + link. No images.
- **Who does this:** Adam Whitcroft, Daniel Gross, Blake Ruprecht
- **Format:** 
  ```
  Project Name
  One-line description of what it does.
  Year | Link
  ```
- **Why it works:** Scannable. Respects the visitor's time. Click for details.

#### 3. **Featured Cards (3-5 max)**
Small cards with title, description, and tech tags. Maybe a subtle border or hover effect.
- **Who does this:** Brittany Chiang, Alex Pate
- **Format:** Card with title, 2-3 line description, tech pill badges
- **Why it works:** Visual enough to be interesting, minimal enough to not overwhelm.

#### 4. **Inline Links in Bio**
Projects mentioned naturally in the bio text, linked inline.
- **Who does this:** Lee Robinson, Frank Chimero, Matt Ström-Awn
- **Format:** "I work at [Vercel] on [Next.js]. Previously built [thing]."
- **Why it works:** The most natural, human way to mention your work.

#### 5. **Craft/Experiments Page**
A separate page for small demos, experiments, and interaction studies.
- **Who does this:** Rauno Freiberg (/craft)
- **Why it works:** Shows skill through doing, not telling.

### Recommendation for Julio's portfolio:
**Combine approaches 1 + 2 + 4:**
- Homepage bio with inline links to key projects
- A `/projects` page with the simple list format
- A `/writing` or `/blog` page as you grow
- Eventually a `/craft` or `/lab` page for experiments

---

## Progressive Disclosure Pattern

This is THE pattern that makes minimal portfolios work. The concept:

```
Layer 0: Homepage — Name, one paragraph, a few links (5 seconds to read)
Layer 1: Section pages — /projects, /about, /writing (30 seconds each)
Layer 2: Individual items — /projects/espejo, /writing/learning-react (2-5 min read)
Layer 3: External — GitHub repos, live demos, full articles
```

### How the best sites implement this:

| Site | Layer 0 (Homepage) | Layer 1 | Layer 2 |
|------|--------------------|---------|---------|
| leerob.com | 2 paragraphs + links | /writing, /bio | Individual blog posts |
| brittanychiang.com | Single-page scroll | (all on homepage) | External project links |
| cassidoo.co | 1 paragraph + post list | (blog posts on home) | Individual posts |
| hrescak.com | 1 paragraph + nav | /cv, /posts, /now | Individual items |
| brianlovin.com | 1 sentence + wiki nav | Multiple sections | Individual items |
| frankchimero.com | Bio prose | (minimal navigation) | External work |

### The golden rule:
**Homepage should take < 10 seconds to read.** Everything else is opt-in.

---

## Anti-Patterns to Avoid

### ❌ Things that make a portfolio feel amateur or corporate:

1. **Skill progress bars** — "JavaScript: 85%" means nothing. Don't.
2. **"About Me / Services / Contact" in a grid** — Corporate template vibes.
3. **Hero section with a stock illustration** — Undraw illustrations are a red flag.
4. **Typing animation** — "I'm a developer... I'm a designer..." Overdone.
5. **Everything on the homepage** — Resist. Less is more. Use subpages.
6. **Tech stack icon walls** — A wall of 20 technology logos is noise.
7. **Contact form** — Just use `mailto:`. A form is friction.
8. **"Built with ❤️ and React"** in the footer — Skip it.
9. **Hamburger menu on desktop** — Only use on mobile.
10. **Testimonials/recommendations** — Save for LinkedIn.
11. **Counter animations** — "50+ projects completed" feels like a SaaS landing page.
12. **"Hire me" CTA** — Too desperate. Let the work speak.

### ❌ Design sins:

- Pure black (#000) on pure white (#fff) — too harsh. Use near-black on off-white.
- More than 2 fonts — one is ideal, two maximum.
- Centered body text — left-align for readability. Center only headings if anything.
- Full-width content — max-width: 680px for text content.
- Auto-playing anything — music, videos, animations.

---

## Specific Recommendations

### For Julio's Portfolio — The Plan

#### Overall Vibe
**Target feel:** Lee Robinson meets Cassidy Williams. Minimal, honest, warm. Like talking to a real person. Not a resume, not a marketing site. A personal corner of the internet.

#### Homepage Content (Layer 0)

```
[Name]

Short bio (2-3 sentences):
- Who you are
- What you do / what you're building
- One human detail

Links row:
GitHub · LinkedIn · Email

Recent:
- 2-3 recent blog posts or projects
```

**Example bio tone:**
> Soy Julio, developer en Madrid. Estoy aprendiendo React, construyendo [Espejo](link), y documentando todo el proceso. Antes de escribir código, pasé años dirigiendo equipos de desarrollo — ahora quiero ser el que escribe.

(English version on the actual site, or bilingual)

#### Suggested Pages

| Page | Content | Priority |
|------|---------|----------|
| `/` (home) | Name + bio + recent items | Must have |
| `/projects` | List of projects with descriptions | Must have |
| `/about` | Longer bio, background, interests | Nice to have |
| `/writing` or `/blog` | Articles about learning journey | Start with 1-2 posts |
| `/now` | What you're currently doing/learning | Nice touch |
| `/uses` | Tools, setup, tech stack | Optional, fun |

#### Technical Recommendations

| Aspect | Recommendation | Why |
|--------|---------------|-----|
| **Framework** | Next.js (App Router) | Julio is learning React; this IS the project |
| **Styling** | Tailwind CSS | Industry standard, fast iteration |
| **Fonts** | Inter or Geist | Clean, professional, free |
| **Hosting** | Vercel | Free, instant deploys, made for Next.js |
| **Content** | MDX for blog posts | Write in Markdown, render as React |
| **Dark mode** | Optional (do light first) | Add later as a learning exercise |

#### Color Palette Suggestion

```css
/* Light theme (start here) */
--bg: #fafafa;
--text: #1a1a1a;
--text-secondary: #666666;
--accent: #0070f3;        /* or a subtle teal/blue */
--border: #eaeaea;

/* Dark theme (add later) */
--bg: #111111;
--text: #ededed;
--text-secondary: #888888;
--accent: #0070f3;
--border: #333333;
```

#### Typography Suggestion

```css
body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: 16px;          /* or 1rem */
  line-height: 1.7;
  max-width: 680px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}

h1 { font-size: 1.5rem; font-weight: 700; }
h2 { font-size: 1.25rem; font-weight: 600; }
```

#### Content Strategy

1. **Start with 3 projects:**
   - Espejo.day (main project)
   - One learning project from the React course
   - The portfolio itself ("I built this site with Next.js")

2. **Write 2-3 initial blog posts:**
   - "Why I'm learning to code at [age]" (honest, human)
   - "Building my first React project" (process, not tutorial)
   - "What directing AI agents taught me about software" (unique angle)

3. **Update the `/now` page monthly**

---

## Inspiration Resources

### Galleries to Browse

| Resource | URL | What it is |
|----------|-----|-----------|
| Dead Simple Sites | [deadsimplesites.com](https://deadsimplesites.com) | Curated minimal websites. Updated weekly. BEST resource. |
| Minimal Gallery | [minimal.gallery](https://minimal.gallery) | Minimal web design gallery |
| Siiimple | [siiimple.com](https://siiimple.com) | Minimalist CSS design gallery |
| Wall of Portfolios | [wallofportfolios.in/minimal](https://www.wallofportfolios.in/minimal) | Minimal portfolio specific |
| Awwwards Minimal | [awwwards.com/websites/minimal](https://www.awwwards.com/websites/minimal/) | Award-winning minimal sites |

### Specific Portfolios to Bookmark

| Site | Why | Key Learning |
|------|-----|-------------|
| [leerob.com](https://leerob.com) | Best minimal dev portfolio | Two paragraphs is enough |
| [brittanychiang.com](https://brittanychiang.com) | Most popular dev portfolio | Two-column layout, dark theme |
| [cassidoo.co](https://cassidoo.co) | Personality-first | Blog as portfolio, human tone |
| [hrescak.com](https://hrescak.com) | Perfect compact portfolio | /now page, pronunciation hint |
| [frankchimero.com](https://frankchimero.com) | Writing-first | Prose quality = design quality |
| [brianlovin.com](https://brianlovin.com) | Wiki/garden approach | Sidebar navigation, deep content |
| [adamwhitcroft.com](https://adamwhitcroft.com) | Clean project list | Simple list format for apps |
| [rauno.me/craft](https://rauno.me/craft) | Craft page concept | Show skill through demos |

### GitHub Portfolio Repos

| Repo | URL |
|------|-----|
| Developer Portfolios List | [github.com/emmabostian/developer-portfolios](https://github.com/emmabostian/developer-portfolios) |
| Lee Robinson's Site (source) | [github.com/leerob/leerob.io](https://github.com/leerob) |
| Brittany Chiang's v4 (source) | [github.com/bchiang7/v4](https://v4.brittanychiang.com/) |

---

## Summary: The 10 Commandments of a Minimal Dev Portfolio

1. **Your homepage should take 10 seconds to read.** Not 10 minutes.
2. **Two colors. One font. Max-width 680px.** That's your design system.
3. **Write like a human.** Not a resume. Not a marketing page. A person.
4. **3-5 projects max.** Quality over quantity. Link to details.
5. **Blog posts > project screenshots.** Writing proves you think.
6. **Progressive disclosure.** Simple home → detailed subpages.
7. **One personal detail.** Music, hobbies, a joke. Be a human.
8. **No skill bars. No testimonials. No hero images.** You're a developer, not a SaaS.
9. **Mobile-first.** Single column works everywhere.
10. **Ship it simple, improve later.** The best portfolio is the one that exists.

---

*"Perfection is achieved, not when there is nothing more to add, but when there is nothing left to take away." — Antoine de Saint-Exupéry*
