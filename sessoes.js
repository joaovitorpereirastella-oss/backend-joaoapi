const { randomUUID } = require('node:crypto');
const sessoes = new Map(); // token -> id do usuario
function criar(usuarioId) {
const token = randomUUID(); // etiqueta aleatoria e unica
sessoes.set(token, usuarioId);
return token;
}
function usuarioIdDaSessao(token) {
return sessoes.get(token); // o id, ou undefined se nao existe
}
function encerrar(token) {
sessoes.delete(token);
}
module.exports = { criar, usuarioIdDaSessao, encerrar };