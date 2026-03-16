import asyncio
import aiohttp
import time
import statistics

# Configuration
BASE_URL = "http://localhost:8083" # Using the frontend port which is serving mock data
# Or backend if running: "http://localhost:8000/api/v1"
CONCURRENT_USERS = 50
TOTAL_REQUESTS = 500
ENDPOINT = "/api/v1/reference/card-types" # Example endpoint

async def make_request(session, user_id):
    url = f"http://localhost:8000/api/v1/reference/card-types"
    try:
        start_time = time.perf_counter()
        async with session.get(url) as response:
            status = response.status
            await response.text()
            end_time = time.perf_counter()
            return end_time - start_time, status
    except Exception as e:
        return None, str(e)

async def run_load_test():
    print(f"Starting load test with {CONCURRENT_USERS} concurrent users...")
    print(f"Total requests to send: {TOTAL_REQUESTS}")
    
    async with aiohttp.ClientSession() as session:
        tasks = []
        for i in range(TOTAL_REQUESTS):
            tasks.append(make_request(session, i))
        
        # We use a semaphore to limit concurrency
        semaphore = asyncio.Semaphore(CONCURRENT_USERS)
        
        async def sem_task(task):
            async with semaphore:
                return await task
        
        start_time = time.perf_counter()
        results = await asyncio.gather(*(sem_task(t) for t in tasks))
        end_time = time.perf_counter()
        
    total_time = end_time - start_time
    durations = [r[0] for r in results if r[0] is not None]
    statuses = [r[1] for r in results]
    
    success_count = sum(1 for s in statuses if s == 200)
    error_count = TOTAL_REQUESTS - success_count
    
    print("
--- Load Test Results ---")
    print(f"Total Time: {total_time:.2f} seconds")
    print(f"Requests per Second: {TOTAL_REQUESTS / total_time:.2f}")
    print(f"Successful Requests: {success_count}")
    print(f"Failed Requests: {error_count}")
    
    if durations:
        print(f"Average Latency: {statistics.mean(durations)*1000:.2f} ms")
        print(f"Median Latency: {statistics.median(durations)*1000:.2f} ms")
        print(f"95th Percentile: {statistics.quantiles(durations, n=20)[18]*1000:.2f} ms")

if __name__ == "__main__":
    try:
        asyncio.run(run_load_test())
    except KeyboardInterrupt:
        pass
    except Exception as e:
        print(f"Error: {e}")
