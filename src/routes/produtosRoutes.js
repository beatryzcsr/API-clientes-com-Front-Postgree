// Importar o Express para criar o router
const express = require('express');
const router = express.Router();

// Importar as funções do Controller
const ProdutosController = require('../controllers/produtosController');

// ============================================================
// DEFINIÇÃO DAS ROTAS
// ============================================================

// GET /produtos - Listar todos os produtos
router.get('/', ProdutosController.listarTodos);

// GET /produtos/categoria/:categoria - Buscar por categoria
router.get('/buscar/nome/:nome', ProdutosController.buscarPorNome);

// GET /produtos/:id - Buscar produto específico por ID
router.get('/buscar/id/:id', ProdutosController.buscarPorId);

// POST /produtos - Criar novo produto
router.post('/', ProdutosController.criar);

// PUT /produtos/:id - Atualizar produto completo
router.put('/:id', ProdutosController.atualizar);

// DELETE /produtos/:id - Deletar produto
router.delete('/:id', ProdutosController.deletar);

// ============================================================
// EXPORTAR O ROUTER
// ============================================================
module.exports = router;
