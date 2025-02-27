from fastapi import FastAPI
import uvicorn

app = FastAPI()

@app.get("/")
def root():
    return {"message": "Welcome to FastAPI!"}

@app.get("/ping")
def ping():
    return {"message": "Pong!"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
