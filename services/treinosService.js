
const repository = require('../repositories/treinosRepository.js');

function validarTreino(corpo) {
    if (corpo === undefined || corpo === null) {
        return 'O corpo da requisicao e obrigatorio.';
    }

    if (typeof corpo.nome !== 'string' || corpo.nome.trim() === '') {
        return 'O campo nome e obrigatorio e deve ser um texto.';
    }

    if (typeof corpo.duracao !== 'number' || corpo.duracao <= 0) {
        return 'O campo duracao e obrigatorio e deve ser um numero maior que zero.';
    }

    if (corpo.duracao > 180) {
        return 'A duracao do treino nao pode ser maior que 180 minutos.';
    }

    return null;
}

function listarTodos(minimo, busca) {
    return repository.listarTodos(minimo, busca);
}

function contarTodos() {
    return repository.contarTodos();
}

function resumo() {
    return repository.resumo();
}

function buscarPorId(id) {
    return repository.buscarPorId(id);
}

function criarTreino(corpo) {
    const erro = validarTreino(corpo);

    if (erro !== null) {
        return { erro };
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

    if (erro !== null) {
        return { erro };
    }

    const atualizado = repository.atualizar(
        id,
        corpo.nome,
        corpo.duracao
    );

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
    contarTodos,
    resumo,
    buscarPorId,
    criarTreino,
    atualizarTreino,
    removerTreino
};
