const db = require('./banco.js');

console.log(db.prepare('SELECT * FROM treinos').all());