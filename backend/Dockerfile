FROM ghcr.io/astral-sh/uv:python3.13-bookworm-slim

ENV VIRTUAL_ENV=/app/.venv \
    PATH="/app/.venv/bin:$PATH"

WORKDIR /app

COPY . .

RUN uv sync --frozen

CMD ["python3", "-m", "uvicorn", "--host", "0.0.0.0", "--port", "8000", "app.app:app", "--log-config", "log_conf.yml"]
