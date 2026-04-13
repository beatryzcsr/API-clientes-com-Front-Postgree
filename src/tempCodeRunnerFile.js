const express = require('express'); 
const app = express(); 
const clientesRoutes = require('./routes/clientesRoutes');  
 
// Middleware para servir os arquivos estáticos do front-end 
app.use(express.static('./src/public')); 
 
// Middleware para interpretar JSON no corpo das requisições 
app.use(express.json()); 
 
// Aplica as rotas de cliente com o prefixo '/clientes' 
// O caminho '/' no clientesRoutes.js se torna '/clientes' aqui. 
app.use('/clientes', clientesRoutes);  
 
// Inicia o servidor na porta 3000 
app.listen(3000, () => { 
    console.log('Servidor rodando em http://localhost:3000'); 
}); 
