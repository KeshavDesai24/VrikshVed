from fastapi import APIRouter # type: ignore

router = APIRouter()

@router.post("/predict")
async def predict():
    # later: load ML model and return predictions
    return {"message": "Prediction endpoint works!"}
