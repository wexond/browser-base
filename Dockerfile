FROM electronuserland/builder:wine

COPY . .
RUN npm run setup

ENTRYPOINT ["./docker/endpoint.sh"]