FROM node:20.17.0-alpine

RUN apk add --no-cache bash
RUN npm config set registry https://registry.npmmirror.com

RUN npm i -g @nestjs/cli typescript ts-node

COPY package*.json /tmp/app/
# 使用 CACHEBUST 来强制 npm install 不缓存，ARG 被引用
RUN cd /tmp/app && rm -rf node_modules && npm install

COPY . /usr/src/app
RUN cp -a /tmp/app/node_modules /usr/src/app
COPY ./wait-for-it.sh /opt/wait-for-it.sh
RUN chmod +x /opt/wait-for-it.sh
COPY ./startup.document.dev.sh /opt/startup.document.dev.sh
RUN chmod +x /opt/startup.document.dev.sh
RUN sed -i 's/\r//g' /opt/wait-for-it.sh
RUN sed -i 's/\r//g' /opt/startup.document.dev.sh

WORKDIR /usr/src/app
RUN if [ ! -f .env ]; then cp env-example-document .env; fi
RUN npm run build

CMD ["/opt/startup.document.dev.sh"]
