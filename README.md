# 📋 Projeto To-Do List — Java + Spring Boot + MySQL

Projeto de **lista de tarefas (To-Do List)** desenvolvido com **Java Spring Boot** no back-end, **HTML, CSS, JavaScript e jQuery** no front-end, utilizando **MySQL** como banco de dados e **Docker** para facilitar a execução do ambiente.

O objetivo do projeto é servir como estudo prático e também como item de portfólio, integrando front-end, back-end e banco de dados em uma aplicação real.

---

## 🛠️ Tecnologias Utilizadas

### Back-end
- Java 17+
- Spring Boot
- Spring Web
- Spring Data JPA
- MySQL Connector

### Front-end
- HTML5
- CSS3
- JavaScript
- jQuery

### Infraestrutura
- Docker
- Docker Compose
- MySQL 8.0

---

## 📁 Estrutura do Projeto

Projeto-Java/
├── backend/ # API Spring Boot
├── frontend/ # Front-end (HTML, CSS, JS, jQuery)
├── docker-compose.yml
├── start.bat # Script para subir o projeto
├── stop.bat # Script para parar o projeto
└── .gitignore


---

## 🗄️ Banco de Dados

O banco de dados utilizado é **MySQL**.

- Nome do banco: `tarefas_db`
- A criação das tabelas pode ser feita manualmente via **HeidiSQL**
- O container MySQL é iniciado via Docker

---

## ▶️ Como Executar o Projeto

### Pré-requisitos
- Docker
- Docker Compose
- Git

### Passo a passo

1. Clone o repositório:

```bash
git clone https://github.com/Chagas132/Projeto-Java.git
2. Acesse a pasta do projeto:

cd Projeto-Java


3.Suba os containers:

docker-compose up -d

4-Acesse:

Back-end: http://localhost:8080

Front-end: abrir os arquivos da pasta frontend no navegadora

Funcionalidades

Criar tarefas

Listar tarefas

Atualizar tarefas

Remover tarefas

Integração front-end ↔ back-end via API REST

CORS configurado para comunicação entre front e back

🚀 Status do Projeto

🟡 Em desenvolvimento
Funcionalidades básicas implementadas, com melhorias contínuas no front-end, back-end e organização do projeto.

👤 Autor

Michel Chagas
Projeto desenvolvido para estudos em Java, Spring Boot, APIs REST, Docker e integração full-stack.
