FROM electronuserland/builder:wine

COPY . .
RUN npm run setup

ENTRYPOINT ["./script/build.sh"]