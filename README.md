
![TrackMAIL Logo](/public/img/logo.svg) 
# TrackMAIL Sistema de Gestão de Logística
Bem-vindo ao TrackMAIL, uma aplicação web completa para gestão e rastreamento de encomendas. Desenvolvido como um sistema robusto e intuitivo, o TrackMAIL oferece um painel administrativo protegido por login para gerenciamento completo de clientes, encomendas, rotas e entregas, além de uma interface pública para que os clientes possam rastrear suas encomendas em tempo real.

Este projeto foi construído com as mais modernas tecnologias de frontend, utilizando Vue 3 com a Composition API e Vite para uma experiência de desenvolvimento ágil e performática.

---

## ✨ Funcionalidades Principais

O sistema é dividido em duas áreas principais: o Painel de Gestão e a Tela de Rastreio.

### Painel de Gestão (Acesso Restrito)
Acesso seguro através de uma tela de login (`usuário: admintrackmail`, `senha: admin123`).

* **Gerenciamento de Clientes:**
    * Cadastro, edição e exclusão de clientes.
    * Busca instantânea por nome ou CPF/CNPJ.
* **Gerenciamento de Encomendas:**
    * Cadastro, edição e exclusão de encomendas.
    * Busca rápida por tipo ou endereço.
* **Gerenciamento de Rotas:**
    * Cadastro, edição e exclusão de rotas de entrega.
    * Filtro por cidade de origem e destino.
* **Gerenciamento de Entregas:**
    * Criação, edição e exclusão de entregas, associando clientes, encomendas e rotas.
    * Geração automática de código de rastreamento.
    * **Atualização de status diretamente na tabela** (Em Preparo, Em Trânsito, Entregue, etc.).
* **Listagem de Centros:**
    * Visualização e busca de centros de distribuição.

### 🚚 Tela de Rastreio (Acesso Público)
Uma interface limpa e centralizada para que o cliente final possa consultar o status e o histórico de sua encomenda utilizando o código de rastreamento.

---

## 🚀 Tecnologias Utilizadas

* **Frontend:**
    * **Vue 3:** Utilizando a moderna **Composition API** para um código mais organizado e reutilizável.
    * **Vue Router:** Para gerenciamento de rotas e criação de uma Single Page Application (SPA).
    * **Vite:** Como ferramenta de build, garantindo um desenvolvimento extremamente rápido.
* **Backend (Desenvolvimento):**
    * **json-server:** Para simular uma API RESTful completa durante o desenvolvimento.
* **Estilização:**
    * **CSS Puro:** Com variáveis, Flexbox e Grid Layout para criar um design responsivo e moderno sem a necessidade de frameworks pesados.

---

## ⚙️ Como Executar o Projeto Localmente

Siga os passos abaixo para configurar e rodar o projeto em sua máquina.

### Pré-requisitos
* [Node.js](https://nodejs.org/) (versão 16 ou superior)
* [npm](https://www.npmjs.com/) ou [Yarn](https://yarnpkg.com/)

### Instalação

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/DouglasTeyh/trackmail.git
    ```

2.  **Navegue até a pasta do projeto:**
    ```bash
    cd trackmail
    ```

3.  **Instale as dependências do frontend:**
    ```bash
    npm install
    ```
    ou
    ```bash
    npm install
    npm install vue@latest
    npm install vite@latest
    ```

### Executando a Aplicação

Para rodar o projeto, você precisa de dois terminais: um para o backend (API) e outro para o frontend (Vue).

1.  **Inicie o Frontend (Vite Dev Server):**
    No segundo terminal, execute o comando para iniciar a aplicação Vue.
    ```bash
    npm run dev
    ```

2. A aplicação estará disponível em `http://localhost:5173`.
    * ou então acesse o site: 
---

## 🚀 Deploy

O projeto está pronto e foi publicado na plataforma [Vercel](https://vercel.com). 

---

## 👨‍💻 Autor

* **José Douglas Tranquilino da Silva**
    * **GitHub:** [@DouglasTeyh](https://github.com/DouglasTeyh)
    * **LinkedIn:** [DouglasTeyh](https://www.linkedin.com/in/douglasteyh/)

* **Wellington Vinicius**
    * **GitHub:** [@username](https://github.com/username)
    * **LinkedIn:** [username](https://www.linkedin.com/in/username/) "se nao tiver pode remover"