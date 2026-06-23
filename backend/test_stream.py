import httpx

url = "http://localhost:8000/chat"
payload = {
    "session_id": "test",
    "message": "Write a detailed essay about artificial intelligence",
}

with httpx.Client(timeout=httpx.Timeout(300.0)) as client:
    with client.stream("POST", url, json=payload) as response:
        response.raise_for_status()
        for chunk in response.iter_text():
            print(chunk, end="", flush=True)

print()
