FROM node:16.15.0
WORKDIR /app
COPY package.json ./
ARG NODE_ENV
RUN if [ "$NODE_ENV" = "development" ]; \
      then npm install; \
      else npm install --production; \
      fi
COPY . ./
ENV PORT=3333
EXPOSE $PORT
CMD ["npm", "run", "start"]
