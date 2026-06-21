# PLANIX

PLANIX es una aplicacion para gestion de agenda y tareas de ingenieros. El backend esta implementado con Python, Django, Django Rest Framework, PostgreSQL, Docker, JWT y Swagger/OpenAPI. El frontend esta implementado con React, Vite y Tailwind CSS, siguiendo una estructura de diseno atomico.

## Estado del proyecto

El proyecto cuenta con backend y frontend funcionales, ambos dockerizados y orquestados con un unico `docker-compose.yml` en la raiz.

## Estructura

```text
backend/
  app/
    config/
    apps/
      authentication/
      users/
      roles/
      schedules/
      notifications/
      dashboard/
      audit/
    shared/
  Dockerfile
  docker-compose.yml
  requirements.txt
  README.md
  TESTING_STRATEGY.md
frontend/
  src/
    api/
    components/
      atoms/
      molecules/
      organisms/
      templates/
    constants/
    context/
    hooks/
    pages/
    router/
    utils/
  Dockerfile
  package.json
  vite.config.js
docker-compose.yml
```

## Caracteristicas principales

- Autenticacion con JWT.
- Gestion de usuarios, roles y permisos.
- CRUD de agendas.
- Validacion de conflictos de horario.
- Estados generales y estados operativos de agenda.
- Notificaciones internas basicas.
- KPIs de dashboard.
- Documentacion Swagger/OpenAPI.
- Docker Compose con PostgreSQL.
- Suite de pruebas unitarias, integracion y E2E API.

## Instrucciones para clonar repositorio

- Seleccionar un directorio
- ejecutar el comando
```bash
   git clone https://github.com/lmcadev/PLANIX.git
```

## Ejecucion local (stack completo)

Desde la raiz del repositorio:

```bash
docker compose up --build
```

Esto levanta tres servicios:

```text
db        -> PostgreSQL en localhost:5432
backend   -> Django en http://localhost:8000
frontend  -> React/Vite en http://localhost:5173
```

El frontend ya esta configurado para consumir el backend en `http://localhost:8000/api`. Si solo se necesita el backend, tambien puede levantarse de forma aislada desde `backend/` (ver `backend/README.md`).

## Migraciones

```bash
docker compose exec backend python app/manage.py migrate
```

## Crear superusuario

```bash
docker compose exec backend python app/manage.py createsuperuser
```

## Poblar datos demo

```bash
docker compose exec backend python app/manage.py seed_demo_data
```

Usuarios demo:

```text
admin@planix.local
coordinator@planix.local
reader@planix.local
engineer.one@planix.local
engineer.two@planix.local
engineer.three@planix.local
```

Contrasena:

```text
PlanixDemo123
```

## Pruebas

```bash
docker compose exec backend python app/manage.py test
```

## Documentacion API

Swagger UI:

```text
http://localhost:8000/api/docs/
```

OpenAPI schema:

```text
http://localhost:8000/api/schema/
```

## Documentacion adicional

- Backend: `backend/README.md`
- Frontend: `frontend/README.md`
- Estrategia de pruebas: `backend/TESTING_STRATEGY.md`



## Nota

Este código fue desarrollado como parte de la materia Integración Continua Grupo B02, Grupo de trabajo 10, con el objetivo de aplicar prácticas de automatización, pruebas y despliegue dentro de un entorno académico.
