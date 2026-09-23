// ============================================================
// API do Diario de Treinos
// Back-End I - CEEP Pedro Boaretto Neto
// ============================================================

const express = require('express');

const { DatabaseSync } = require('node:sqlite');

const app = express();
app.use(express.json());
// Conecta ao banco (cria o arquivo treinos.db se nao existir)
const db = new DatabaseSync('treinos.db');
// Garante que a tabela existe

db.exec(`
CREATE TABLE IF NOT EXISTS treinos (
id INTEGER PRIMARY KEY AUTOINCREMENT,
nome TEXT NOT NULL,
duracao INTEGER NOT NULL
)
`);
// Faz o Express entender JSON no corpo das requisicoes
app.use(express.json());

// ------------------------------------------------------------
// Os dados moram aqui, na memoria. Somem quando o servidor cai.
// ------------------------------------------------------------
const treinos = [];
let proximoId = 1;

// ------------------------------------------------------------
// Validacao
// ------------------------------------------------------------
function validarTreino(corpo) {
  if (typeof corpo.nome !== 'string' || corpo.nome.trim() === '') {
    return 'O campo nome e obrigatorio e deve ser um texto.';
  }
  if (typeof corpo.duracao !== 'number' || corpo.duracao <= 0) {
    return 'O campo duracao e obrigatorio e deve ser um numero maior que zero.';
  }
  return null;
}

// ------------------------------------------------------------
// GET /treinos - lista todos os treinos
// ------------------------------------------------------------
app.get('/treinos', (req, res) => {
    const treinos = db.prepare('SELECT * FROM treinos').all();
    res.status(200).json(treinos);
});

// ------------------------------------------------------------
// GET /treinos/:id - busca um treino pelo id (404 se nao existir)
// ------------------------------------------------------------
app.get('/treinos/:id', (req, res) => {
  const id = Number(req.params.id);
 const treino = db.prepare('SELECT * FROM treinos WHERE id = ?').get(id);

  if (treino === undefined) {
    return res.status(404).json({ erro: 'Treino nao encontrado.' });
  }

  res.status(200).json(treino);
});

// ------------------------------------------------------------
// POST /treinos - cria um treino (400 se os dados forem invalidos)
// ------------------------------------------------------------
app.post('/treinos', (req, res) => {
  const erro = validarTreino(req.body);
  if (erro !== null) {
    return res.status(400).json({ erro: erro });
  }

  const treino = {
    id: proximoId,
    nome: req.body.nome,
    duracao: req.body.duracao
  };

  proximoId = proximoId + 1;
  treinos.push(treino);
  res.status(201).json(treino);
});

// ------------------------------------------------------------
// post / treinos - cria um treino (400 se os dados forem invalidos)
// ------------------------------------------------------------
app.post('/treinos', (req, res) => {
    const erro = validarTreino(req.body);
    if (erro !== null){
    return res.status(400).json({ erro: erro });
}

// Insere no banco
const resultado = db
.prepare('INSERT INTO treinos (nome, duracao) VALUES (?, ?)')
.run(req.body.nome, req.body.duracao);
// Busca o treino recem-criado para devolver com o id gerado

const novo = db
    .prepare('SELECT * FROM treinos WHERE id = ?')
    .get(resultado.lastInsertRowid);
    res.status(201).json(novo);
});
// ------------------------------------------------------------
// PUT /treinos/:id - substitui um treino
// ------------------------------------------------------------
app.put('/treinos/:id', (req, res) => {
const id = Number(req.params.id);

const treino = db.prepare('SELECT * FROM treinos WHERE id = ?').get(id);
    if (treino === undefined) {
    return res.status(404).json({ erro: 'Treino nao encontrado.' });
}

const erro = validarTreino(req.body);
    if (erro !== null){
    return res.status(400).json({ erro: erro });
}

db.prepare('UPDATE treinos SET nome = ?, duracao = ? WHERE id = ?')
.run(req.body.nome, req.body.duracao, id);
const atualizado = db.prepare('SELECT * FROM treinos WHERE id = ?').get(id);
    res.status(200).json(atualizado);
});
// ------------------------------------------------------------
// C


// ------------------------------------------------------------
// DELETE /treinos/:id - remove um treino
// ------------------------------------------------------------
app.delete('/treinos/:id', (req, res) => {
    const id = Number(req.params.id);
    const treino = db.prepare('SELECT * FROM treinos WHERE id = ?').get(id);
    
  if (treino === undefined) {
    return res.status(404).json({ erro: 'Treino nao encontrado.' });
}

  db.prepare('DELETE FROM treinos WHERE id = ?').run(id);
  res.status(204).end();
});
// ------------------------------------------------------------
const PORTA = 3000;
app.listen(PORTA, () => {
  console.log(`Servidor rodando em http://localhost:${PORTA}`);
});