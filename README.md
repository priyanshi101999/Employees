# Employee Manager

FastAPI + PostgreSQL backend, React + Tailwind frontend.

## Database

Create a database in Postgres:

    CREATE DATABASE employees_db;

The `employees` table is created by the Alembic migration (see Backend).

## Backend

    cd backend
    python -m venv venv
    source venv/bin/activate        # Windows: venv\Scripts\activate
    pip install -r requirements.txt
    cp .env.example .env            # update DATABASE_URL if needed
    alembic upgrade head
    uvicorn main:app --reload

API runs on http://localhost:8000 (docs at /docs).

## Frontend

    cd frontend
    npm install
    npm run dev

App runs on http://localhost:5173.

## Migrations

After changing `models.py`:

    alembic revision --autogenerate -m "describe the change"
    alembic upgrade head

Roll back one step with `alembic downgrade -1`.
