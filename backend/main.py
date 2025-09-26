from fastapi import FastAPI # type: ignore
from fastapi.middleware.cors import CORSMiddleware # type: ignore
from backend.api.predict import router as predict_router

app = FastAPI(title="Plant Disease Detection API")

# CORS settings to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this to your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the prediction endpoint
app.include_router(predict_router)

@app.get("/")
def home():
    return {"message": "Plant Disease Detection API is running!"}
