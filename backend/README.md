# backend

## start the backend

firstly you need to create a .env file (example given in .example.env, using sqlite)

```
DATABASE_URL="<changeme>"
SECRET_KEY="<changeme>"
ALGORITHM="<changeme>"
ACCESS_TOKEN_EXPIRE_MINUTES=<changeme>
```

```bash
uv run main.py
```

## swagger

http://127.0.0.1:8000/docs

### setup some mock data :)
