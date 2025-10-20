# CookGenie Backend

FastAPI backend for CookGenie application.

## Setup

1. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:
```env
DATABASE_URL=postgresql://cookgenie:cookgenie123@localhost:5432/cookgenie_db
GEMINI_API_KEY=your_gemini_api_key_here
ENVIRONMENT=development
```

5. Run the server:
```bash
python main.py
```

The API will be available at http://localhost:8000

## API Documentation

Interactive API documentation is available at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Database

The application uses PostgreSQL. Make sure PostgreSQL is installed and running.

Create the database:
```sql
CREATE DATABASE cookgenie_db;
CREATE USER cookgenie WITH PASSWORD 'cookgenie123';
GRANT ALL PRIVILEGES ON DATABASE cookgenie_db TO cookgenie;
```

Tables are created automatically on first run.

## Project Structure

```
backend/
├── app/
│   ├── api/              # API endpoints
│   ├── models/           # SQLAlchemy models
│   ├── schemas/          # Pydantic schemas
│   ├── services/         # Business logic
│   ├── config.py         # Configuration
│   └── database.py       # Database setup
├── main.py               # Application entry point
└── requirements.txt      # Python dependencies
```

## Development

Run with auto-reload:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

