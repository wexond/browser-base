FROM docker.taktik.be/node:2.0.1 as builder

WORKDIR /home/node
COPY  --chown=node package.json .
COPY  --chown=node package-lock.json .
RUN npm install
COPY  --chown=node . .
RUN npm run compile-linux
#RUN npm_config_platform=linux node node_modules/electron/install.js
#RUN npm_config_platform=win32 node node_modules/electron/install.js
#RUN npm run compile-win32
RUN npm_config_platform=darwin node node_modules/electron/install.js
RUN npm run compile-darwin
