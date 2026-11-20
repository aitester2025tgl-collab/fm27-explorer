# FM27 EXPLORER — guia rápido

Uma aplicação para pesquisar jogadores e clubes dos teus saves do Football Manager 27,
com todos os atributos (incluindo os ocultos: CA/PA, consistência, personalidade...).

## COMO USAR
1. Extrai a pasta "fm27-explorer" para onde quiseres.
2. Abre o "FM27-Explorer.html" (duplo clique). Usa o Chrome ou o Edge.
3. Carrega em "Importar save" e escolhe um ficheiro .fm.
   Os saves estão normalmente em:
   Documentos\Sports Interactive\Football Manager 27\games
4. Espera 1 a 3 minutos. A página fica parada durante a leitura: é normal, não a feches.
5. A app abre em inglês. Para mudar para português, carrega em **PT** no canto superior direito
   (a escolha fica guardada).

## PREÇO ESTIMADO E CLÁUSULAS
- "Valor" é o valor de mercado que o jogo calcula, não o que o clube pede.
- "Preço est." é uma estimativa do preço pedido, feita pela app: parte do valor de mercado
  e sobe/desce conforme os anos de contrato que faltam, a importância do jogador no
  clube (estrela, titular, suplente...) e a idade. Passa o rato por cima para ver porquê.
- Se o jogador tem cláusula de rescisão, o preço nunca passa dela (marcado com ⚑) e a
  cláusula aparece na ficha do jogador. As cláusulas vêm do save: importa o save outra vez
  se o importaste antes desta versão.
- Jogadores sem clube aparecem como "Grátis" (só pagas salário e prémio de assinatura).
- É uma aproximação: o preço real só se sabe ao negociar no jogo.

## ORDENAR TABELAS
Em todas as tabelas, clica no título de uma coluna para ordenar; um 2.º clique inverte
a ordem (▼ do maior para o menor, ▲ ao contrário).

## VÁRIOS SAVES E VÁRIAS ÉPOCAS
- Cada importação fica guardada com o nome do save e a data no jogo.
- Podes importar saves diferentes, ou o mesmo save mais tarde (ex.: na época seguinte,
  com os novos jogadores) e manter as duas versões.
- Escolhes qual queres ver no seletor "Save", no topo.
- "Apagar" remove da aplicação o save que estás a ver (o save do jogo não é tocado).

## SEPARADOR TÁTICA
- Equipa: vem escolhida a equipa que treinas no save; podes escolher qualquer outra.
- Tática: escolhe uma tática da lista.
  * "Carregadas no teu jogo": as táticas que tens carregadas no FM. Para aparecerem,
    carrega a tática no jogo (ex.: um .fmf descarregado), GRAVA o jogo e volta a
    importar o save aqui. A formação e as posições vêm do jogo; as funções não ficam
    legíveis no save, por isso escolhe em cada posição a função que usas no jogo
    (a app lembra-se da tua escolha).
  * "Predefinidas da app": táticas já com funções e instruções sugeridas.
  Os ficheiros .fmf são encriptados, por isso não dá para os abrir diretamente na app.
- No campo vês o melhor onze e a 2.ª opção. As posições fracas ficam a vermelho (⚠).
- Sem posição selecionada, o painel pesquisa todos os jogadores e diz em que posição
  da tua tática cada um encaixa melhor. Clicar na mesma posição 2 vezes volta a isto.
- Clica numa posição: aparecem os jogadores que encaixam na FUNÇÃO dessa posição
  (por defeito, no máximo 5 pontos abaixo do teu titular; muda em "Encaixe mín."),
  com os atributos-chave da função lado a lado com os do titular (▲ = melhor que o
  titular), e ainda CA, potencial, valor e contrato.
  Ordena clicando nos títulos (CA, PA, Encaixe, Valor, Idade) e filtra por idade máxima,
  valor,
  salário, fim de contrato, pé preferido (Esquerdo/Direito/Ambos = pé Forte ou melhor),
  altura mínima, nacionalidade, CA/PA mínimos e onde procurar
  (todos os clubes, o teu plantel ou jogadores sem clube).
- "editar pesos" deixa-te afinar que atributos contam em cada função.
- As notas de encaixe (0-100) são uma aproximação da app, não a avaliação oficial do
  jogo. Confirma com as estrelas das funções no jogo.

## MODO REALISTA
A app lê os valores reais do save, incluindo o que o jogo esconde (CA/PA, atributos
ocultos, personalidade). Ativa "Modo realista" no topo para esconder essa informação.

## PRIVACIDADE E NOTAS
- O save é lido no teu computador e nunca é enviado para lado nenhum. Os dados ficam
  guardados no browser deste PC.
- Para ler o save, a página descarrega da internet o Python para browser (Pyodide) e o
  leitor de saves fmsave (open source, licença MIT: https://github.com/rhiever/fmsave).
  Por isso é preciso internet no momento de importar; para consultar, não.
- Se limpares os dados de navegação do browser, os saves importados são apagados
  (basta voltar a importá-los).
- O fmsave está verificado para uma versão específica do FM27. Com patches mais recentes
  normalmente funciona na mesma, mas confirma 2 ou 3 jogadores com o jogo.
- Os valores em euros são convertidos de libras com um câmbio fixo (aproximados).
- Algumas nações muito pequenas aparecem como "Nação #número".

## AGRADECIMENTOS
- **fmsave**, de Randal S. Olson (open source, licença MIT): https://github.com/rhiever/fmsave
  É o fmsave que lê os saves do FM26/FM27. Todos os jogadores, clubes, contratos, cláusulas e
  táticas que vês na app vêm dele. Se gostares da app, deixa uma estrela no repositório do fmsave.
- **Pyodide** (MPL-2.0): https://pyodide.org — permite correr o fmsave dentro do browser.
