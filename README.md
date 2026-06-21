# PLANIX

PLANIX es una aplicacion para gestion de agenda y tareas de ingenieros. Esta version contiene el backend implementado con Python, Django, Django Rest Framework, PostgreSQL, Docker, JWT y Swagger/OpenAPI.

## Estado del proyecto

Actualmente solo se encuentra implementada la capa backend. Sin embargo, los endpoints pueden ser consultados y probados a través de Swagger UI y mediante la colección de Postman que se comparte.

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

## Ejecucion local

Desde la raiz del repositorio:

```bash
cd backend
docker compose up --build
```

El backend queda disponible en:

```text
http://localhost:8000
```

## Migraciones

```bash
docker compose exec web python app/manage.py migrate
```

## Crear superusuario

```bash
docker compose exec web python app/manage.py createsuperuser
```

## Poblar datos demo

```bash
docker compose exec web python app/manage.py seed_demo_data
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
docker compose exec web python app/manage.py test
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
- Estrategia de pruebas: `backend/TESTING_STRATEGY.md`

## Nota

Este código fue desarrollado como parte de la materia Integración Continua Grupo B02, Grupo de trabajo 10, con el objetivo de aplicar prácticas de automatización, pruebas y despliegue dentro de un entorno académico.
