# 旅遊手冊：純靜態網站
# 第 1 階段用 Node 產生靜態 HTML（nuxt generate），第 2 階段只用 nginx 放檔案，不需要 Node
FROM node:24.22.1-alpine AS build
WORKDIR /app

# 先只裝套件，程式碼改動時不用重裝
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
ARG NUXT_APP_BASE_URL=/travel-handbook/
ENV NUXT_APP_BASE_URL=$NUXT_APP_BASE_URL
RUN npm run generate

FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
# 網址在 /travel-handbook/ 底下，所以檔案也放進同名資料夾
COPY --from=build /app/.output/public /usr/share/nginx/html/travel-handbook
