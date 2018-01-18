# FROM debian:stretch-slim
FROM livingdocs/nvm

# app specific npm & node version
# ADD ./.nvmrc /app/.nvmrc

# app installation
WORKDIR /app
ADD ./ /app
RUN bash -c '. /usr/share/nvm/nvm.sh && cd /app && nvm install v6.4 && nvm use v6.4'
RUN npm install

ENV PORT 3000
EXPOSE 3000

CMD ["node", "."]