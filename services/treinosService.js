const repository = require('../repositories/treinosRepository.js');
function validarTreino(corpo) {
if (typeof corpo.nome !== 'string' || corpo.nome.trim() === ''){
return 'O campo nome e obrigatorio e deve ser um texto.';
}
if (typeof corpo.duracao !== 'number' || corpo.duracao <= 0) {
return 'O campo duracao e obrigatorio e deve ser um numero maior que zero.';
}
return null;
}
function listarTodos() {
return repository.listarTodos();
}
function buscarPorId(id) {
return repository.buscarPorId(id);
}
function criarTreino(corpo) {
const erro = validarTreino(corpo);
if (erro !== null){
return { erro: erro };
}
const novo = repository.criar(corpo.nome, corpo.duracao);
return { treino: novo };
}
function atualizarTreino(id, corpo) {
const existente = repository.buscarPorId(id);
if (existente === undefined) {
return { naoEncontrado: true };
}
const erro = validarTreino(corpo);
if (erro !== null){
return { erro: erro };
}
const atualizado = repository.atualizar(id, corpo.nome, corpo.duracao);
return { treino: atualizado };
}
function removerTreino(id) {
const existente = repository.buscarPorId(id);
if (existente === undefined) {
return { naoEncontrado: true };
}
repository.remover(id);
return { removido: true };
}
module.exports = {
listarTodos,
buscarPorId,
criarTreino,
atualizarTreino,
removerTreino,
};