const ClienteModel = require('../models/clientesModel');

//rota get geral
async function listarTodos(req, res) {
  try {
    const clientes = await ClienteModel.listarTodos();
    res.status(200).json(clientes);
  } catch (erro) {
    res.status(500).json({ 
      mensagem: 'Erro ao listar clientes', 
      erro: erro.message 
    });
  }
}

//get por id
async function buscarPorId(req, res) {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ 
        mensagem: 'ID inválido' 
      });
    }
    
    const cliente = await ClienteModel.buscarPorId(id);
    
    if (cliente) {
      res.status(200).json(cliente);
    } else {
      res.status(404).json({ 
        mensagem: `cliente ${id} não encontrado` 
      });
    }
  } catch (erro) {
    res.status(500).json({ 
      mensagem: 'Erro ao buscar cliente',
      erro: erro.message 
    });
  }
}

//post
async function criar(req, res) {
  try {
    const {nome, cpf, email, telefone} = req.body;
    
    // Validações
    if (!nome || !cpf || !email || !telefone ) {
      return res.status(400).json({ 
        mensagem: 'Todos os campos são obrigatórios' 
      });
    }
    
    const novoCliente = await ClienteModel.criar({ 
      nome, 
      cpf, 
      email, 
      telefone
    });
    
    res.status(201).json(novoCliente);
  } catch (erro) {
    res.status(500).json({ 
      mensagem: 'Erro ao criar cliente',
      erro: erro.message 
    });
  }
}

//put
async function atualizar(req, res) {
  try {
    const id = parseInt(req.params.id);
    const { nome, cpf, email, telefone} = req.body;
    
    if (isNaN(id)) {
      return res.status(400).json({ 
        mensagem: 'ID inválido' 
      });
    }
    
    if (!nome || !cpf || !email || !telefone) {
      return res.status(400).json({ 
        mensagem: 'Todos os campos são obrigatórios' 
      });
    }
    
    const clienteAtualizado = await ClienteModel.atualizar(id, { 
      nome, 
      cpf, 
      email, 
      telefone
    });
    
    if (clienteAtualizado) {
      res.status(200).json(clienteAtualizado);
    } else {
      res.status(404).json({ 
        mensagem: `Cliente ${id} não encontrado` 
      });
    }
  } catch (erro) {
    res.status(500).json({ 
      mensagem: 'Erro ao atualizar cliente',
      erro: erro.message 
    });
  }
}

//delete
async function deletar(req, res) {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ 
        mensagem: 'ID inválido' 
      });
    }
    
    const deletado = await ClienteModel.deletar(id);
    
    if (deletado) {
      res.status(200).json({ 
        mensagem: `Cliente ${id} removido com sucesso` 
      });
    } else {
      res.status(404).json({ 
        mensagem: `Cliente ${id} não encontrado` 
      });
    }
  } catch (erro) {
    res.status(500).json({ 
      mensagem: 'Erro ao deletar cliente',
      erro: erro.message 
    });
  }
}

//buscar por nome
async function buscarPorNome(req, res) {
  try {
    const { nome } = req.params;
    const clientes = await ClienteModel.buscarPorNome(nome);
    res.status(200).json(clientes);
  } catch (erro) {
    res.status(500).json({ 
      mensagem: 'Erro ao buscar clientes por nome',
      erro: erro.message 
    });
  }
}

//exportando
module.exports = {
  listarTodos,
  buscarPorId,
  criar,
  atualizar,
  deletar,
  buscarPorNome
};
