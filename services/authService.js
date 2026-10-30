
const repository = require('../repositories/usuariosRepository.js');

function login(usuario, senha) {
  const encontrado = repository.buscarPorUsuario(usuario);

  // Usuário não encontrado
  if (encontrado === undefined) {
    return { invalido: true };
  }

  // Senha incorreta
  if (encontrado.senha !== senha) {
    return { invalido: true };
  }

  // Login correto: retorna os dados sem a senha
  return {
    usuario: {
      id: encontrado.id,
      usuario: encontrado.usuario
    }
  };
}

module.exports = {
  login
};
