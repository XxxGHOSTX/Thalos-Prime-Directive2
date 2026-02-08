# THALOS PRIME Dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application files
COPY *.py .
COPY *.html .

# Expose ports
EXPOSE 5000 5001

# Set environment variables
ENV THALOS_SECRET=primordial_entropy_key_v1_0_0
ENV PYTHONUNBUFFERED=1

# Run the orchestrator
CMD ["python", "deploy_server.py"]
