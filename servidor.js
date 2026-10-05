const express = require('express');
const controller = require('./controllers/treinosController.js');
const app = express();
app.use(express.json());
app.get('/treinos', controller.listar);
app.get('/treinos/:id', controller.buscarUm);
app.post('/treinos', controller.criar);
app.put('/treinos/:id', controller.atualizar);
app.delete('/treinos/:id', controller.remover);
const PORTA = 3000;
app.listen(PORTA, () => {
console.log(`Servidor rodando em http://localhost:${PORTA}`);
});