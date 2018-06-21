FROM nginx:alpine

MAINTAINER Acris Liu "acrisliu@gmail.com"

ENV TIMEZONE="Asia/Shanghai"
# Set Timezone
RUN set -ex \
    && apk add --no-cache --virtual .build-deps tzdata \
    && cp /usr/share/zoneinfo/${TIMEZONE} /etc/localtime \
    && echo "${TIMEZONE}" > /etc/timezone \
    && apk del .build-deps

COPY dist /usr/share/nginx/html
EXPOSE 80
