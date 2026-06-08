# Estrategia de pruebas

Este documento define la estrategia de pruebas del backend de PLANIX en tres niveles: unitarias, integracion y end-to-end.

## Objetivos

- Validar reglas de negocio criticas.
- Detectar regresiones en autenticacion, autorizacion y permisos.
- Verificar endpoints principales.
- Asegurar que los flujos funcionales operen sobre PostgreSQL.
- Mantener una suite clara y mantenible.

## Pruebas unitarias

Cubren servicios, serializers, permisos y calculos de negocio de forma aislada.

Casos implementados:

- Validacion de rangos de agenda.
- Deteccion de conflictos de horario.
- Exclusion de agendas canceladas al calcular disponibilidad.
- Calculo de KPIs.

## Pruebas de integracion

Cubren endpoints, persistencia y contratos entre modulos.

Casos implementados:

- Registro, login, refresh y logout.
- CRUD protegido de usuarios.
- Gestion de roles y permisos.
- Creacion y validacion de agendas.
- Actualizacion de estado operativo.
- Listado y lectura de notificaciones.
- Consulta de dashboard.
- Disponibilidad de Swagger/OpenAPI.

## Pruebas E2E

Cubren flujos completos usando la API como caja negra.

Flujos implementados:

- Coordinador crea agenda y el ingeniero asignado actualiza el estado operativo.
- Conflicto horario bloquea agendas para el mismo usuario y permite agendas para usuarios distintos.

## Comandos

Ejecutar toda la suite:

```bash
docker compose exec web python app/manage.py test
```

Ejecutar con detalle:

```bash
docker compose exec web python app/manage.py test -v 2
```

Ejecutar un modulo:

```bash
docker compose exec web python app/manage.py test apps.schedules
```

## Datos demo

El comando `seed_demo_data` crea usuarios, roles, permisos, agendas y notificaciones para pruebas manuales:

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
