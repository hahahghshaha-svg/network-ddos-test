export default async function handler(req, res) {
    const url = new URL(req.url);
    const target = url.searchParams.get('target');
    const count = parseInt(url.searchParams.get('count') || '100');
    
    if (!target) {
        return res.status(400).send("TARGET_MISSING");
    }
    
    try {
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
        return res.status(200).send(`OK: ${count} requests sent`);
    } catch (err) {
        return res.status(500).send(`ERROR: ${err.message}`);
    }
}
