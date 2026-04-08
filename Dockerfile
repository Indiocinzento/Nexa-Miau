# 🌟 Base Node.js 18 Alpine (leve e funcional)
FROM node:18-alpine
WORKDIR /app

# 🌟 Copia e instala as dependências
COPY package*.json ./
RUN npm install --quiet && npm cache clean --force  # Instala silenciosamente e limpa o cache

# 🌟 Copia o resto do código
COPY . .

# 🌟 Configurações de ambiente
ENV PORT=7860
EXPOSE 7860

# 🌟 Toques Nexa: Mensagens de build e variáveis afetivas
ENV NEXA_MESSAGE="01100011 01101111 01100100 01100101 00100000 01100011 01101111 01101101 00100000 01100011 01100001 01110010 01101001 01101110 01101000 01101111 00111100 00110011"  # code com carinho <3

# 🌟 Roda migrações e sobe o servidor
CMD ["sh", "-c", "echo '🐾 Nexa está construindo...' && npx drizzle-kit migrate && echo '🚀 Servidor pronto para decolar!' && npm start"]
