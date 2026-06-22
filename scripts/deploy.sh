#!/usr/bin/env sh
set -eu

# Variables obligatorias recibidas desde GitHub Actions por SSH.
: "${DEPLOY_PATH:?DEPLOY_PATH is required}"
: "${REPOSITORY_URL:?REPOSITORY_URL is required}"
: "${DEPLOY_BRANCH:=main}"
: "${ENV_FILE_CONTENT:?ENV_FILE_CONTENT is required}"
: "${RUN_INITIALIZER:=false}"

# Primer despliegue: si el repositorio no existe en el VPS, se clona en la ruta
# configurada por DEPLOY_PATH.
if [ ! -d "$DEPLOY_PATH/.git" ]; then
  mkdir -p "$DEPLOY_PATH"
  git clone --branch "$DEPLOY_BRANCH" "$REPOSITORY_URL" "$DEPLOY_PATH"
fi

cd "$DEPLOY_PATH"

# En despliegues posteriores se fuerza el codigo local a coincidir con la rama
# remota que activo el workflow.
git fetch origin "$DEPLOY_BRANCH"
git checkout "$DEPLOY_BRANCH"
git reset --hard "origin/$DEPLOY_BRANCH"

# El contenido de .env.production viene desde el secreto PRODUCTION_ENV de
# GitHub Actions. Se escribe con permisos restringidos en el VPS.
printf "%s\n" "$ENV_FILE_CONTENT" > .env.production
chmod 600 .env.production

# Reconstruye y levanta la version productiva en segundo plano, eliminando
# contenedores que ya no pertenezcan al compose actual.
docker compose -f docker-compose.prod.yml up -d --build --remove-orphans

# Inicializador opcional para la primera puesta en marcha del servidor.
if [ "$RUN_INITIALIZER" = "true" ]; then
  docker exec planix_backend python app/manage.py initialize_database
fi

# Limpieza de imagenes antiguas para reducir uso de disco en el VPS.
docker image prune -f
