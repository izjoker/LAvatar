# Build environment
FROM node:18.9.1 as builder
ENV PATH /app/node_modules/.bin:$PATH
COPY . /app
WORKDIR /app
RUN npm install
RUN npm run build

# Production environment
FROM nginx:1.19
EXPOSE 80
EXPOSE 443
COPY --from=builder /app/build /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY ./cert /etc/cert
CMD ["nginx", "-g", "daemon off;"]
