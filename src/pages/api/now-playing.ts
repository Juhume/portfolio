import type { APIRoute } from 'astro';

// Ruta renderizada bajo demanda (función serverless en Vercel).
// Devuelve la canción que está sonando en Spotify, o la última escuchada.
// Sin credenciales configuradas responde 204 y la web no muestra nada.
export const prerender = false;

const TOKEN_URL = 'https://accounts.spotify.com/api/token';
const NOW_PLAYING_URL = 'https://api.spotify.com/v1/me/player/currently-playing';
const RECENTLY_PLAYED_URL = 'https://api.spotify.com/v1/me/player/recently-played?limit=1';

interface TrackPayload {
    playing: boolean;
    title: string;
    artist: string;
    url?: string;
}

function jsonResponse(payload: TrackPayload): Response {
    return new Response(JSON.stringify(payload), {
        headers: {
            'Content-Type': 'application/json',
            // La CDN cachea 60s: una visita por minuto como mucho toca Spotify
            'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        },
    });
}

function empty(): Response {
    return new Response(null, { status: 204 });
}

export const GET: APIRoute = async () => {
    const clientId = import.meta.env.SPOTIFY_CLIENT_ID;
    const clientSecret = import.meta.env.SPOTIFY_CLIENT_SECRET;
    const refreshToken = import.meta.env.SPOTIFY_REFRESH_TOKEN;

    if (!clientId || !clientSecret || !refreshToken) return empty();

    try {
        const tokenRes = await fetch(TOKEN_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
            },
            body: new URLSearchParams({
                grant_type: 'refresh_token',
                refresh_token: refreshToken,
            }),
        });
        if (!tokenRes.ok) return empty();
        const { access_token: accessToken } = await tokenRes.json();
        const headers = { Authorization: `Bearer ${accessToken}` };

        const nowRes = await fetch(NOW_PLAYING_URL, { headers });
        if (nowRes.status === 200) {
            const data = await nowRes.json();
            if (data?.is_playing && data?.item?.name) {
                return jsonResponse({
                    playing: true,
                    title: data.item.name,
                    artist: data.item.artists?.map((a: { name: string }) => a.name).join(', ') ?? '',
                    url: data.item.external_urls?.spotify,
                });
            }
        }

        const recentRes = await fetch(RECENTLY_PLAYED_URL, { headers });
        if (recentRes.ok) {
            const data = await recentRes.json();
            const track = data?.items?.[0]?.track;
            if (track?.name) {
                return jsonResponse({
                    playing: false,
                    title: track.name,
                    artist: track.artists?.map((a: { name: string }) => a.name).join(', ') ?? '',
                    url: track.external_urls?.spotify,
                });
            }
        }

        return empty();
    } catch {
        return empty();
    }
};
