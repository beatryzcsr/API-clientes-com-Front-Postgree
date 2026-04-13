create table clientes (
id serial primary key,
nome varchar(40) not null,
cpf varchar (11) not null,
email varchar (30) not null,
telefone varchar (30) not null
)