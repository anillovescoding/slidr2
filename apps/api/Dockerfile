FROM python:3.12-slim

WORKDIR /app

# Install dependencies avoiding cache optimizations for fresh layers
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application logic
COPY . .

# Expose internal execution port mapping
EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
