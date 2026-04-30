const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/', userController.getUsers);
router.post('/', userController.createUser);
router.post('/login', userController.login);
router.get('/logout', (req, res) => res.json({ message: 'Logout berhasil' }));
router.get('/export', userController.exportUsers);
router.post('/update/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;
