const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const bodyParser = require('body-parser');
const multer = require('multer');
const cors = require('cors');  // Adicione esta linha
const app = express();
const port = 3000;

const upload = multer({ dest: 'uploads/' });

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

app.use(cors());  // Adicione esta linha para habilitar CORS
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static('uploads'));

// Endpoint para buscar os pets
app.get('/api/pets', (req, res) => {
    connection.query('SELECT * FROM pets', (err, results) => {
        if (err) {
            console.error('Erro ao buscar dados:', err);
            res.status(500).send('Erro ao buscar dados.');
            return;
        }
        res.json(results);
    });
});

// Endpoint para adicionar um novo pet
app.post('/api/pets', upload.array('images[]', 10), (req, res) => {  // Use upload.array para múltiplos arquivos
    const { name, description, status, location } = req.body;
    const imageUrls = req.files.map(file => `/uploads/${file.filename}`);

    const query = 'INSERT INTO pets (name, imageUrl, description, status, location) VALUES (?, ?, ?, ?, ?)';
    connection.query(query, [name, imageUrls.join(','), description, status, location], (err, results) => {
        if (err) {
            console.error('Erro ao inserir dados:', err);
            res.status(500).send('Erro ao inserir dados.');
            return;
        }
        res.status(201).json({ message: 'Pet adicionado com sucesso' });
    });
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
