FROM node:alpine

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app
COPY package.json .
RUN pnpm install --only=prod
COPY . .

CMD ["pnpm", "start"]
