
# **Tecnologias Hacker - Roteiro 3 - Privacy Extension**

## Por Pedro Civita

---

## **Visão Geral**

A **TecHack Privacy Extension** é uma extensão para navegadores desenvolvida para detectar e apresentar potenciais violações de privacidade durante a navegação web. Ela fornece aos usuários insights sobre como os sites podem estar comprometendo sua privacidade, detectando várias técnicas de rastreamento e ameaças à segurança.

## **Funcionalidades**

- **Conexões a Domínios de Terceiros**

  - Detecta e lista todos os domínios de terceiros conectados durante a navegação.
  - Ajuda os usuários a entender quais serviços externos ou rastreadores estão presentes em uma página.

- **Detecção de Ameaças de Sequestro de Navegador (Hijacking e Hook)**

  - Monitora tentativas de injeção de scripts maliciosos e modificações suspeitas no DOM.
  - Alerta o usuário se alguma ameaça for detectada.

- **Detecção de Armazenamento de Dados (Storage Local - HTML5)**

  - Identifica o uso de vários mecanismos de armazenamento HTML5:
    - `localStorage`
    - `sessionStorage`
    - `IndexedDB`
    - `Web SQL`
  - Exibe os dados armazenados para o usuário.

- **Análise de Cookies e Supercookies**

  - Detecta o número de cookies e supercookies injetados durante o carregamento da página.
  - Diferencia entre cookies de primeira e terceira parte.
  - Identifica se os cookies são de sessão ou persistentes.
  - Detecta supercookies, como ETags, utilizados para rastreamento persistente.

- **Detecção de Fingerprinting (Canvas, WebGL e AudioContext)**

  - Monitora o uso de APIs conhecidas por serem utilizadas em técnicas de fingerprinting.
  - Alerta o usuário se essas técnicas forem detectadas.

- **Detecção de Sincronização de Cookies**

  - Identifica quando valores de cookies são sincronizados entre domínios de primeira e terceira parte.
  - Alerta o usuário sobre potenciais rastreamentos cross-site por meio da sincronização de cookies.

- **Cálculo de Pontuação de Privacidade**

  - Calcula uma pontuação de privacidade para cada página com base em uma metodologia clara.
  - Fornece uma representação visual da pontuação e explicações detalhadas.

## **Instalação**

1. **Baixe os Arquivos da Extensão**

   - Clone ou baixe os arquivos da extensão deste repositório.

2. **Carregue a Extensão no Firefox**

   - Abra o Firefox e navegue até `about:debugging#/runtime/this-firefox`.
   - Clique em **"Carregar Manifesto Temporário"**.
   - Selecione o arquivo `manifest.json` da pasta da extensão.

3. **Carregue a Extensão no Chrome (Opcional)**

   - Abra o Chrome e navegue até `chrome://extensions/`.
   - Ative o **"Modo do desenvolvedor"**.
   - Clique em **"Carregar sem compactação"**.
   - Selecione a pasta da extensão.

## **Uso**

1. **Navegue para Qualquer Site**

   - Acesse qualquer site que deseja analisar.

2. **Abra o Popup da Extensão**

   - Clique no ícone da extensão na barra de ferramentas do navegador para abrir o popup.

3. **Visualize o Relatório de Privacidade**

   - O popup exibe um relatório completo de privacidade, incluindo:
     - Pontuação de Privacidade
     - Conexões a domínios de terceiros
     - Detalhes de cookies e supercookies
     - Mecanismos de armazenamento utilizados
     - Detecção de técnicas de fingerprinting
     - Tentativas de sequestro de navegador
     - Detecção de sincronização de cookies

4. **Atualize a Análise**

   - Clique em **"Reiniciar e Verificar Novamente"** para atualizar os dados e reanalisar a página atual.

5. **Visualize a Metodologia**

   - Clique em **"Ver metodologia"** para entender como a pontuação de privacidade é calculada.

## **Metodologia de Pontuação**

A pontuação de privacidade é calculada com base nos seguintes critérios:

- **Cookies de Terceira Parte:** -1 ponto por cookie (máximo de -30 pontos)
- **Conexões de Terceiros:** -2 pontos por conexão (máximo de -20 pontos)
- **Uso de Mecanismos de Armazenamento HTML5:** -10 pontos para cada mecanismo detectado (`localStorage`, `sessionStorage`, `IndexedDB`, `Web SQL`)
- **Técnicas de Fingerprinting:**
  - Canvas Fingerprinting: -20 pontos
  - WebGL Fingerprinting: -20 pontos
  - AudioContext Fingerprinting: -20 pontos
- **Tentativas de Sequestro de Navegador:** -20 pontos se detectadas
- **Supercookies (ETag):** -10 pontos se detectados
- **Sincronização de Cookies:** -15 pontos se detectada

A pontuação máxima é 100, e a mínima é 0. Uma pontuação mais alta indica melhores práticas de privacidade por parte do site.

## **Atendimento aos Requisitos do Roteiro 3**

Esta extensão atende aos requisitos especificados no "Roteiro 3" da seguinte forma:

- **Conexões a Domínios de Terceira Parte (2,5 pontos)**

  - Detecta e lista todos os domínios de terceiros conectados durante a navegação.
  - Fornece detalhes ao usuário no popup.

- **Potenciais Ameaças de Sequestro de Navegador (1 ponto)**

  - Monitora e alerta o usuário sobre qualquer injeção suspeita de scripts ou modificações que possam indicar tentativas de sequestro.

- **Detecção de Armazenamento de Dados (2,5 pontos)**

  - Detecta o uso de `localStorage`, `sessionStorage`, `IndexedDB` e `Web SQL`.
  - Exibe os dados armazenados para o usuário.

- **Quantidade de Cookies e Supercookies (1 ponto)**

  - Detecta o número de cookies e supercookies.
  - Diferencia entre cookies de primeira e terceira parte.
  - Identifica cookies de sessão e persistentes.

- **Detecção de Canvas Fingerprinting (1 ponto)**

  - Monitora e alerta o usuário se técnicas de Canvas fingerprinting forem utilizadas.
  - Também detecta fingerprinting via WebGL e AudioContext.

- **Detecção de Sincronização de Cookies (Implementado)**

  - Identifica quando valores de cookies são sincronizados entre domínios de primeira e terceira parte.
  - Alerta o usuário sobre potenciais rastreamentos cross-site.

- **Cálculo de Pontuação de Privacidade (2 pontos)**

  - Calcula uma pontuação de privacidade com base em uma metodologia clara.
  - Fornece explicações detalhadas ao usuário.

## **Estrutura do Código**

A extensão é composta pelos seguintes arquivos:

- **manifest.json**: Define as permissões da extensão, scripts de background, content scripts e a ação do navegador.

- **background.js**: Contém scripts de background que:

  - Detectam cookies e supercookies.
  - Monitoram requisições de rede para conexões de terceiros.
  - Detectam sincronização de cookies.
  - Recebem mensagens dos content scripts.

- **content_script.js**: Injetado nas páginas web para:

  - Detectar o uso de mecanismos de armazenamento HTML5.
  - Monitorar técnicas de fingerprinting.
  - Detectar potenciais tentativas de sequestro.

- **popup.html**: Define a estrutura do popup exibido ao usuário.

- **popup.js**: Lida com a lógica do popup, incluindo:

  - Cálculo da pontuação de privacidade.
  - Atualização da interface com os dados detectados.
  - Gerenciamento de interações do usuário.

- **popup.css**: Contém os estilos da interface do popup.

- **icons/**: Diretório contendo os ícones utilizados na extensão.

## **Referências**

- Mozilla Developer Network:

  - [Sua primeira extensão](https://developer.mozilla.org/pt-BR/docs/Mozilla/Add-ons/WebExtensions/sua_primeira_WebExtension)

  - [Exemplos de WebExtensions](https://developer.mozilla.org/pt-BR/Add-ons/WebExtensions/Examples)

- IBM Developer Works:

  - [Extendendo o Chrome com ações de navegador e popups](https://www.ibm.com/developerworks/br/library/os-extendchrome/index.html)

- Repositórios no GitHub:

  - [StoragErazor](https://github.com/Miraculix200/StoragErazor)

- Recursos Adicionais:

  - [Fingerprinting Techniques](https://fingerprintable.org)

## **Observações Finais**

Esta extensão foi desenvolvida para fins educacionais e demonstra como extensões de navegador podem detectar potenciais violações de privacidade e ameaças à segurança. Os usuários devem estar cientes das implicações de privacidade ao navegar na web e tomar medidas adequadas para proteger seus dados.
