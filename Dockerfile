# 1. 파이썬 3.10 기반의 가벼운 리눅스 환경 사용
FROM python:3.10-slim

# 2. 이미지 처리(OpenCV, DeepFace)에 필요한 리눅스 필수 패키지 설치 (최신 libgl1 적용)
RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# 3. 서버 내부의 작업 공간 설정
WORKDIR /code

# 4. 패키지 설치를 위해 requirements.txt만 먼저 복사 후 설치
COPY ./requirements.txt /code/requirements.txt
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

# 5. 허깅페이스 환경에서 DeepFace가 모델을 다운로드받을 수 있도록 권한 설정
RUN mkdir -p /.deepface /.cache && chmod -R 777 /.deepface /.cache

# 6. 리액트 파일은 제외하고, 백엔드 필수 파일만 쏙쏙 복사!
COPY ./app.py /code/app.py
COPY ./face_department_model.pkl /code/face_department_model.pkl

# 7. 허깅페이스 포트(7860)에 맞춰 FastAPI 서버 실행
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "7860"]