#!/usr/bin/env sh
set -eu

: "${DEPLOY_PATH:?DEPLOY_PATH is required}"
: "${REPOSITORY_URL:?REPOSITORY_URL is required}"
: "${DEPLOY_BRANCH:=main}"
: "${ENV_FILE_CONTENT:?ENV_FILE_CONTENT is required}"
: "${RUN_INITIALIZER:=false}"

if [ ! -d "$DEPLOY_PATH/.git" ]; then
  mkdir -p "$DEPLOY_PATH"
  git clone --branch "$DEPLOY_BRANCH" "$REPOSITORY_URL" "$DEPLOY_PATH"
fi

cd "$DEPLOY_PATH"

git fetch origin "$DEPLOY_BRANCH"
git checkout "$DEPLOY_BRANCH"
git reset --hard "origin/$DEPLOY_BRANCH"

printf "%s\n" "$ENV_FILE_CONTENT" > .env.production
chmod 600 .env.production

docker compose -f docker-compose.prod.yml up -d --build --remove-orphans

if [ "$RUN_INITIALIZER" = "true" ]; then
  docker exec planix_backend python app/manage.py initialize_database
fi

docker image prune -f
