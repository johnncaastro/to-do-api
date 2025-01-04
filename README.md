<h1 align="center">
  API do To.do app
</h1>

## :page_with_curl: Sobre

A API do To.do app foi feita para realizar a listagem, criação, alteração e remoção (CRUD) das tasks

## 🚀 Tecnologias

Este projeto foi desenvolvido com as seguintes tecnologias:

- [NodeJS](https://nodejs.org/pt)
- [Fastify](https://fastify.dev/)
- [Postgres](https://www.npmjs.com/package/postgres)
- [dot-env](https://www.npmjs.com/package/dotenv)

## 👷 Instalação

Clone o repositório com o seguinte comando no seu terminal (Você precisa ter o [Node.js](https://nodejs.org/en/) e o [Git](https://git-scm.com/) instalados no seu computador)

```git clone https://github.com/johnncaastro/to-do-api.git```

Instale as dependências para o funcionamento do projeto

```npm install```

Entre na plataforma da [neon.tech](https://neon.tech/), crie a sua conta e faça o login

No menu lateral, entre em projetos e crie o seu no botão *New Project* (preencha apenas o nome e clique em *Create project*)

Dentro do projeto Node, execute somente o arquivo *create-table.js* com o código abaixo para a criação das tabelas necessárias para o funcionamento:

```js
import { sql } from './db.js'

sql`
  CREATE TABLE tasks (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`.then(() => {
  console.log('Tabela tasks criada!')
})

sql`
  CREATE TABLE items (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    is_complete BOOLEAN DEFAULT FALSE,
    task_id TEXT NOT NULL,
    FOREIGN KEY (task_id) REFERENCES tasks (id) ON DELETE CASCADE
  );
`.then(() => {
  console.log('Tabela items criada!')
})
```

Na sua conta do neon, entre no menu *Dashboard*, clique em *Copy snippet* dentro do campo *Connection string*, volte ao projeto Node,
crie um arquivo com o nome *.env* na raiz do projeto e dentro dele insira o código abaixo substituindo o *string-de-conexao* pelo Control + V:

```DATABASE_URL="string-de-conexao"``` 

## 🏃 Começando

Insira o comando abaixo para iniciar a aplicação:

```npm run start```

Após esses passos, a aplicação já está pronta para o uso. Existem programas que ajudam a realizar requisições para a API, como por exemplo o
[Insomnia](https://insomnia.rest/). Além disso, se o seu editor de código for o [VSCode](https://code.visualstudio.com/) existe uma extensão
chamada REST Client, que também ajuda nisso. Para auxiliar na utilização dela, instale a extensão, crie um arquivo com o final .http na raiz do projeto, insira
os comandos abaixo e em cima de cada rota você pode clicar em *Send Request* para testá-la. As rotas disponíveis são do tipo GET (para obter as tasks),
POST (para criar uma nova task), PUT (para atualizar uma task específica) e DELETE (para remover uma task específica). Nas rotas do tipo POST e PUT
você pode trocar os nomes do título e item. Na primeira rota do tipo PUT vale lembrar de colocar o id do item que pretende alterar o nome. Nas rotas
do TIPO POST, PUT e DELETE é necessário trocar o *id-da-task* e *id-do-item* pelos id's específicos.

```js
GET http://localhost:3333/tasks

###

POST http://localhost:3333/tasks
Content-Type: application/json

{
  "title": "roadmap de estudos de frontend",
  "items": [
    {
      "name": "HTML"
    },
    {
      "name": "CSS"
    },
    {
      "name": "Javascript"
    },
    {
      "name": "uso de API com fetch"
    }
  ]
}

###

PUT http://localhost:3333/tasks/id-da-task
Content-Type: application/json

{
  "title": "Novo título",
  "items": [
    {
      "id": 3,
      "name": "Novo nome do item"
    },
    {
      "id": 4,
      "name": "Novo nome do item"
    }
  ]
}

###

PUT http://localhost:3333/tasks/item/completed/id-do-item
Content-Type: application/json

{}

###

DELETE http://localhost:3333/tasks/id-da-task
```

## :memo: Licença

Esse projeto está sob a licença MIT. Veja o arquivo [LICENSE](https://github.com/johnncaastro/to-do-api/blob/main/LICENSE) para mais detalhes.

---

Feito com ♥ por Johnn Castro :wave: [Entre em contato!](https://www.linkedin.com/in/johnncaastro/)

