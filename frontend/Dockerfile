FROM node:18.16

COPY package.json package-lock.json ./
COPY . .

# 의존성 설치
RUN npm install

EXPOSE 3000

ENTRYPOINT ["npm", "start"]

