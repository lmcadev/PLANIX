#!/bin/sh
set -e

python - <<'PY'
import os
import time

import psycopg2

host = os.environ.get("POSTGRES_HOST", "db")
port = os.environ.get("POSTGRES_PORT", "5432")
dbname = os.environ.get("POSTGRES_DB")
user = os.environ.get("POSTGRES_USER")
password = os.environ.get("POSTGRES_PASSWORD")

for attempt in range(30):
    try:
        psycopg2.connect(host=host, port=port, dbname=dbname, user=user, password=password).close()
        break
    except psycopg2.OperationalError:
        time.sleep(1)
else:
    raise RuntimeError("PostgreSQL no estuvo disponible despues de 30 segundos.")
PY

python app/manage.py migrate --noinput
python app/manage.py collectstatic --noinput

exec "$@"
