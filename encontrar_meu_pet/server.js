const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const bodyParser = require('body-parser');
const multer = require('multer');
const cors = require('cors');

const app = express();
const port = 3000;

// Configuração do multer para o upload de arquivos
const upload = multer({ dest: path.join(__dirname, 'uploads') });

// Conexão com o banco de dados
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

// Configurações do Express
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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
app.post('/api/pets', upload.array('images', 10), (req, res) => {
    const { name, description, status, location } = req.body;
    const imageUrls = req.files.map(file => `/uploads/${file.filename}`);

    connection.query(
        'INSERT INTO pets (name, description, status, location) VALUES (?, ?, ?, ?)',
        [name, description, status, location],
        (err, results) => {
            if (err) {
                console.error('Erro ao inserir dados:', err);
                res.status(500).send('Erro ao inserir dados.');
                return;
            }
            const petId = results.insertId;
            const imageInsertQueries = imageUrls.map(imageUrl => {
                return new Promise((resolve, reject) => {
                    connection.query(
                        'INSERT INTO pet_images (pet_id, imageUrl) VALUES (?, ?)',
                        [petId, imageUrl],
                        (err, results) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve(results);
                            }
                        }
                    );
                });
            });

            Promise.all(imageInsertQueries)
                .then(() => {
                    res.status(201).json({ message: 'Pet adicionado com sucesso' });
                })
                .catch(err => {
                    console.error('Erro ao inserir imagens:', err);
                    res.status(500).send('Erro ao inserir imagens.');
                });
        }
    );
});


app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
