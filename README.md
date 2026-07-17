# 🚀 Planej.ai - Educador Financeiro Inteligente

O **Planej.ai** é uma aplicação web inteligente desenvolvida para atuar como um educador financeiro pessoal. A pessoa usuária preenche um formulário detalhando sua renda, gastos fixos, dívidas e um objetivo financeiro (ex: comprar um carro, fazer uma viagem). Com base nesses dados, a aplicação se integra à inteligência artificial (Google Gemini) para gerar um diagnóstico completo, sugerindo planos de ação, dicas de economia e opções de renda extra.

O projeto tem como foco demonstrar como o Front-End pode consumir APIs de IA Generativa para transformar dados simples em insights úteis, claros e altamente personalizados.

> 💡 Projeto desenvolvido como parte do **Bootcamp DIO Santander 2026 - AI React Front-end**.

---

## 🛠️ Tecnologias Utilizadas

O projeto foi construído com as seguintes tecnologias e pacotes principais:

*   **React 19** (com **TypeScript 6**)
*   **Vite 8**
*   **Tailwind CSS 4** (Estilização e suporte a Light/Dark mode)
*   **React Router DOM 7** (Navegação SPA)
*   **Google Generative AI SDK** (Integração com o modelo Gemini 2.5 Flash)
*   **React Markdown** (Renderização estruturada das respostas da IA)
*   **React Loading Skeleton** (Feedback visual de carregamento)
*   **Lucide React** (Ícones)
*   **Local Storage API** (Persistência de dados e histórico)

---

## ⚙️ Como executar a aplicação

Siga os passos abaixo para rodar o projeto localmente na sua máquina:

1. Clone este repositório:
~~~bash
git clone https://github.com/seu-usuario/planejai.git
~~~

2. Acesse a pasta do projeto:
~~~bash
cd planejai
~~~

3. Instale as dependências:
~~~bash
npm install
~~~

4. Crie um arquivo chamado `.env.local` na raiz do projeto e adicione a sua chave de API do Google AI Studio:
~~~env
VITE_GEMINI_API_KEY=sua_chave_de_api_aqui
~~~

5. Inicie o servidor de desenvolvimento:
~~~bash
npm run dev
~~~

6. Acesse no navegador: `http://localhost:5173`

---

## 🧪 Como testar o fluxo principal

1. Na tela inicial, preencha as etapas do formulário com dados financeiros fictícios ou reais.
2. Ao finalizar, clique em gerar simulação. A tela de carregamento aparecerá enquanto a IA do Gemini processa os dados.
3. Leia o diagnóstico, as dicas e o plano de ação gerado na tela de Resultados.
4. Use o chat no rodapé do resultado para tirar dúvidas adicionais com a IA.
5. Navegue até a aba "Histórico" no menu superior para ver todas as simulações já feitas, que ficam salvas no seu navegador.

---

## 🏆 Desafios Implementados e Soluções

Além do escopo base do projeto, implementei duas melhorias/desafios avançados focados em persistência de dados e UX:

### 1. Página de Histórico de Simulações
Foi criada uma rota dedicada para listar o resumo de todas as simulações anteriores do usuário, permitindo o gerenciamento desses dados.
*   **Como foi implementado:** Utilizei a API do `localStorage` gerenciada por um hook customizado (`useSimulationStorage`). Para a exclusão de registros, no lugar do simples `window.confirm` nativo do navegador, criei um Modal customizado utilizando o próprio Tailwind CSS, garantindo que a imersão visual (inclusive respeitando o Dark Mode) não fosse quebrada.
*   **Destaque:** As requisições à API do Gemini custam tempo e cota. Por isso, a aplicação armazena os insights já gerados no histórico. Se o usuário abrir os detalhes de uma simulação passada, o sistema recupera o JSON do cache (localStorage) instantaneamente, evitando chamadas de rede desnecessárias.

### 2. Chat Contínuo com o Educador Financeiro
O usuário não fica limitado ao primeiro relatório; ele pode conversar livremente com a IA sobre aquela simulação específica.
*   **Como foi implementado:** Em vez de usar requisições simples (`generateContent`), implementei a função `startChat` do SDK do Gemini. Isso permite enviar o contexto inicial da simulação e manter o histórico da conversa de forma contínua.
*   **Destaque UX:** Todo o array de mensagens é salvo no `localStorage` vinculado ao ID daquela simulação. Na interface, criei um contêiner com altura fixa e `overflow-hidden`, acoplado a um `useRef` do React. Sempre que o usuário ou a IA enviam uma mensagem, um `useEffect` dispara o método `scrollIntoView`, rolando a tela automaticamente para a mensagem mais recente, recriando a experiência de um aplicativo de mensagens real.

---

## 🧠 O que aprendi durante o desafio

Durante o desenvolvimento e expansão deste projeto, consolidei conhecimentos importantes:
*   **Gerenciamento do Ciclo de Vida do React:** O uso cuidadoso de `useCallback`, `useRef` e `useEffect` foi essencial para evitar loops infinitos de renderização que poderiam esgotar a cota da API.
*   **Engenharia de Prompt e Estruturação de Dados:** Aprendi a forçar modelos de IA a responderem em formatos rigorosos (`responseMimeType: "application/json"`), permitindo que o Front-End faça o parse seguro de textos gerados via IA direto para componentes React.
*   **Tratamento de Exceções em APIs Externas:** Lidar com mudanças de rotas da API (como erros 404/429) e gerenciar estados de *loading*, *error* e *cache* local para entregar uma interface responsiva e confiável.
