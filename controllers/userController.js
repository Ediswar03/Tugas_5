const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET = 'rahasia';

exports.getUsers = (req, res) => {
    const { search = '', page = 1, limit = 5 } = req.query;
    const offset = (page - 1) * limit;

    User.getAll({ search, limit, offset }, (err, data) => {
        if (err) return res.status(500).json(err);
        res.json({
            users: data.users,
            total: data.total,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(data.total / limit)
        });
    });
};

exports.createUser = async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        User.create({ name, email, phone, password: hashedPassword }, (err) => {
            if (err) return res.status(500).json({ message: 'Gagal simpan' });

            res.json({ message: 'User berhasil dibuat' });
        });

    } catch (err) {
        res.status(500).json(err);
    }
};

exports.login = (req, res) => {
    const { email, password } = req.body;

    User.getByEmail(email, async (err, results) => {
        if (err) return res.status(500).json(err);

        if (results.length === 0) {
            return res.status(400).json({ message: 'User tidak ditemukan' });
        }

        const user = results[0];

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Password salah' });
        }

        const token = jwt.sign({ id: user.id }, SECRET, { expiresIn: '1h' });

        res.json({ message: 'Login berhasil', token });
    });
};

exports.updateUser = (req, res) => {
    const { id } = req.params;

    User.update(id, req.body, (err) => {
        if (err) return res.status(500).json({ message: 'Gagal update' });

        res.json({ message: 'Berhasil update' });
    });
};

exports.deleteUser = (req, res) => {
    const { id } = req.params;

    User.delete(id, (err) => {
        if (err) return res.status(500).json(err);

        res.json({ message: 'Berhasil delete' });
    });
};

const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');

exports.exportUsers = async (req, res) => {
    const { domain = 'all', format = 'json' } = req.query;

    User.getAll({ search: '', limit: 1000, offset: 0 }, async (err, data) => {
        if (err) return res.status(500).json(err);

        let filtered = data.users;
        if (domain !== 'all') {
            filtered = data.users.filter(u => u.email.endsWith(`@${domain}`));
        }

        if (format === 'excel') {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('User Report');
            
            // Define columns
            worksheet.columns = [
                { header: 'ID', key: 'id', width: 10 },
                { header: 'Name', key: 'name', width: 30 },
                { header: 'Email', key: 'email', width: 35 },
                { header: 'Phone', key: 'phone', width: 20 },
            ];

            // Style Header Row
            const headerRow = worksheet.getRow(1);
            headerRow.font = { bold: true, color: { argb: 'FFFFFF' } };
            headerRow.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: '4E73DF' } // Matching the UI Primary color
            };
            headerRow.alignment = { vertical: 'middle', horizontal: 'center' };

            // Add Data and Style Rows
            filtered.forEach(user => {
                const row = worksheet.addRow(user);
                row.border = {
                    bottom: { style: 'thin', color: { argb: 'E3E6F0' } }
                };
            });

            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename=users_report.xlsx');
            return workbook.xlsx.write(res).then(() => res.end());

        } else if (format === 'pdf') {
            const doc = new PDFDocument({ margin: 50 });
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename=users_report.pdf');
            doc.pipe(res);

            // Header
            doc.rect(0, 0, 612, 100).fill('#4E73DF');
            doc.fillColor('#FFFFFF').fontSize(24).text('USER MANAGEMENT REPORT', 50, 40);
            doc.fontSize(10).text(`Generated on: ${new Date().toLocaleString()}`, 50, 70);
            
            doc.moveDown(4);
            doc.fillColor('#000000');

            // Table Header
            const tableTop = 150;
            const itemWidth = 120;
            doc.font('Helvetica-Bold').fontSize(12);
            doc.text('Name', 50, tableTop);
            doc.text('Email', 200, tableTop);
            doc.text('Phone', 400, tableTop);

            doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).strokeColor('#4E73DF').stroke();

            // Table Content
            let currentY = tableTop + 30;
            doc.font('Helvetica').fontSize(10);

            filtered.forEach(user => {
                // Check for new page
                if (currentY > 700) {
                    doc.addPage();
                    currentY = 50;
                }
                doc.text(user.name, 50, currentY);
                doc.text(user.email, 200, currentY);
                doc.text(user.phone, 400, currentY);
                
                doc.moveTo(50, currentY + 15).lineTo(550, currentY + 15).strokeColor('#F8F9FC').stroke();
                currentY += 25;
            });

            doc.end();
            return;
        }

        res.json(filtered);
    });
};
