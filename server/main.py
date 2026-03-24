from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from routes import analyze, enhance, history, auth

app = FastAPI(title="AI Image Quality Inspector API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Need to serve these directories so frontend can load them
app.mount("/static/uploads", StaticFiles(directory="uploads"), name="uploads")
app.mount("/static/enhanced", StaticFiles(directory="enhanced"), name="enhanced")

app.include_router(analyze.router)
app.include_router(enhance.router)
app.include_router(history.router, prefix="/history")
app.include_router(auth.router, prefix="/auth")

@app.get("/")
async def root():
    return {"message": "AI Image Quality Inspector API is running"}
