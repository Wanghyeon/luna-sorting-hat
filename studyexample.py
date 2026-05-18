from deepface import DeepFace

# 사진에서 얼굴을 찾아 128개 혹은 그 이상의 숫자 리스트로 변환
embedding_objs = DeepFace.represent(img_path="friend_face.jpg", model_name="Facenet")

# 추출된 임베딩 값 (숫자 리스트)
embedding = embedding_objs[0]["embedding"]
print(embedding)  # [-0.05, 0.12, 0.87, ... 총 128개 혹은 그 이상의 숫자들]

from sklearn.svm import SVC
import numpy as np
###########################################################
# X_train: 친구들 사진에서 추출한 임베딩 리스트들의 모음
# y_train: 각 임베딩에 해당하는 학과 이름 (예: '디콘', '해방' 등)
X_train = [...] 
y_train = [...]

# 기계학습 모델 생성 및 학습
clf = SVC(kernel='linear', probability=True)
clf.fit(X_train, y_train)

# 새로운 친구 사진으로 테스트해보기!
new_face_embedding = DeepFace.represent(img_path="new_friend.jpg", model_name="Facenet")[0]["embedding"]

# 어느 과에 가까운지 예측
prediction = clf.predict([new_face_embedding])
probability = clf.predict_proba([new_face_embedding])

print(f"이 친구는 {prediction[0]}과 관상입니다!")