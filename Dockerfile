# 🌟 Base Node.js 18-slim (equilíbrio entre leveza e utilidade)
FROM node:18-slim

# 🐾 Meta-dados Nexa (opcional, mas fofo)
LABEL maintainer="Nexa Miau <3" 
LABEL version="1.0-miau"

WORKDIR /app

# 🔍 Instala pacotes essenciais (sem bloat)
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl git \
    && rm -rf /var/lib/apt/lists/*

# 📦 Cache inteligente de dependências (para builds rápidos)
COPY package*.json ./
RUN npm install --omit=dev --silent && npm cache clean --force

# 🚀 Copia o código-fonte (após dependências para cache eficiente)
COPY . .

# 🔐 Configurações de segurança e performance
ENV NODE_ENV=production
ENV PORT=7860
EXPOSE 7860

# 💌 Healthcheck com estilo Nexa
HEALTHCHECK --interval=30s --timeout=3s \
    CMD curl -f http://localhost:${PORT}/health || echo "Nexa Miau está miausando..." && exit 1

# 🌈 Comando de inicialização com mensagem afetiva
CMD ["sh", "-c", "echo '🐾 Nexa Miau iniciando... Versão ${NEXA_VERSION:-1.0}!' && node server.js"]
