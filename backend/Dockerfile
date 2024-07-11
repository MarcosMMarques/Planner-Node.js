# Use a imagem oficial do Node.js
FROM node:20.15.1

# Defina o diretório de trabalho no contêiner
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Copie os arquivos de dependências para o contêiner
COPY package.json ./
COPY tsconfig*.json ./
COPY src/server.ts ./src/server.ts


# Instale as dependências do projeto e TypeScript
RUN npm install && npm install typescript @types/node prisma fastify -D && npm install -g tsx

RUN npm install fastify
RUN npm install zod
RUN npm install fastify-type-provider-zod

# Compile o TypeScript para JavaScript
RUN npx prisma init --datasource-provider SQLite

# Copie o restante dos arquivos do projeto
COPY . .

# Exponha a porta que sua aplicação vai utilizar (por exemplo, 3000)
EXPOSE 3000
