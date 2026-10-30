const { DatabaseSync } = require('node:sqlite');

const db = new DatabaseSync('treinos.db');

db.exec(`
    CREATE TABLE IF NOT EXISTS treinos (
        id      INTEGER PRIMARY KEY AUTOINCREMENT,
        nome    TEXT    NOT NULL,
        duracao INTEGER NOT NULL
    )
`);

module.exports = db;

db.exec(`
  CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario TEXT NOT NULL UNIQUE,
    senha TEXT NOT NULL
  )
`);

// Cadastra usuários de teste somente se a tabela estiver vazia
const qtd = db.prepare(
  'SELECT COUNT(*) AS n FROM usuarios'
).get().n;

if (qtd === 0) {
  const ins = db.prepare(
    'INSERT INTO usuarios (usuario, senha) VALUES (?, ?)'
  );

  ins.run('diego', '1234');
  ins.run('aluno', 'senha');
}