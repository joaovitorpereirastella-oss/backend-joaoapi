
const db = require('../banco.js');

function buscarPorUsuario(usuario) {
  return db.prepare(
    'SELECT * FROM usuarios WHERE usuario = ?'
  ).get(usuario);
}

function buscarPorId(id) {
  return db.prepare(
    'SELECT id, usuario FROM usuarios WHERE id = ?'
  ).get(id);
}

module.exports = {
  buscarPorUsuario,
  buscarPorId
};
