const express = require('express'); 
const app = express(); 
const produtosRoutes = require('./src/routes/produtosRoutes');  
 
// Middleware para servir os arquivos estáticos do front-end 
app.use(express.static('./src/public')); 
 
// Middleware para interpretar JSON no corpo das requisições 
app.use(express.json()); 
 
// Aplica as rotas com o prefixo '/produtos' 
// O caminho '/' no produtosRoutes.js se torna '/produtos' aqui. 
app.use('/produtos', produtosRoutes);  
 
// Inicia o servidor na porta 3000 
app.listen(3000, () => { 
    console.log('Servidor rodando em http://localhost:3000'); 
}); 
