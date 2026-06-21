# PLANIX Frontend

Frontend de PLANIX construido con React, Vite y Tailwind CSS, siguiendo una estructura de diseno atomico (atoms, molecules, organisms, templates, pages).

## Requisitos

- Node 20 o superior (si se ejecuta sin Docker)
- Docker y Docker Compose (recomendado)

## Ejecucion con Docker (stack completo)

Desde la raiz del repositorio:

```bash
docker compose up --build
```

El frontend queda disponible en:

```text
http://localhost:5173
```

## Ejecucion sin Docker

```bash
npm install
npm run dev
```

## Variables de entorno

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

Ver `.env.example`. Si no se define, el valor por defecto ya apunta al backend local.

## Estructura

```text
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
```

## Build de produccion

```bash
npm run build
npm run preview
```
