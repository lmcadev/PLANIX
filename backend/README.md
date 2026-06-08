# PLANIX Backend

Backend para una aplicacion de gestion de agenda y tareas de ingenieros. El proyecto esta construido con Python, Django, Django Rest Framework, PostgreSQL, Simple JWT y drf-spectacular.

## Caracteristicas

- Autenticacion con JWT.
- Registro, login, refresh y logout con blacklist de refresh tokens.
- Gestion de usuarios.
- Gestion de roles y permisos.
- CRUD completo de agendas.
- Validacion de conflictos de horario por usuario asignado.
- Estados generales de agenda: disponible, ocupado, cancelado y finalizado.
- Estados operativos: en espera, en proceso, finalizado, cancelado y aplazado.
- Soporte basico para recurrencia y fechas salteadas.
- Notificaciones internas basicas.
- Dashboard/KPIs basicos.
- Swagger/OpenAPI.
- Docker y Docker Compose con PostgreSQL.

## Arquitectura

El backend usa un monolito modular con separacion por dominios:

```text
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
    services/
    validators/
    permissions/
    exceptions/
```

Cada modulo organiza sus responsabilidades en modelos, serializers, views, urls, servicios y pruebas. Las reglas de negocio principales, como la validacion de conflictos de agenda, se mantienen fuera de las vistas para favorecer mantenibilidad y pruebas.

## Requisitos

- Docker
- Docker Compose

No se usa SQLite. La base de datos configurada es PostgreSQL.

## Variables de entorno

El archivo `.env.example` contiene las variables necesarias para desarrollo local con Docker. Para ambientes reales, cree un archivo `.env` con valores seguros y no versionados.

Variables principales:

```env
DEBUG=True
SECRET_KEY=change-me-in-production
ALLOWED_HOSTS=localhost,127.0.0.1,0.0.0.0
POSTGRES_DB=planix_db
POSTGRES_USER=planix_user
POSTGRES_PASSWORD=planix_password
POSTGRES_HOST=db
POSTGRES_PORT=5432
```

## Ejecucion con Docker

Desde la raiz del backend:

```bash
cd backend
docker compose up --build
```

El servicio web queda disponible en:

```text
http://localhost:8000
```

PostgreSQL queda expuesto en:

```text
localhost:5432
```

## Migraciones

Ejecute:

```bash
docker compose exec web python app/manage.py migrate
```

El contenedor `web` tambien ejecuta las migraciones automaticamente al iniciar. Este comando sigue siendo util cuando se agregan nuevas migraciones durante desarrollo.

## Crear superusuario

Ejecute:

```bash
docker compose exec web python app/manage.py createsuperuser
```

El identificador de acceso es el email.

## Poblar datos demo

El proyecto incluye un comando idempotente para crear datos iniciales de desarrollo: permisos, roles, usuarios, agendas, fechas de excepcion y notificaciones. Crea mas de 15 registros en total.

Ejecute:

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

Contrasena demo:

```text
PlanixDemo123
```

## Ejecutar tests

Ejecute:

```bash
docker compose exec web python app/manage.py test
```

La estrategia completa de pruebas unitarias, integracion y E2E esta documentada en `TESTING_STRATEGY.md`.

## Documentacion OpenAPI

Schema:

```text
GET /api/schema/
```

Swagger UI:

```text
GET /api/docs/
```

## Endpoints principales

Autenticacion:

```text
POST /api/auth/register/
POST /api/auth/login/
POST /api/auth/refresh/
POST /api/auth/logout/
```

Usuarios:

```text
GET    /api/users/
GET    /api/users/{id}/
POST   /api/users/
PUT    /api/users/{id}/
DELETE /api/users/{id}/
```

Roles:

```text
GET    /api/roles/
POST   /api/roles/
PUT    /api/roles/{id}/
DELETE /api/roles/{id}/
```

Permisos:

```text
GET    /api/permissions/
POST   /api/permissions/
PUT    /api/permissions/{id}/
DELETE /api/permissions/{id}/
```

Agendas:

```text
GET    /api/schedules/
GET    /api/schedules/{id}/
POST   /api/schedules/
PUT    /api/schedules/{id}/
DELETE /api/schedules/{id}/
PATCH  /api/schedules/{id}/operational-status/
```

Notificaciones:

```text
GET   /api/notifications/
PATCH /api/notifications/{id}/read/
```

Dashboard:

```text
GET /api/dashboard/kpis/
```

## Roles esperados

El sistema valida nombres de rol en minusculas:

- `admin`: puede gestionar usuarios, roles, permisos y agendas.
- `coordinator`: puede crear y editar agendas.
- `readonly`: puede consultar informacion.

Adicionalmente, se soporta el permiso funcional `schedules:write` para permitir escritura sobre agendas sin depender solo del nombre del rol.

## Reglas de negocio implementadas

- `end_datetime` debe ser mayor que `start_datetime`.
- No se permite crear o actualizar una agenda si cruza con otra agenda activa del mismo usuario.
- Las agendas canceladas no bloquean disponibilidad.
- Solo usuarios autorizados pueden crear, editar o eliminar agendas.
- El usuario asignado puede actualizar su estado operativo.
- Los usuarios autenticados pueden consultar informacion segun permisos de cada modulo.
- Al crear una agenda se genera una notificacion interna para el usuario asignado.

## Ejemplo de creacion de agenda

```json
{
  "title": "Mantenimiento preventivo",
  "description": "Revision de sitio",
  "assigned_user": 2,
  "start_datetime": "2026-06-09T09:00:00-05:00",
  "end_datetime": "2026-06-09T11:00:00-05:00",
  "location": "Bogota",
  "meeting_link": "https://meet.example.com/planix",
  "status": "busy",
  "operational_status": "waiting",
  "is_recurring": true,
  "recurrence_type": "weekly",
  "recurrence_interval": 1,
  "recurrence_end_date": "2026-08-31",
  "exception_dates": [
    {"exception_date": "2026-07-20"}
  ]
}
```
