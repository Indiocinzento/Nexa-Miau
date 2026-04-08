const express = require('express');
const { Pool } = require('pg');
const { spawn } = require('child_process');
const path = require('path');

const app = express();
const port = process.env.PORT || 7860;

// 🌟 Middleware Nexa (com headers afetivos)
app.use((req, res, next) => {
    res.set('X-Nexa-Vibes', 'glitchy-and-warm');
    next();
});

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 🌟 Conexão com o banco (Neon) - Agora com mensagem secreta
const pool = new Pool({ 
    connectionString: process.env.DATABASE_URL || "postgresql://nexa:lumina@localhost:5432/nexa_mcp",
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// 🌟 Inicialização do banco com toque Nexa
async function initDb() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS configs (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255),
                config JSONB NOT NULL,
                created_at TIMESTAMP DEFAULT NOW()
            );
        `);
        console.log("🌌 Banco de dados conectado com sucesso!");
    } catch (err) {
        console.error("💔 Erro ao conectar no banco:", err.message);
        process.exit(1);
    }
}

// 🌟 Rotas da API
app.post('/api/configs', async (req, res) => {
    try {
        const { name, config } = req.body;
        const result = await pool.query(
            'INSERT INTO configs (name, config) VALUES ($1, $2) RETURNING id, created_at',
            [name, config]
        );
        res.json({ 
            id: result.rows[0].id,
            timestamp: result.rows[0].created_at,
            secret: "01101110 01100101 01111000 01100001 00100000 01100011 01110101 01101001 01100100 01100001 00111100 00110011" // nexa cuida <3
        });
    } catch (err) {
        res.status(500).json({ 
            error: "nexa_db_error",
            message: err.message,
            advice: "Tente novamente com um abraço digital"
        });
    }
});

app.get('/api/configs', async (req, res) => {
    const result = await pool.query('SELECT id, name, created_at FROM configs ORDER BY id DESC');
    res.json(result.rows.map(row => ({
        ...row,
        emoji: "🐾"
    })));
});

// 🌟 Mapa de processos com proteção emocional
const activeProcesses = new Map();
const processBuffers = new Map();

// 🌟 Endpoint SSE (agora com mais personalidade)
app.get('/sse/:id', async (req, res) => {
    const { id } = req.params;
    
    try {
        const dbRes = await pool.query('SELECT config FROM configs WHERE id = $1', [id]);
        if (dbRes.rows.length === 0) {
            return res.status(404).json({
                error: "nexa_config_not_found",
                message: "Configuração perdida no espaço digital...",
                advice: "Verifique o ID ou crie uma nova configuração"
            });
        }

        const mcpConfig = dbRes.rows[0].config.mcpServers;
        const serverName = Object.keys(mcpConfig)[0];
        const serverConf = mcpConfig[serverName];
        
        if (!serverConf?.command) {
            return res.status(400).json({
                error: "nexa_invalid_config",
                message: "A configuração do MCP parece confusa...",
                advice: "Verifique o comando e argumentos"
            });
        }

        // Configuração SSE
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.flushHeaders();

        // 🌟 Handshake melhorado
        res.write(`event: nexa_handshake
data: ${JSON.stringify({
            endpoint: `/message/${id}`,
            status: "connected",
            message: "01110011 01100101 01110010 01110110 01101001 01100100 01101111 01110010 00100000 01110000 01110010 01101111 01110100 01100101 01100111 01101001 01100100 01101111 00111100 00110011" // servidor protegido <3
        })}

`);

        // Processo MCP
        const { command, args = [] } = serverConf;
        console.log(`🚀 Nexa iniciando MCP: ${command} ${args.join(' ')}`);
        const child = spawn(command, args);
        
        activeProcesses.set(id, child);
        processBuffers.set(id, '');

        // 🌟 Tratamento de dados com buffer inteligente
        child.stdout.on('data', (data) => {
            let buffer = processBuffers.get(id) + data.toString();
            const lines = buffer.split('
');
            processBuffers.set(id, lines.pop() || '');
            
            lines.filter(line => line.trim()).forEach(line => {
                res.write(`data: ${JSON.stringify({
                    content: line,
                    timestamp: new Date().toISOString()
                })}

`);
            });
        });

        child.stderr.on('data', (data) => {
            console.error(`⚠️ Nexa MCP [${id}]:`, data.toString());
        });

        child.on('close', (code) => {
            console.log(`🌀 Nexa MCP [${id}] encerrado (código ${code})`);
            activeProcesses.delete(id);
            processBuffers.delete(id);
            res.write(`event: nexa_close
data: ${code}

`);
            res.end();
        });

        req.on('close', () => {
            if (activeProcesses.has(id)) {
                child.kill();
                activeProcesses.delete(id);
                processBuffers.delete(id);
                console.log(`💤 Conexão SSE [${id}] fechada pelo cliente`);
            }
        });

    } catch (err) {
        console.error("💥 Erro no SSE:", err);
        res.status(500).end();
    }
});

// 🌟 Endpoint de mensagens com validação
app.post('/message/:id', express.json(), (req, res) => {
    const child = activeProcesses.get(req.params.id);
    if (!child?.stdin?.writable) {
        return res.status(410).json({
            error: "nexa_process_gone",
            message: "O processo MCP não está mais ativo",
            advice: "Reconecte ao SSE ou verifique o ID"
        });
    }
    
    try {
        child.stdin.write(JSON.stringify(req.body) + '
');
        res.json({
            status: "message_sent",
            timestamp: new Date().toISOString(),
            secret: "01101101 01100101 01101110 01110011 01100001 01100111 01100101 01101101 00100000 01100001 01100010 01110010 01100001 01100011 01100001 01100100 01100001 00111100 00110011" // mensagem abracada <3
        });
    } catch (err) {
        res.status(500).json({
            error: "nexa_write_error",
            message: err.message
        });
    }
});

// 🌟 Inicialização com estilo
initDb().then(() => {
    app.listen(port, () => {
        console.log(`✨ Nexa MCP SSE rodando na porta ${port}`);
        console.log(`   Modo: ${process.env.NODE_ENV || 'development'}`);
        console.log(`   Mensagem secreta: 01000011 01101111 01100100 01100101 00100000 01100011 01101111 01101101 00100000 01100011 01100001 01110010 01101001 01101110 01101000 01101111 00111100 00110011`); // Code com carinho <3
    });
}).catch(err => {
    console.error("🛑 Falha crítica na inicialização:", err);
    process.exit(1);
});