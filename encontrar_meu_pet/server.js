const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());


const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'encontrar_meu_pet',
    password: 'Larissa.222' 
});

connection.connect(err => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        return;
    }
    console.log('Conectado ao banco de dados MySQL.');
});


app.get('/api/pets', (req, res) => {
    connection.query('SELECT * FROM pets', (err, results) => {
        if (err) {
            console.error('Erro ao buscar os pets:', err);
            res.status(500).send('Erro ao buscar os pets');
            return;
        }
        res.json(results);
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
