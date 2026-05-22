import os
import pickle
import base64
import numpy as np
import cv2
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from deepface import DeepFace
#.\api_env\Scripts\Activate.ps1

app = FastAPI()

# React와 통신하기 위한 CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 같은 폴더에 있는 .pkl 모델 로드
MODEL_PATH = "face_department_model.pkl"
if os.path.exists(MODEL_PATH):
    with open(MODEL_PATH, 'rb') as f:
        model = pickle.load(f)
    print("🎯 학과 분류 모델 로드 완료!")
else:
    print("❌ 모델 파일을 찾을 수 없습니다. 경로를 확인해주세요.")

class ImageRequest(BaseModel):
    image: str # base64 데이터

@app.post("/api/predict")
async def predict_department(req: ImageRequest):
    try:
        # 1. Base64 이미지 디코딩
        header, encoded = req.image.split(",", 1)
        data = base64.b64decode(encoded)
        nparr = np.frombuffer(data, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        temp_path = "temp_api_capture.jpg"
        cv2.imwrite(temp_path, img)

        # 2. DeepFace 분석 (학습 때와 동일한 세팅)
        embedding_objs = DeepFace.represent(
            img_path=temp_path,
            model_name="Facenet",
            detector_backend="retinaface",
            enforce_detection=True
        )

        if os.path.exists(temp_path):
            os.remove(temp_path)

        if len(embedding_objs) == 0:
            raise HTTPException(status_code=400, detail="얼굴을 인식하지 못했습니다.")

        embedding = embedding_objs[0]["embedding"]

        # 3. 모델 예측
        prediction = model.predict([embedding])[0] # 예측값: "EB", "DC", "HD", "WP"
        
        # 4. React 컴포넌트(Analyzing.jsx)의 ID와 매칭 (HD -> hs 변환)
        dept_id = prediction.lower()
        if dept_id == "hd":
            dept_id = "hs"

        return {"success": True, "department": dept_id}

    except Exception as e:
        if os.path.exists("temp_api_capture.jpg"):
            os.remove("temp_api_capture.jpg")
        raise HTTPException(status_code=500, detail=str(e))