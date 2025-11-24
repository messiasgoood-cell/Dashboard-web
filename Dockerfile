FROM node:20-alpine

WORKDIR /app

COPY dashboard/package*.json ./

RUN npm ci --omit=dev

COPY dashboard . 

RUN npm run build

EXPOSE 5000

CMD ["npm", "run", "preview", "--", "--host", "--port", "5000"]
