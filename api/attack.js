export const config = { runtime: 'edge' };

export default async function handler(request) {
    const url = new URL(request.url);
    const target = url.searchParams.get('target');
    const count = parseInt(url.searchParams.get('count') || '100');
    
    if (!target) {
        return new Response("TARGET_MISSING", { status: 400 });
    }
    
    const promises = [];
    for (let i = 0; i < Math.min(count, 500); i++) {
        promises.push(
            fetch(target, {
                method: 'GET',
                headers: { 'User-Agent': 'Mozilla/5.0' },
                cache: 'no-store'
            }).catch(() => null)
        );
    }
    
    await Promise.allSettled(promises);
    return new Response(`OK: ${count} requests sent to ${target}`);
}
