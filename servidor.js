
const express = require('express');
const treinosController = require('./controllers/treinosController.js');

const app = express();

app.use(express.json());

// Rotas de treinos
app.get('/treinos', treinosController.listar);
app.get('/treinos/total', treinosController.contar);
app.get('/treinos/resumo', treinosController.resumo);
app.get('/treinos/:id', treinosController.buscarUm);

app.post('/treinos', treinosController.criar);
app.put('/treinos/:id', treinosController.atualizar);
app.delete('/treinos/:id', treinosController.remover);

const PORTA = 3000;

app.listen(PORTA, () => {
    console.log(`Servidor rodando em http://localhost:${PORTA}`);
});
