const db = require('./config/db');
const bcrypt = require('bcrypt');

async function seed() {
    const password = await bcrypt.hash('password123', 10);
    const users = [
        ['Andi', 'andi@gmail.com', '08123456789', password],
        ['Budi', 'budi@gmail.com', '08123456780', password],
        ['Cici', 'cici@yahoo.com', '08123456781', password],
        ['Dedi', 'dedi@yahoo.com', '08123456782', password],
        ['Euis', 'euis@outlook.com', '08123456783', password],
        ['Fani', 'fani@gmail.com', '08123456784', password],
        ['Gani', 'gani@company.id', '08123456785', password],
        ['Hani', 'hani@company.id', '08123456786', password],
        ['Indra', 'indra@gmail.com', '08123456787', password],
        ['Joni', 'joni@yahoo.com', '08123456788', password],
    ];

    const sql = 'INSERT INTO users (name, email, phone, password) VALUES ?';
    
    db.query(sql, [users], (err, result) => {
        if (err) {
            console.error('Gagal seed data:', err);
        } else {
            console.log('Berhasil menambahkan 10 data dummy!');
        }
        process.exit();
    });
}

seed();
