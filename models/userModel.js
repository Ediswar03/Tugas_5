const db = require('../config/db');

const User = {

    getAll: (options, callback) => {
        const { search, limit, offset } = options;
        let sql = 'SELECT * FROM users';
        let countSql = 'SELECT COUNT(*) as total FROM users';
        let params = [];

        if (search) {
            sql += ' WHERE name LIKE ? OR email LIKE ?';
            countSql += ' WHERE name LIKE ? OR email LIKE ?';
            params.push(`%${search}%`, `%${search}%`);
        }

        sql += ' LIMIT ? OFFSET ?';
        const queryParams = [...params, parseInt(limit), parseInt(offset)];

        db.query(countSql, params, (err, countResult) => {
            if (err) return callback(err);
            const total = countResult[0].total;

            db.query(sql, queryParams, (err, results) => {
                if (err) return callback(err);
                callback(null, { users: results, total });
            });
        });
    },

    getByEmail: (email, callback) => {
        db.query('SELECT * FROM users WHERE email = ?', [email], callback);
    },

    create: (data, callback) => {
        const sql = 'INSERT INTO users (name, email, phone, password) VALUES (?, ?, ?, ?)';
        db.query(sql, [data.name, data.email, data.phone, data.password], callback);
    },

    update: (id, data, callback) => {
        const sql = 'UPDATE users SET name=?, email=?, phone=? WHERE id=?';
        db.query(sql, [data.name, data.email, data.phone, id], callback);
    },

    delete: (id, callback) => {
        db.query('DELETE FROM users WHERE id=?', [id], callback);
    }

};

module.exports = User;
