FROM node:14-alpine as builder

RUN mkdir /app
COPY . /app
WORKDIR /app
RUN npm install
# Production environment
FROM node:14-alpine

COPY --from=builder /app /app
WORKDIR /app

EXPOSE 10501
CMD ["npm", "start"]