FROM node:6.11.5

# Create certificates for testing
RUN mkdir /certs
COPY certs /certs/
WORKDIR /certs
RUN chmod +x certs.sh
RUN ./certs.sh

RUN mkdir /app
WORKDIR /app

ADD package.json yarn.lock /app/
RUN yarn

COPY config /app/config/
COPY public /app/public/
COPY src /app/src/
COPY scripts /app/scripts/