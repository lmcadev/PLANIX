# Imagen para desarrollo del frontend con Node.js y Vite.
FROM node:20-alpine

WORKDIR /app

# Instala dependencias de forma reproducible usando package-lock.json.
COPY package.json package-lock.json* /app/
RUN npm ci

# Copia el codigo fuente de React/Vite.
COPY . /app/

EXPOSE 5173

# --host 0.0.0.0 permite acceder al servidor Vite desde fuera del contenedor.
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]
