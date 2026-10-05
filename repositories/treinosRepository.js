const db = require('../banco.js');
function listarTodos() {

2

return db.prepare('SELECT * FROM treinos').all();
}
function buscarPorId(id) {
return db.prepare('SELECT * FROM treinos WHERE id = ?').get(id);
}
function criar(nome, duracao) {
const resultado = db
.prepare('INSERT INTO treinos (nome, duracao) VALUES (?, ?)')
.run(nome, duracao);
return buscarPorId(resultado.lastInsertRowid);
}
function atualizar(id, nome, duracao) {
db.prepare('UPDATE treinos SET nome = ?, duracao = ? WHERE id = ?')
.run(nome, duracao, id);
return buscarPorId(id);
}
function remover(id) {
const resultado = db.prepare('DELETE FROM treinos WHERE id = ?').run(id);
return resultado.changes > 0;
}
module.exports = { listarTodos, buscarPorId, criar, atualizar, remover };
