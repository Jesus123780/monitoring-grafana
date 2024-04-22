# Establecer la imagen base de Node.js
FROM node:latest

LABEL author=""

# Directorio de trabajo de la aplicación Node.js
WORKDIR /app

# Copiar los archivos de la aplicación
COPY . .

# Instalar las dependencias de producción
RUN npm install --production

# Exponer el puerto en el que se ejecutará la aplicación
EXPOSE 3000

# Comando para iniciar la aplicación
CMD [ "npm", "start" ]
