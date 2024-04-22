# Establecer la imagen base de Node.js
FROM node:16.17.0-slim

# Directorio de trabajo de la aplicación Node.js
WORKDIR /app

# Copiar los archivos de la aplicación
COPY . .

# Instalar las dependencias
RUN npm install

# Exponer el puerto en el que se ejecutará la aplicación
EXPOSE 3000

# Comando para iniciar la aplicación
CMD [ "npm", "start" ]
