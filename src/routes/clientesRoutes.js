const express = require('express');
const router = express.Router();

const ClienteController = require('../controllers/clientesController');


// GET 
router.get('/', ClienteController.listarTodos);

router.get('/buscar/nome/:nome', ClienteController.buscarPorNome);

router.get('/buscar/id/:id', ClienteController.buscarPorId);


// POST 
router.post('/', ClienteController.criar);

// PUT
router.put('/:id', ClienteController.atualizar);

// DELETE 
router.delete('/:id', ClienteController.deletar);

//exportando
module.exports = router;
