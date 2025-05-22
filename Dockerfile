# 1. Backend
FROM python:3.10-slim AS backend

WORKDIR /app/backend
COPY backend/requirements.txt .
RUN pip install -r requirements.txt
COPY backend .

# 2. Frontend
FROM node:18 AS frontend
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm install
COPY frontend .
RUN npm run build

# 3. Final
FROM python:3.10-slim

WORKDIR /app
COPY --from=backend /app/backend /app/backend
COPY --from=frontend /app/frontend/dist /app/backend/static

WORKDIR /app/backend
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
