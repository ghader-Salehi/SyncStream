FROM node:16

WORKDIR /app

ADD . ./

RUN npm install

RUN npx prisma generate

RUN npm run build

EXPOSE 8080
EXPOSE 3030

CMD ["npx", "prisma", "db", "push", ";" , "npm", "run", "start"]