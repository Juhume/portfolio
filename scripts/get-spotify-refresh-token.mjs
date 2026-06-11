#!/usr/bin/env node
/**
 * Obtiene el refresh token de Spotify para la tarjeta "Ahora suena".
 *
 * Uso:
 *   node scripts/get-spotify-refresh-token.mjs CLIENT_ID CLIENT_SECRET
 *
 * Requisito: la app de Spotify debe tener registrada esta Redirect URI EXACTA:
 *   http://127.0.0.1:8888/callback
 *
 * El script levanta un servidor local, abre la URL de autorización,
 * captura el callback y te imprime el refresh token. No guarda nada.
 */

import { createServer } from 'node:http';

const [clientId, clientSecret] = process.argv.slice(2);

if (!clientId || !clientSecret) {
    console.error('Uso: node scripts/get-spotify-refresh-token.mjs CLIENT_ID CLIENT_SECRET');
    process.exit(1);
}

const REDIRECT_URI = 'http://127.0.0.1:8888/callback';
const SCOPES = 'user-read-currently-playing user-read-recently-played';

const authUrl =
    'https://accounts.spotify.com/authorize' +
    `?client_id=${encodeURIComponent(clientId)}` +
    '&response_type=code' +
    `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
    `&scope=${encodeURIComponent(SCOPES)}`;

const server = createServer(async (req, res) => {
    const url = new URL(req.url, REDIRECT_URI);
    if (url.pathname !== '/callback') {
        res.writeHead(404).end();
        return;
    }

    const code = url.searchParams.get('code');
    const error = url.searchParams.get('error');

    if (error || !code) {
        res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end(`Autorización rechazada: ${error || 'sin código'}`);
        console.error(`\n✗ Autorización rechazada: ${error || 'sin código'}`);
        server.close();
        process.exit(1);
    }

    try {
        const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
            },
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                code,
                redirect_uri: REDIRECT_URI,
            }),
        });

        const data = await tokenRes.json();

        if (!data.refresh_token) {
            throw new Error(JSON.stringify(data));
        }

        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end('<body style="font-family:sans-serif;display:grid;place-items:center;height:100vh"><h2>🐙 Listo. Vuelve a la terminal.</h2></body>');

        console.log('\n✓ Refresh token obtenido. Variables para Vercel:\n');
        console.log(`SPOTIFY_CLIENT_ID=${clientId}`);
        console.log(`SPOTIFY_CLIENT_SECRET=${clientSecret}`);
        console.log(`SPOTIFY_REFRESH_TOKEN=${data.refresh_token}`);
        console.log('\nGuárdalas en Vercel (Settings → Environment Variables) y redeploya.');
    } catch (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Error intercambiando el código. Mira la terminal.');
        console.error('\n✗ Error intercambiando el código:', err.message);
    } finally {
        server.close();
        setTimeout(() => process.exit(0), 100);
    }
});

server.listen(8888, '127.0.0.1', () => {
    console.log('Servidor esperando el callback en ' + REDIRECT_URI);
    console.log('\nAbre esta URL en el navegador y acepta los permisos:\n');
    console.log(authUrl + '\n');
});
