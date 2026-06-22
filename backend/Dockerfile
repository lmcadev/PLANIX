# Imagen base liviana con Python 3.12 para ejecutar Django.
FROM python:3.12-slim

# Evita archivos .pyc y fuerza logs sin buffer para verlos en docker logs.
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /code

# Dependencias del sistema requeridas para psycopg2/PostgreSQL y compilacion de
# paquetes Python que puedan necesitar extensiones nativas.
RUN apt-get update \
    && apt-get install -y --no-install-recommends build-essential libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Instala primero dependencias para aprovechar la cache de Docker cuando cambia
# el codigo pero no requirements.txt.
COPY requirements.txt /code/
RUN pip install --no-cache-dir -r requirements.txt

# Copia la aplicacion Django al contenedor.
COPY . /code/

RUN chmod +x /code/entrypoint.sh

EXPOSE 8000

# El entrypoint espera PostgreSQL, aplica migraciones y recolecta estaticos antes
# de ejecutar el comando final.
ENTRYPOINT ["sh", "/code/entrypoint.sh"]
CMD ["python", "app/manage.py", "runserver", "0.0.0.0:8000"]
