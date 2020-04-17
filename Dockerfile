FROM node:13

WORKDIR /app
COPY package*.json ./
RUN npm install --only=production

COPY . .

EXPOSE 3000

ENTRYPOINT [ "/app/entrypoint.sh" ]
