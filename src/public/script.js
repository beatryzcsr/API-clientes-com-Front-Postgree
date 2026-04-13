// ========================================
// VARIÁVEIS GLOBAIS
// ========================================

let clienteEmEdicao = null;

// ========================================
// FUNÇÕES AUXILIARES
// ========================================

// Mostra uma mensagem modal
function mostrarMensagem(mensagem, tipo = 'info') {
    const modal = document.getElementById('modalMessage');
    const modalText = document.getElementById('modalText');
    
    modalText.textContent = mensagem;
    modal.style.display = 'flex';
    
    // Define a cor baseado no tipo
    if (tipo === 'sucesso') {
        modal.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    } else if (tipo === 'erro') {
        modal.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    }
}

// Fecha o modal de mensagens
function fecharModal() {
    document.getElementById('modalMessage').style.display = 'none';
}

// Limpa o formulário
function limparFormulario() {
    document.getElementById('clientForm').reset();
    clienteEmEdicao = null;
    document.querySelector('.form-section h2').textContent = 'Adicionar ou Editar Cliente';
}

// Formata CPF para exibição
function formatarCPF(cpf) {
    if (!cpf) return '';
    // (\d{3}) - Grupo de captura que captura exatamente 3 dígitos
    // A regex divide o CPF em 4 grupos: 3 dígitos, 3 dígitos, 3 dígitos e 2 dígitos
    // O padrão $1.$2.$3-$4 reconstrói como: XXX.XXX.XXX-XX
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

// Formata telefone para exibição
function formatarTelefone(telefone) {
    if (!telefone) return '';
    return telefone.replace(/(\d{2})(\d{4,5})(\d{4})/, '($1) $2-$3');
}

// ========================================
// OPERAÇÕES COM A API
// ========================================

// Busca todos os clientes
async function carregarClientes() {
    const loadingMessage = document.getElementById('loadingMessage');
    const emptyMessage = document.getElementById('emptyMessage');
    const clientsList = document.getElementById('clientsList');
    
    loadingMessage.style.display = 'block';
    clientsList.innerHTML = '';
    
    try {
        const resposta = await fetch('/clientes');
        
        if (!resposta.ok) {
            throw new Error('Erro ao buscar clientes');
        }
        
        const clientes = await resposta.json();
        loadingMessage.style.display = 'none';
        
        if (clientes.length === 0) {
            emptyMessage.style.display = 'block';
            clientsList.innerHTML = '';
        } else {
            emptyMessage.style.display = 'none';
            exibirTabela(clientes);
        }
    } catch (erro) {
        loadingMessage.style.display = 'none';
        emptyMessage.style.display = 'block';
        console.error('Erro:', erro);
        mostrarMensagem('Erro ao carregegar os clientes. Tente novamente.', 'erro');
    }
}

// Cria um novo cliente
async function criarCliente(dados) {
    try {
        const resposta = await fetch('/clientes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        });
        
        if (!resposta.ok) {
            const erro = await resposta.json();
            throw new Error(erro.error || 'Erro ao criar cliente');
        }
        
        const novoCliente = await resposta.json();
        mostrarMensagem('Cliente cadastrado com sucesso!', 'sucesso');
        limparFormulario();
        carregarClientes();
        
    } catch (erro) {
        console.error('Erro:', erro);
        mostrarMensagem('Erro: ' + erro.message, 'erro');
    }
}

// Atualiza um cliente
async function atualizarCliente(id, dados) {
    try {
        const resposta = await fetch(`/clientes/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        });
        
        if (!resposta.ok) {
            const erro = await resposta.json();
            throw new Error(erro.error || 'Erro ao atualizar cliente');
        }
        
        const clienteAtualizado = await resposta.json();
        mostrarMensagem('Cliente atualizado com sucesso!', 'sucesso');
        limparFormulario();
        carregarClientes();
        
    } catch (erro) {
        console.error('Erro:', erro);
        mostrarMensagem('Erro: ' + erro.message, 'erro');
    }
}

// Deleta um cliente
async function deletarCliente(id) {
    if (!confirm('Tem certeza que deseja deletar este cliente?')) {
        return;
    }
    
    try {
        const resposta = await fetch(`/clientes/${id}`, {
            method: 'DELETE'
        });
        
        if (!resposta.ok) {
            const erro = await resposta.json();
            throw new Error(erro.error || 'Erro ao deletar cliente');
        }
        
        mostrarMensagem('Cliente removido com sucesso!', 'sucesso');
        carregarClientes();
        
    } catch (erro) {
        console.error('Erro:', erro);
        mostrarMensagem('Erro: ' + erro.message, 'erro');
    }
}

// ========================================
// EXIBIÇÃO DE DADOS
// ========================================

// Exibe a tabela de clientes
function exibirTabela(clientes) {
    const clientsList = document.getElementById('clientsList');
    
    let html = `
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>CPF</th>
                    <th>E-mail</th>
                    <th>Telefone</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    clientes.forEach(cliente => {
        html += `
            <tr>
                <td>#${cliente.id}</td>
                <td>${cliente.nome}</td>
                <td>${formatarCPF(cliente.cpf)}</td>
                <td>${cliente.email}</td>
                <td>${formatarTelefone(cliente.telefone)}</td>
                <td class="acoes">
                    <button class="btn btn-edit" onclick="editarCliente(${cliente.id}, '${cliente.nome}', '${cliente.cpf}', '${cliente.email}', '${cliente.telefone}')">✏️ Editar</button>
                    <button class="btn btn-danger" onclick="deletarCliente(${cliente.id})">🗑️ Deletar</button>
                </td>
            </tr>
        `;
    });
    
    html += `
            </tbody>
        </table>
    `;
    
    clientsList.innerHTML = html;
}

// Carrega os dados do cliente no formulário para edição
function editarCliente(id, nome, cpf, email, telefone) {
    clienteEmEdicao = id;
    
    document.getElementById('nome').value = nome;
    document.getElementById('cpf').value = cpf;
    document.getElementById('email').value = email;
    document.getElementById('telefone').value = telefone;
    
    document.querySelector('.form-section h2').textContent = `Editando Cliente #${id}`;
    
    // Scroll até o formulário
    document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
}

// ========================================
// BUSCA E FILTRO
// ========================================

// Busca clientes no backend
async function buscarClientes(tipo, valor) {
    const loadingMessage = document.getElementById('loadingMessage');
    const emptyMessage = document.getElementById('emptyMessage');
    const clientsList = document.getElementById('clientsList');
   
    loadingMessage.style.display = 'block';
    clientsList.innerHTML = '';
   
    try {
        let url = '';

        if (tipo === 'nome') {
            url = `/clientes/buscar/nome/${encodeURIComponent(valor)}`;
        } else if (tipo === 'id') {
            url = `/clientes/buscar/id/${valor}`;
        }

        const resposta = await fetch(url);
       
        if (!resposta.ok) {
            throw new Error('Erro ao buscar clientes');
        }
       
        let clientes = await resposta.json();

        if (!Array.isArray(clientes)) {
            clientes = clientes ? [clientes] : [];
        }

        loadingMessage.style.display = 'none';
       
        if (clientes.length === 0) {
            emptyMessage.style.display = 'block';
            clientsList.innerHTML = '';
        } else {
            emptyMessage.style.display = 'none';
            exibirTabela(clientes);
        }
    } catch (erro) {
        loadingMessage.style.display = 'none';
        emptyMessage.style.display = 'block';
        console.error('Erro:', erro);
        mostrarMensagem('Erro ao buscar os clientes. Tente novamente.', 'erro');
    }
}

// Filtra clientes pela busca (agora busca no backend)
function filtrarClientes() {
    const searchInput = document.getElementById('searchInput');
    const searchType = document.getElementById('searchType');
    const valor = searchInput.value.trim();
    
    if (valor === '') {
        // Se vazio, carrega todos
        carregarClientes();
    } else {
        // Busca no backend
        buscarClientes(searchType.value, valor);
    }
}

// ========================================
// EVENT LISTENERS
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    // Carrega os clientes ao abrir a página
    carregarClientes();
    
    // Formulário de envio
    document.getElementById('clientForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const nome = document.getElementById('nome').value.trim();
        const cpf = document.getElementById('cpf').value.trim();
        const email = document.getElementById('email').value.trim();
        const telefone = document.getElementById('telefone').value.trim();
        
        // Validação básica
        if (!nome || !cpf || !email || !telefone) {
            mostrarMensagem('Por favor, preencha todos os campos!', 'erro');
            return;
        }
        
        const dados = { nome, cpf, email, telefone };
        
        if (clienteEmEdicao) {
            atualizarCliente(clienteEmEdicao, dados);
        } else {
            criarCliente(dados);
        }
    });
    
    // Botão Limpar Formulário
    document.getElementById('btnLimpar').addEventListener('click', limparFormulario);
    
    // Botão Recarregar Lista
    document.getElementById('btnRecarregar').addEventListener('click', carregarClientes);
    
    // Botão Buscar
    document.getElementById('btnBuscar').addEventListener('click', filtrarClientes);
    
    // Busca em tempo real (opcional, pode ser removido se quiser apenas botão)
    document.getElementById('searchInput').addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            filtrarClientes();
        }
    });
    
    // Fechar modal ao clicar fora
    document.getElementById('modalMessage').addEventListener('click', function(e) {
        if (e.target === this) {
            fecharModal();
        }
    });
});
