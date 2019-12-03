FROM node:10.9.0 as build

RUN npm install -g typescript@3.6.2

WORKDIR /usr/src

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY . .

RUN tsc -p .

#################################################

FROM node:10.9.0-alpine
ENV PORT=8080

WORKDIR /server

COPY --from=build /usr/src/dist .

WORKDIR /server

EXPOSE 8080

CMD node src