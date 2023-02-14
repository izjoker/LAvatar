# Build environment
FROM node:18.9.1 as builder
ENV PATH /app/node_modules/.bin:$PATH
COPY . /app
WORKDIR /app
RUN npm install
RUN npm run build

# Production environment
FROM nginx:1.19
COPY --from=builder /app/build /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]