'use client';

import { useState, useCallback, useRef, useEffect, type FC } from 'react';

/* ═══════════════════════════════════════════
   Crypto Demo — Interactive E2E encryption
   Shows how Espejo encrypts journal entries
   ═══════════════════════════════════════════ */

const PBKDF2_ITERATIONS = 310_000;
const STEP_LABELS = {
  es: {
    title: 'Prueba el cifrado',
    subtitle: 'Escribe algo. Mira cómo se cifra. Intenta leerlo sin la clave.',
    inputPlaceholder: 'Escribe tu entrada de diario…',
    passwordPlaceholder: 'Tu contraseña',
    btnEncrypt: 'Cifrar',
    btnDecrypt: 'Descifrar',
    btnReset: 'Empezar de nuevo',
    stepWrite: 'Escribe',
    stepKey: 'Clave',
    stepEncrypt: 'Cifrado',
    stepDecrypt: 'Descifrado',
    deriving: 'Derivando clave con PBKDF2…',
    iterations: 'iteraciones',
    encrypting: 'Cifrando con AES-256-GCM…',
    encrypted: 'Cifrado completado',
    serverSees: 'Lo que ve el servidor:',
    tryDecrypt: 'Ahora intenta leerlo',
    decryptPasswordPlaceholder: 'Introduce la contraseña',
    decrypted: 'Descifrado:',
    wrongPassword: 'Contraseña incorrecta — el servidor tampoco puede',
    note: 'Esto es exactamente lo que hace Espejo. Todo ocurre en tu navegador.',
  },
  en: {
    title: 'Try the encryption',
    subtitle: 'Write something. Watch it encrypt. Try reading it without the key.',
    inputPlaceholder: 'Write your journal entry…',
    passwordPlaceholder: 'Your password',
    btnEncrypt: 'Encrypt',
    btnDecrypt: 'Decrypt',
    btnReset: 'Start over',
    stepWrite: 'Write',
    stepKey: 'Key',
    stepEncrypt: 'Encrypted',
    stepDecrypt: 'Decrypted',
    deriving: 'Deriving key with PBKDF2…',
    iterations: 'iterations',
    encrypting: 'Encrypting with AES-256-GCM…',
    encrypted: 'Encryption complete',
    serverSees: 'What the server sees:',
    tryDecrypt: 'Now try reading it',
    decryptPasswordPlaceholder: 'Enter the password',
    decrypted: 'Decrypted:',
    wrongPassword: 'Wrong password — the server can\'t either',
    note: 'This is exactly what Espejo does. Everything happens in your browser.',
  },
  gl: {
    title: 'Proba o cifrado',
    subtitle: 'Escribe algo. Mira como se cifra. Intenta lelo sen a clave.',
    inputPlaceholder: 'Escribe a túa entrada de diario…',
    passwordPlaceholder: 'A túa contrasinal',
    btnEncrypt: 'Cifrar',
    btnDecrypt: 'Descifrar',
    btnReset: 'Comezar de novo',
    stepWrite: 'Escribe',
    stepKey: 'Clave',
    stepEncrypt: 'Cifrado',
    stepDecrypt: 'Descifrado',
    deriving: 'Derivando clave con PBKDF2…',
    iterations: 'iteracións',
    encrypting: 'Cifrando con AES-256-GCM…',
    encrypted: 'Cifrado completado',
    serverSees: 'O que ve o servidor:',
    tryDecrypt: 'Agora intenta lelo',
    decryptPasswordPlaceholder: 'Introduce o contrasinal',
    decrypted: 'Descifrado:',
    wrongPassword: 'Contrasinal incorrecta — o servidor tampouco pode',
    note: 'Isto é exactamente o que fai Espejo. Todo ocorre no teu navegador.',
  },
};

type Lang = 'es' | 'en' | 'gl';
type Phase = 'input' | 'deriving' | 'encrypting' | 'encrypted' | 'decrypting' | 'decrypted' | 'failed';

interface Props {
  lang?: string;
}

// Utility: bytes to hex string
const toHex = (buf: ArrayBuffer): string =>
  Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');

// Utility: bytes to base64
const toBase64 = (buf: ArrayBuffer): string =>
  btoa(String.fromCharCode(...new Uint8Array(buf)));

const STYLES = `
  .crypto-demo {
    background: var(--bg-secondary, #1c2320);
    border: 1px solid var(--border, #333);
    border-radius: 1rem;
    padding: 2rem;
    margin: 2rem 0;
    font-family: var(--font-body, 'DM Sans', sans-serif);
    overflow: hidden;
  }

  .crypto-demo__title {
    font-family: var(--font-display, 'Vila Morena', serif);
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 0.25rem;
  }

  .crypto-demo__subtitle {
    font-size: 0.875rem;
    color: var(--text-secondary, #888);
    margin-bottom: 1.5rem;
  }

  /* Steps indicator */
  .crypto-steps {
    display: flex;
    gap: 0;
    margin-bottom: 1.5rem;
    position: relative;
  }

  .crypto-step {
    flex: 1;
    text-align: center;
    font-size: 0.7rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--text-muted, #666);
    padding-bottom: 0.75rem;
    position: relative;
    transition: color 0.3s;
  }

  .crypto-step::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 10%;
    right: 10%;
    height: 2px;
    background: var(--border, #333);
    border-radius: 1px;
    transition: background 0.3s;
  }

  .crypto-step--active {
    color: var(--accent-text, #83DEB5);
  }

  .crypto-step--active::after {
    background: var(--accent-text, #83DEB5);
  }

  .crypto-step--done {
    color: var(--text-secondary, #888);
  }

  .crypto-step--done::after {
    background: var(--accent-text, #83DEB5);
    opacity: 0.4;
  }

  /* Input area */
  .crypto-input {
    width: 100%;
    min-height: 80px;
    padding: 1rem;
    border: 1px solid var(--border, #333);
    border-radius: 0.75rem;
    background: var(--bg-primary, #151b18);
    color: var(--text-primary);
    font-family: inherit;
    font-size: 0.9375rem;
    resize: vertical;
    outline: none;
    transition: border-color 0.2s;
  }

  .crypto-input:focus {
    border-color: var(--accent-text, #83DEB5);
  }

  .crypto-input::placeholder {
    color: var(--text-muted, #666);
  }

  .crypto-password {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 1px solid var(--border, #333);
    border-radius: 0.75rem;
    background: var(--bg-primary, #151b18);
    color: var(--text-primary);
    font-family: inherit;
    font-size: 0.9375rem;
    outline: none;
    margin-top: 0.75rem;
    transition: border-color 0.2s;
  }

  .crypto-password:focus {
    border-color: var(--accent-text, #83DEB5);
  }

  .crypto-password::placeholder {
    color: var(--text-muted, #666);
  }

  /* Buttons */
  .crypto-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.7rem 1.5rem;
    border: none;
    border-radius: 0.5rem;
    font-family: inherit;
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    transition: opacity 0.2s, transform 0.1s;
    margin-top: 1rem;
  }

  .crypto-btn:active {
    transform: scale(0.97);
  }

  .crypto-btn--primary {
    background: var(--accent-text, #83DEB5);
    color: #0a2618;
  }

  .crypto-btn--ghost {
    background: transparent;
    color: var(--text-secondary, #888);
    border: 1px solid var(--border, #333);
  }

  .crypto-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  /* Status */
  .crypto-status {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-top: 1rem;
    font-size: 0.8125rem;
    color: var(--text-secondary, #888);
  }

  .crypto-spinner {
    width: 16px;
    height: 16px;
    border: 2px solid var(--border, #333);
    border-top-color: var(--accent-text, #83DEB5);
    border-radius: 50%;
    animation: crypto-spin 0.6s linear infinite;
  }

  @keyframes crypto-spin {
    to { transform: rotate(360deg); }
  }

  .crypto-counter {
    font-variant-numeric: tabular-nums;
    font-family: 'SF Mono', 'Fira Code', monospace;
    font-size: 0.75rem;
    color: var(--accent-text, #83DEB5);
  }

  /* Cipher output */
  .crypto-output {
    margin-top: 1rem;
    padding: 1rem;
    border-radius: 0.75rem;
    background: var(--bg-primary, #151b18);
    border: 1px solid var(--border, #333);
    font-family: 'SF Mono', 'Fira Code', monospace;
    font-size: 0.75rem;
    line-height: 1.5;
    word-break: break-all;
    color: var(--text-muted, #666);
    max-height: 120px;
    overflow-y: auto;
    position: relative;
  }

  .crypto-output--success {
    border-color: var(--accent-text, #83DEB5);
    color: var(--text-primary);
    font-family: inherit;
    font-size: 0.9375rem;
  }

  .crypto-output--fail {
    border-color: #c4553a;
  }

  .crypto-label {
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--text-muted, #666);
    margin-top: 1.25rem;
    margin-bottom: 0.5rem;
  }

  .crypto-note {
    margin-top: 1.5rem;
    padding: 0.75rem 1rem;
    border-left: 3px solid var(--accent-text, #83DEB5);
    font-size: 0.8125rem;
    color: var(--text-secondary, #888);
    background: var(--bg-primary, #151b18);
    border-radius: 0 0.5rem 0.5rem 0;
  }

  /* Key visualization */
  .crypto-key-viz {
    display: flex;
    gap: 2px;
    flex-wrap: wrap;
    margin-top: 0.5rem;
  }

  .crypto-key-byte {
    width: 6px;
    height: 12px;
    border-radius: 1px;
    background: var(--accent-text, #83DEB5);
    opacity: 0.15;
    transition: opacity 0.1s;
  }

  .crypto-key-byte--lit {
    opacity: 0.8;
  }

  @media (prefers-reduced-motion: reduce) {
    .crypto-spinner { animation: none; }
    .crypto-key-byte { transition: none; }
  }
`;

const CryptoDemo: FC<Props> = ({ lang = 'es' }) => {
  const l = STEP_LABELS[(lang as Lang)] || STEP_LABELS.es;
  const [phase, setPhase] = useState<Phase>('input');
  const [plaintext, setPlaintext] = useState('');
  const [password, setPassword] = useState('');
  const [decryptPassword, setDecryptPassword] = useState('');
  const [cipherHex, setCipherHex] = useState('');
  const [decryptedText, setDecryptedText] = useState('');
  const [iterProgress, setIterProgress] = useState(0);
  const [keyBytes, setKeyBytes] = useState<number[]>([]);

  // Store encrypted data for decryption
  const encryptedRef = useRef<{ iv: Uint8Array; salt: Uint8Array; ciphertext: ArrayBuffer } | null>(null);

  const getStepState = (step: number) => {
    const phaseOrder: Record<Phase, number> = {
      input: 0, deriving: 1, encrypting: 2, encrypted: 3,
      decrypting: 3, decrypted: 4, failed: 3,
    };
    const current = phaseOrder[phase];
    if (step === current) return 'active';
    if (step < current) return 'done';
    return '';
  };

  const deriveKey = useCallback(async (pwd: string, salt: Uint8Array): Promise<CryptoKey> => {
    const enc = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      'raw', enc.encode(pwd), 'PBKDF2', false, ['deriveKey']
    );
    return crypto.subtle.deriveKey(
      { name: 'PBKDF2', salt, iterations: PBKDF2_ITERATIONS, hash: 'SHA-256' },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    );
  }, []);

  const handleEncrypt = useCallback(async () => {
    if (!plaintext.trim() || !password.trim()) return;

    setPhase('deriving');

    // Simulate iteration counter (real PBKDF2 runs natively, can't hook into it)
    const counterInterval = setInterval(() => {
      setIterProgress(p => {
        if (p >= PBKDF2_ITERATIONS) { clearInterval(counterInterval); return PBKDF2_ITERATIONS; }
        return p + Math.floor(PBKDF2_ITERATIONS / 30);
      });
    }, 50);

    const salt = crypto.getRandomValues(new Uint8Array(16));
    const key = await deriveKey(password, salt);

    clearInterval(counterInterval);
    setIterProgress(PBKDF2_ITERATIONS);

    // Show key bytes
    const rawKey = await crypto.subtle.exportKey('raw', key);
    setKeyBytes(Array.from(new Uint8Array(rawKey)));

    await new Promise(r => setTimeout(r, 600));
    setPhase('encrypting');

    const iv = crypto.getRandomValues(new Uint8Array(12));
    const enc = new TextEncoder();
    const ciphertext = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      enc.encode(plaintext)
    );

    encryptedRef.current = { iv, salt, ciphertext };
    setCipherHex(toBase64(ciphertext));

    await new Promise(r => setTimeout(r, 400));
    setPhase('encrypted');
  }, [plaintext, password, deriveKey]);

  const handleDecrypt = useCallback(async () => {
    if (!decryptPassword.trim() || !encryptedRef.current) return;
    setPhase('decrypting');

    try {
      const { iv, salt, ciphertext } = encryptedRef.current;
      const key = await deriveKey(decryptPassword, salt);
      const decrypted = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv }, key, ciphertext
      );
      const dec = new TextDecoder();
      setDecryptedText(dec.decode(decrypted));
      setPhase('decrypted');
    } catch {
      setPhase('failed');
    }
  }, [decryptPassword, deriveKey]);

  const handleReset = useCallback(() => {
    setPhase('input');
    setPlaintext('');
    setPassword('');
    setDecryptPassword('');
    setCipherHex('');
    setDecryptedText('');
    setIterProgress(0);
    setKeyBytes([]);
    encryptedRef.current = null;
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <div className="crypto-demo">
        <div className="crypto-demo__title">{l.title}</div>
        <div className="crypto-demo__subtitle">{l.subtitle}</div>

        {/* Step indicators */}
        <div className="crypto-steps">
          {[l.stepWrite, l.stepKey, l.stepEncrypt, l.stepDecrypt].map((label, i) => (
            <div key={i} className={`crypto-step crypto-step--${getStepState(i + 1)}`}>
              {label}
            </div>
          ))}
        </div>

        {/* Phase: Input */}
        {phase === 'input' && (
          <div>
            <textarea
              className="crypto-input"
              placeholder={l.inputPlaceholder}
              value={plaintext}
              onChange={e => setPlaintext(e.target.value)}
              rows={3}
            />
            <input
              type="password"
              className="crypto-password"
              placeholder={l.passwordPlaceholder}
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleEncrypt()}
            />
            <div>
              <button
                className="crypto-btn crypto-btn--primary"
                onClick={handleEncrypt}
                disabled={!plaintext.trim() || !password.trim()}
              >
                🔒 {l.btnEncrypt}
              </button>
            </div>
          </div>
        )}

        {/* Phase: Deriving key */}
        {phase === 'deriving' && (
          <div>
            <div className="crypto-status">
              <div className="crypto-spinner" />
              <span>{l.deriving}</span>
            </div>
            <div className="crypto-counter">
              {iterProgress.toLocaleString()} / {PBKDF2_ITERATIONS.toLocaleString()} {l.iterations}
            </div>
            {keyBytes.length > 0 && (
              <div className="crypto-key-viz">
                {keyBytes.map((b, i) => (
                  <div
                    key={i}
                    className={`crypto-key-byte ${i < Math.floor(keyBytes.length * (iterProgress / PBKDF2_ITERATIONS)) ? 'crypto-key-byte--lit' : ''}`}
                    style={{ height: `${8 + (b / 255) * 12}px` }}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Phase: Encrypting */}
        {phase === 'encrypting' && (
          <div>
            <div className="crypto-status">
              <div className="crypto-spinner" />
              <span>{l.encrypting}</span>
            </div>
          </div>
        )}

        {/* Phase: Encrypted — show cipher + decrypt form */}
        {(phase === 'encrypted' || phase === 'decrypting' || phase === 'failed') && (
          <div>
            <div className="crypto-label">{l.serverSees}</div>
            <div className="crypto-output">{cipherHex}</div>

            <div className="crypto-label">{l.tryDecrypt}</div>
            <input
              type="password"
              className={`crypto-password${phase === 'failed' ? ' crypto-output--fail' : ''}`}
              placeholder={l.decryptPasswordPlaceholder}
              value={decryptPassword}
              onChange={e => { setDecryptPassword(e.target.value); if (phase === 'failed') setPhase('encrypted'); }}
              onKeyDown={e => e.key === 'Enter' && handleDecrypt()}
              style={phase === 'failed' ? { borderColor: '#c4553a' } : undefined}
            />
            {phase === 'failed' && (
              <div style={{ color: '#c4553a', fontSize: '0.8125rem', marginTop: '0.5rem' }}>
                ✗ {l.wrongPassword}
              </div>
            )}
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                className="crypto-btn crypto-btn--primary"
                onClick={handleDecrypt}
                disabled={!decryptPassword.trim() || phase === 'decrypting'}
              >
                🔓 {l.btnDecrypt}
              </button>
              <button className="crypto-btn crypto-btn--ghost" onClick={handleReset}>
                {l.btnReset}
              </button>
            </div>
          </div>
        )}

        {/* Phase: Decrypted */}
        {phase === 'decrypted' && (
          <div>
            <div className="crypto-label">{l.decrypted}</div>
            <div className="crypto-output crypto-output--success">{decryptedText}</div>
            <div className="crypto-note">{l.note}</div>
            <div>
              <button className="crypto-btn crypto-btn--ghost" onClick={handleReset} style={{ marginTop: '1rem' }}>
                {l.btnReset}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CryptoDemo;
