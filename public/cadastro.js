const apiBase = '/produtos';
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const refreshButton = document.getElementById('refreshButton');
const productTable = document.getElementById('productTable');
const message = document.getElementById('message');
const productForm = document.getElementById('productForm');
const clearButton = document.getElementById('clearButton');
const logoutButton = document.getElementById('logoutButton');

function getToken() {
  return localStorage.getItem('jwtToken');
}

function showMessage(text) {
  message.textContent = text;
  setTimeout(() => {
    message.textContent = '';
  }, 3000);
}

function getAuthHeaders() {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  };
}

function redirectToLogin() {
  localStorage.removeItem('jwtToken');
  window.location.href = '/';
}

async function fetchJson(url, options = {}) {
  const token = getToken();
  if (!token) {
    redirectToLogin();
    return null;
  }

  const response = await fetch(url, options);
  if (response.status === 401) {
    redirectToLogin();
    return null;
  }

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.mensagem || 'Erro na requisição');
  }

  return response.json();
}

async function loadProducts() {
  const products = await fetchJson(apiBase, { headers: getAuthHeaders() });
  if (products) {
    renderTable(products);
  }
}

function formatCurrency(value) {
  return Number(value).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}

function renderTable(products) {
  productTable.innerHTML = '';

  if (!products || products.length === 0) {
    productTable.innerHTML = '<tr><td colspan="6">Nenhum produto encontrado.</td></tr>';
    return;
  }

  products.forEach(product => {
    const tr = document.createElement('tr');

    tr.innerHTML = `
      <td>${product.id}</td>
      <td>${product.nome}</td>
      <td>${formatCurrency(product.preco)}</td>
      <td>${product.estoque}</td>
      <td>${product.categoria}</td>
      <td>
        <button class="edit-button" data-id="${product.id}">Editar</button>
        <button class="delete-button" data-id="${product.id}">Excluir</button>
      </td>
    `;

    productTable.appendChild(tr);
  });
}

function fillForm(product) {
  document.getElementById('productId').value = product.id || '';
  document.getElementById('nome').value = product.nome || '';
  document.getElementById('preco').value = product.preco ?? '';
  document.getElementById('estoque').value = product.estoque ?? '';
  document.getElementById('categoria').value = product.categoria || '';
}

function clearForm() {
  fillForm({});
}

async function handleSearch() {
  const term = searchInput.value.trim();
  if (!term) {
    await loadProducts();
    return;
  }

  const products = await fetchJson(`${apiBase}/buscar/nome/${encodeURIComponent(term)}`, {
    headers: getAuthHeaders()
  });
  if (products) {
    renderTable(products);
  }
}

async function handleSave(event) {
  event.preventDefault();

  const id = document.getElementById('productId').value;
  const nome = document.getElementById('nome').value.trim();
  const preco = Number(document.getElementById('preco').value);
  const estoque = Number(document.getElementById('estoque').value);
  const categoria = document.getElementById('categoria').value.trim();

  if (!nome || !categoria || Number.isNaN(preco) || Number.isNaN(estoque)) {
    showMessage('Preencha todos os campos corretamente.');
    return;
  }

  const method = id ? 'PUT' : 'POST';
  const url = id ? `${apiBase}/${id}` : apiBase;

  try {
    await fetchJson(url, {
      method,
      headers: getAuthHeaders(),
      body: JSON.stringify({ nome, preco, estoque, categoria })
    });

    clearForm();
    await loadProducts();
    showMessage(id ? 'Produto atualizado com sucesso!' : 'Produto criado com sucesso!');
  } catch (error) {
    showMessage(error.message);
  }
}

async function handleTableClick(event) {
  const target = event.target;
  if (target.matches('.edit-button')) {
    const productId = target.dataset.id;
    await loadProduct(productId);
  }

  if (target.matches('.delete-button')) {
    const productId = target.dataset.id;
    await deleteProduct(productId);
  }
}

async function loadProduct(id) {
  const product = await fetchJson(`${apiBase}/buscar/id/${id}`, {
    headers: getAuthHeaders()
  });
  if (product) {
    fillForm(product);
  }
}

async function deleteProduct(id) {
  if (!confirm('Deseja realmente excluir este produto?')) {
    return;
  }

  try {
    await fetchJson(`${apiBase}/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    await loadProducts();
    showMessage('Produto excluído com sucesso!');
  } catch (error) {
    showMessage(error.message);
  }
}

logoutButton.addEventListener('click', redirectToLogin);
searchButton.addEventListener('click', handleSearch);
refreshButton.addEventListener('click', loadProducts);
productForm.addEventListener('submit', handleSave);
clearButton.addEventListener('click', clearForm);
productTable.addEventListener('click', handleTableClick);

loadProducts();
