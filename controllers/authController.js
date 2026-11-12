
const service = require('../services/authService.js');
const sessoes = require('../sessoes.js');
const usuariosRepository = require('../repositories/usuariosRepository.js');

function lerCookie(req, nome) {
    const cabecalho = req.headers.cookie;

    if (!cabecalho) return null;

    const pares = cabecalho.split(';');

    for (const par of pares) {
        const [chave, valor] = par.trim().split('=');

        if (chave === nome) return valor;
    }

    return null;
}

async function login(req, res) {
    const usuario = (req.body.usuario ?? '').trim();
    const senha = req.body.senha ?? '';

    const resultado = await service.login(usuario, senha);

    if (resultado.invalido === true) {
        return res.status(401).json({
            erro: 'Usuario ou senha invalidos.'
        });
    }

    const token = sessoes.criar(resultado.usuario.id);

    res.cookie('sid', token, { httpOnly: true });

    res.status(200).json(resultado.usuario);
}


function usuarioDaRequisicao(req) {
    const token = lerCookie(req, 'sid');

    if (token === null) return null;

    const id = sessoes.usuarioIdDaSessao(token);

    if (id === undefined) return null;

    return usuariosRepository.buscarPorId(id) ?? null;
}

function perfil(req, res) {
    const dono = usuarioDaRequisicao(req);

    if (dono === null) {
        return res.status(401).json({
            erro: 'Faca login primeiro.'
        });
    }

    res.status(200).json(dono);
}

function logout(req, res) {
    const token = lerCookie(req, 'sid');

    if (token !== null) {
        sessoes.encerrar(token);
    }

    res.clearCookie('sid');
    res.status(204).end();
}

module.exports = {
    login,
    perfil,
    logout,
    usuarioDaRequisicao
};
