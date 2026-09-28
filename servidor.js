// ============================================================
// API do Diario de Treinos
// Back-End I - CEEP Pedro Boaretto Neto
// ============================================================

const express = require('express');
const { DatabaseSync } = require('node:sqlite');

const app = express();

// Faz o Express entender JSON no corpo das requisicoes
app.use(express.json());

// Conecta ao banco (cria o arquivo treinos.db se nao existir)
const db = new DatabaseSync('treinos.db');

// Garante que a tabela existe (Desafio 2: adicionado o campo observacao)
db.exec(`
  CREATE TABLE IF NOT EXISTS treinos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    duracao INTEGER NOT NULL,
    observacao TEXT
  )
`);

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
  // Desafio 2: valida se observacao veio e se ela e um texto
  if (corpo.observacao !== undefined && typeof corpo.observacao !== 'string') {
    return 'O campo observacao deve ser um texto.';
  }
  return null;
}

// ------------------------------------------------------------
// GET /treinos - lista todos os treinos (Desafios 1 e 10)
// ------------------------------------------------------------
app.get('/treinos', (req, res) => {
  // Desafio 10: Busca por nome (?busca=...)
  if (req.query.busca !== undefined) {
    const termoBusca = `%${req.query.busca}%`;
    const treinosFiltrados = db.prepare('SELECT * FROM treinos WHERE nome LIKE ?').all(termoBusca);
    return res.status(200).json(treinosFiltrados);
  }

  // Desafio 1: verifica se o parametro query minimo foi enviado
  if (req.query.minimo !== undefined) {
    const duracaoMinima = Number(req.query.minimo);
    
    // Se o valor enviado nao for um numero valido, retorna erro
    if (isNaN(duracaoMinima)) {
      return res.status(400).json({ erro: 'O parametro minimo deve ser um numero.' });
    }

    const treinosFiltrados = db.prepare('SELECT * FROM treinos WHERE duracao >= ?').all(duracaoMinima);
    return res.status(200).json(treinosFiltrados);
  }

  // Comportamento padrao (sem filtro)
  const treinos = db.prepare('SELECT * FROM treinos').all();
  res.status(200).json(treinos);
});

// ------------------------------------------------------------
// GET /treinos/resumo - traz estatisticas dos treinos (Desafio 11)
// ------------------------------------------------------------
// ATENCAO: Deve vir ANTES de /treinos/:id para nao dar conflito de rotas!
app.get('/treinos/resumo', (req, res) => {
  // Consulta unificada trazendo COUNT, SUM e AVG
  const resumo = db.prepare('SELECT COUNT(*) as total, SUM(duracao) as minutos, AVG(duracao) as media FROM treinos').get();
  
  // Trata o caso do banco estar vazio (SUM e AVG retornam null)
  res.status(200).json({
    total: resumo.total,
    minutos: resumo.minutos || 0,
    media: resumo.media || 0
  });
});

// ------------------------------------------------------------
// GET /treinos/:id - busca um treino pelo id (Desafio 12)
// ------------------------------------------------------------
app.get('/treinos/:id', (req, res) => {
  const idOriginal = req.params.id;
  const id = Number(idOriginal);

  // Desafio 12: Valida se o ID enviado e um numero inteiro valido
  if (isNaN(id) || !Number.isInteger(id)) {
    return res.status(400).json({ erro: 'O id informado deve ser um numero inteiro.' });
  }

  const treino = db.prepare('SELECT * FROM treinos WHERE id = ?').get(id);

  if (treino === undefined) {
    return res.status(404).json({ erro: 'Treino nao encontrado.' });
  }

  res.status(200).json(treino);
});

// ------------------------------------------------------------
// POST /treinos - cria um treino no banco de dados (Desafio 2)
// ------------------------------------------------------------
app.post('/treinos', (req, res) => {
  const erro = validarTreino(req.body);
  if (erro !== null) {
    return res.status(400).json({ erro: erro });
  }

  // Desafio 2: garante que se a observacao nao vier, ela salve como null no banco
  const observacao = req.body.observacao !== undefined ? req.body.observacao : null;

  // Insere no banco SQLite incluindo a observacao
  const resultado = db
    .prepare('INSERT INTO treinos (nome, duracao, observacao) VALUES (?, ?, ?)')
    .run(req.body.nome, req.body.duracao, observacao);

  // Busca o treino recem-criado para devolver com o id gerado automaticamente
  const novo = db
    .prepare('SELECT * FROM treinos WHERE id = ?')
    .get(resultado.lastInsertRowid);

  res.status(201).json(novo);
});

// ------------------------------------------------------------
// PUT /treinos/:id - substitui um treino (Desafio 2 e 12 aplicado)
// ------------------------------------------------------------
app.put('/treinos/:id', (req, res) => {
  const id = Number(req.params.id);

  // Desafio 12 aplicado aqui tambem para manter consistência
  if (isNaN(id) || !Number.isInteger(id)) {
    return res.status(400).json({ erro: 'O id informado deve ser um numero inteiro.' });
  }

  const treino = db.prepare('SELECT * FROM treinos WHERE id = ?').get(id);
  if (treino === undefined) {
    return res.status(404).json({ erro: 'Treino nao encontrado.' });
  }

  const erro = validarTreino(req.body);
  if (erro !== null) {
    return res.status(400).json({ erro: erro });
  }

  const observacao = req.body.observacao !== undefined ? req.body.observacao : null;

  db.prepare('UPDATE treinos SET nome = ?, duracao = ?, observacao = ? WHERE id = ?')
    .run(req.body.nome, req.body.duracao, observacao, id);

  const atualizado = db.prepare('SELECT * FROM treinos WHERE id = ?').get(id);
  res.status(200).json(atualizado);
});

// ------------------------------------------------------------
// DELETE /treinos/:id - remove um treino (Desafio 12 aplicado)
// ------------------------------------------------------------
app.delete('/treinos/:id', (req, res) => {
  const id = Number(req.params.id);

  // Desafio 12 aplicado aqui tambem para manter consistência
  if (isNaN(id) || !Number.isInteger(id)) {
    return res.status(400).json({ erro: 'O id informado deve ser um numero inteiro.' });
  }

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
