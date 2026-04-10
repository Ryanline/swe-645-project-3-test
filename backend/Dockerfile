# This Dockerfile packages the FastAPI backend for local testing and Kubernetes deployment.
# It installs Python dependencies and starts the API with Uvicorn on port 8000.
FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app ./app

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
