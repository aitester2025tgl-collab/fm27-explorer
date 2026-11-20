// ================= i18n: English (default) / Português =================
// Strings are written in Portuguese in the code and wrapped in t("…"); EN holds the English text.
// t("{n} jogadores", {n: 5}) fills {placeholders}. Language is stored per browser in localStorage.
const LANG = (() => { try { return localStorage.getItem("fm27lang") === "pt" ? "pt" : "en"; } catch (e) { return "en"; } })();
const NUMLOC = LANG === "pt" ? "pt-PT" : "en-GB";
document.documentElement.lang = LANG;

const EN = {
  // header / static page
  "Importar save": "Import save", "Apagar": "Delete", "Apagar este save da aplicação": "Remove this save from the app",
  "Jogadores": "Players", "Clubes": "Clubs", "Tática": "Tactic", "Modo realista": "Realistic mode",
  "Esconde CA/PA, atributos ocultos e personalidade, como no jogo": "Hides CA/PA, hidden attributes and personality, like in the game",
  "A carregar dados do save…": "Loading save data…",
  "Nome": "Name", "Posição": "Position", "Idade mín.": "Min age", "Idade máx.": "Max age", "CA mín.": "Min CA", "PA mín.": "Min PA",
  "Nacionalidade": "Nationality", "Clube": "Club", "Valor máx. (M€)": "Max value (€M)", "Só sem clube": "Free agents only",
  "Limpar": "Clear", "Exportar CSV": "Export CSV", "ex.: Bruno Fernandes": "e.g. Bruno Fernandes", "ex.: FC Porto": "e.g. FC Porto",
  "ex.: Sporting": "e.g. Sporting", "País": "Country", "Reputação": "Reputation", "CA médio (top 11)": "Avg CA (top 11)",
  // data labels
  "Todas": "All", "Todos": "All", "Sem clube": "No club", "Grátis": "Free", "empréstimo": "loan", "emprestado": "on loan",
  "data do jogo {d} · {p} jogadores · {c} clubes": "game date {d} · {p} players · {c} clubs",
  "Idade": "Age", "Valor": "Value", "Preço est.": "Est. price", "Salário/mês": "Wage/month", "Fim contrato": "Contract end",
  "{n} jogadores encontrados": "{n} players found",
  " · a mostrar os primeiros 300 (afina os filtros ou ordena por outra coluna)": " · showing the first 300 (narrow the filters or sort by another column)",
  "Valor (€)": "Value (€)", "Salário/mês (€)": "Wage/month (€)",
  // price
  "Sem clube: não há transferência, só salário e prémio de assinatura.": "Free agent: no transfer fee, only wages and signing bonus.",
  "Estimativa a partir do valor de mercado ({v}), anos de contrato ({y}), estatuto e idade.": "Estimated from market value ({v}), years left on contract ({y}), squad status and age.",
  "Cláusula de rescisão: {c}": "Release clause: {c}", "(o preço não passa disto).": "(the price can't go above it).",
  "Sem cláusula de rescisão conhecida.": "No known release clause.",
  "Contrato a acabar: pode haver pré-contrato a custo zero.": "Contract ending: a free pre-contract may be possible.",
  // player card
  "Muito Forte": "Very Strong", "Forte": "Strong", "Bastante Forte": "Fairly Strong", "Razoável": "Reasonable", "Fraco": "Weak", "Muito Fraco": "Very Weak",
  "emprestado por": "on loan from", "{n} anos": "{n} years old", "Fechar ✕": "Close ✕",
  "Valor de mercado": "Market value", "Preço pedido (estimativa)": "Asking price (estimate)", "Cláusula de rescisão": "Release clause",
  "Salário": "Wage", "p/m": "/month", "Contrato até": "Contract until", "Estatuto": "Squad status", "Altura": "Height",
  "Pé esq.": "Left foot", "Pé dir.": "Right foot", "Posições": "Positions", "Guarda-Redes": "Goalkeeping", "Técnicos": "Technical",
  "Mentais": "Mental", "Físicos": "Physical", "Atributos ocultos": "Hidden attributes", "Personalidade (oculta)": "Personality (hidden)",
  "Características": "Traits", "Nenhuma identificada": "None identified",
  "Verde = natural, amarelo = razoável, laranja = fraco. Passa o rato para ver o valor (1–20).": "Green = natural, yellow = competent, orange = weak. Hover to see the value (1–20).",
  "Na Propensão a Lesões e no Jogo Sujo, mais baixo é melhor.": "For Injury Proneness and Dirtiness, lower is better.",
  "Valores em € convertidos de libras (×{r}), por isso são aproximados.": "€ values are converted from pounds (×{r}), so they are approximate.",
  "Clica para ordenar (2.º clique inverte)": "Click to sort (click again to reverse)",
  // clubs
  "{n} clubes": "{n} clubs", " · a mostrar os 300 com mais reputação": " · showing the 300 most reputable",
  "Preço pedido estimado (passa o rato por cima de cada valor)": "Estimated asking price (hover over each value)",
  "← Voltar": "← Back", "reputação": "reputation", "{n} jogadores": "{n} players", "Equipa {n}": "Team {n}",
  "Emprestados a outros clubes ({n})": "Loaned out to other clubs ({n})",
  // import / boot
  "Esse ficheiro não é um save do Football Manager (.fm).": "That file is not a Football Manager save (.fm).",
  "A preparar o leitor de saves (na primeira vez pode demorar um pouco)…": "Preparing the save reader (the first time can take a moment)…",
  "A carregar o fmsave…": "Loading fmsave…", "A copiar o save para a memória…": "Copying the save into memory…",
  "A ler jogadores e clubes… Isto demora 1 a 3 minutos e a página fica parada enquanto isso. Não a feches.": "Reading players and clubs… This takes 1 to 3 minutes and the page freezes meanwhile. Don't close it.",
  "A guardar…": "Saving…", "erro desconhecido": "unknown error",
  " — confirma que tens internet (é preciso na primeira importação para descarregar o leitor).": " — check your internet connection (needed on the first import to download the reader).",
  "Não foi possível importar: {m}": "Could not import: {m}",
  "O save é lido aqui no teu computador e não é enviado para lado nenhum. Não feches esta página.": "The save is read here on your computer and is not sent anywhere. Don't close this page.",
  "O browser não deixa guardar dados": "This browser won't let the app store data",
  "Abre esta página no Chrome ou no Edge (sem janela anónima).": "Open this page in Chrome or Edge (not in a private window).",
  "Bem-vindo ao FM27 Explorer": "Welcome to FM27 Explorer",
  "Para começar, importa um save do Football Manager 27.": "To start, import a Football Manager 27 save.",
  "Importar save (.fm)": "Import save (.fm)",
  "Os saves estão normalmente em {p}.": "Saves are usually in {p}.",
  "O save é lido no teu computador e nunca sai dele. Na primeira importação é preciso internet para descarregar o leitor.": "The save is read on your computer and never leaves it. The first import needs an internet connection to download the reader.",
  "A leitura dos saves é feita pelo {l}, um projeto open source de Randal S. Olson.": "Saves are read by {l}, an open-source project by Randal S. Olson.",
  "Apagar \"{s}\" da aplicação?\n(O ficheiro do save no jogo não é afetado.)": "Remove \"{s}\" from the app?\n(The save file in the game is not affected.)",
  "A carregar \"{s}\" ({d})…": "Loading \"{s}\" ({d})…",
  "Não encontrei os dados deste save. Volta a importá-lo.": "Couldn't find this save's data. Please import it again.",
  // tactic: UI
  "Equipa": "Team", "Personalizada": "Custom", "Carregadas no teu jogo (do save)": "Loaded in your game (from the save)",
  "Predefinidas da app": "App presets", "Formação": "Formation", "Do save: {n}": "From save: {n}", "Funções por defeito": "Default roles",
  "<b>{n}</b> — carregada do teu save · formação com bola {f} · mentalidade {m}.<br>A formação e as posições vêm do jogo. As <b>funções não ficam legíveis no save</b>: vêm por defeito, por isso escolhe em cada posição a mesma função que tens no jogo (a app lembra-se).":
    "<b>{n}</b> — loaded from your save · in-possession formation {f} · {m} mentality.<br>Formation and positions come from the game. <b>Roles are not readable from the save</b>: they start with defaults, so pick the same role you use in the game for each position (the app remembers).",
  "Tática personalizada: escolhe a formação e a função de cada posição.": "Custom tactic: choose the formation and the role for each position.",
  " Para usares as táticas do teu jogo: carrega a tática no jogo, grava, e volta a importar o save.": " To use your in-game tactics: load the tactic in the game, save, and import the save again.",
  "Escolhe uma equipa no campo \"Equipa\".": "Choose a team in the \"Team\" field.",
  "Esta equipa não tem jogadores suficientes.": "This team doesn't have enough players.",
  "Encaixe médio do onze:": "Average XI fit:", "2.ªs opções:": "Second options:", "Posições a reforçar: {p}": "Positions to strengthen: {p}",
  "Em cada posição: titular (nome a negrito) e 2.ª opção por baixo. Clica numa posição para ver o ranking do plantel e procurar reforços. As notas vão de 0 a 100 e já contam com a familiaridade com a posição.":
    "Each position shows the starter (bold) and the second option below. Click a position to rank your squad and scout signings. Scores go from 0 to 100 and already account for position familiarity.",
  "Ambos": "Both", "Dir.": "Right", "Esq.": "Left", "Esquerdo {l}/20 · Direito {r}/20": "Left {l}/20 · Right {r}/20",
  "Todas as posições": "All positions",
  "Pesquisa geral. A coluna \"Melhor na tática\" diz em que posição da tua tática cada jogador encaixa melhor. Clica numa posição do campo para filtrar por ela (clica outra vez para voltar aqui).":
    "General search. The \"Best in tactic\" column shows where each player fits best in your tactic. Click a position on the pitch to filter by it (click again to come back here).",
  "ver todas as posições": "see all positions", "Titular": "Starter", "Atributos que contam (● = mais peso)": "Attributes that count (● = more weight)",
  "editar pesos": "edit weights", "Procurar em": "Search in", "Todos os clubes": "All clubs", "O meu plantel": "My squad",
  "Aplica-se ao preço pedido estimado": "Applies to the estimated asking price", "Preço máx. (M€)": "Max price (€M)",
  "Salário máx. (K€/mês)": "Max wage (€K/month)", "Contrato até (ano)": "Contract until (year)", "Pé preferido": "Preferred foot",
  "Qualquer": "Any", "Esquerdo": "Left", "Direito": "Right", "Altura mín. (cm)": "Min height (cm)", "Encaixe mín.": "Min fit",
  "Só quem joga em {p}": "Only players who play {p}",
  "Até {n} anos. ": "Up to {n} years old. ", "Ordenados por": "Sorted by", "clica nos títulos para mudar.": "click the headers to change.",
  "encaixe": "fit", "preço estimado": "estimated price", "salário": "wage", "idade": "age", "altura": "height",
  "Nenhum jogador com estes filtros.": "No players match these filters.",
  "Nenhum jogador com estes filtros. Baixa o encaixe mínimo ou alarga os filtros.": "No players match these filters. Lower the minimum fit or widen the filters.",
  "jogador": "player", "jogadores": "players", " · a mostrar os 150 primeiros": " · showing the first 150",
  "Pé preferido (Ambos = os dois pés Fortes ou melhor)": "Preferred foot (Both = both feet Strong or better)",
  "Pé": "Foot", "Alt.": "Ht.", "Altura (cm)": "Height (cm)", "Posição da tua tática onde encaixa melhor": "Position in your tactic where the player fits best",
  "Melhor na tática": "Best in tactic", "Encaixe": "Fit", "vs tit.": "vs starter", "Contr.": "Contract", "titular": "starter",
  "titular: {v}": "starter: {v}", " — clica para ordenar (2.º clique inverte)": " — click to sort (click again to reverse)",
  "Jogadores que encaixam na função {r}: encaixe mínimo {m} (por defeito, 5 abaixo do teu titular).": "Players who fit the {r} role: minimum fit {m} (by default, 5 below your starter).",
  "Pesos — {r}": "Weights — {r}", "0 = não conta · 1 = normal · 2 a 3 = muito importante": "0 = ignored · 1 = normal · 2 to 3 = very important",
  "Guardar": "Save", "Repor valores por defeito": "Reset to defaults",
  // presets
  "LXS 4231 W (meta FM-Arena)": "LXS 4231 W (FM-Arena meta)", "4-2-3-1 recomendado para o plantel": "4-2-3-1 recommended for the squad",
  "4-3-3 equilibrado": "Balanced 4-3-3", "3-4-2-1 com alas": "3-4-2-1 with wing-backs",
  // role names
  "Guarda-redes": "Goalkeeper", "Guarda-redes construtor": "Ball-Playing Goalkeeper", "Central": "Centre-Back",
  "Central construtor": "Ball-Playing Centre-Back", "Lateral ofensivo": "Attacking Full-Back", "Lateral defensivo": "Defensive Full-Back",
  "Ala": "Wing-Back", "Lateral construtor": "Playmaking Full-Back", "Médio de corredor": "Channel Midfielder",
  "Médio defensivo (proteção)": "Screening Defensive Midfielder", "Box-to-box": "Box-to-Box Midfielder", "Médio organizador": "Midfield Playmaker",
  "Médio ofensivo": "Attacking Midfielder", "Extremo invertido": "Inside Forward", "Extremo (cruzador)": "Winger (Crosser)",
  "Avançado de rutura": "Channel Forward", "Ponta de lança de referência": "Target Forward",
  // slot labels (Portuguese position abbreviations → FM English)
  "GR": "GK", "DE": "DL", "DD": "DR", "MDC": "DM", "MOE": "AML", "MOC": "AMC", "MOD": "AMR", "PL": "ST", "EE": "AML", "ED": "AMR",
  "ME": "ML", "MD": "MR", "MO": "AM", "ALE": "WBL", "ALD": "WBR",
  // mentality
  "Muito defensiva": "Very defensive", "Defensiva": "Defensive", "Cautelosa": "Cautious", "Equilibrada": "Balanced",
  "Positiva": "Positive", "Atacante": "Attacking", "Muito atacante": "Very attacking",
};

const ATTR_EN = {corners:"Corners",crossing:"Crossing",dribbling:"Dribbling",finishing:"Finishing",first_touch:"First Touch",free_kick_taking:"Free Kick Taking",heading:"Heading",long_shots:"Long Shots",long_throws:"Long Throws",marking:"Marking",passing:"Passing",penalty_taking:"Penalty Taking",tackling:"Tackling",technique:"Technique",
  aggression:"Aggression",anticipation:"Anticipation",bravery:"Bravery",composure:"Composure",concentration:"Concentration",decisions:"Decisions",determination:"Determination",flair:"Flair",leadership:"Leadership",off_the_ball:"Off the Ball",positioning:"Positioning",teamwork:"Teamwork",vision:"Vision",work_rate:"Work Rate",
  acceleration:"Acceleration",agility:"Agility",balance:"Balance",jumping_reach:"Jumping Reach",natural_fitness:"Natural Fitness",pace:"Pace",stamina:"Stamina",strength:"Strength",
  aerial_reach:"Aerial Reach",command_of_area:"Command of Area",communication:"Communication",eccentricity:"Eccentricity",handling:"Handling",kicking:"Kicking",one_on_ones:"One on Ones",punching:"Punching (Tendency)",reflexes:"Reflexes",rushing_out:"Rushing Out (Tendency)",throwing:"Throwing",
  consistency:"Consistency",dirtiness:"Dirtiness",important_matches:"Important Matches",injury_proneness:"Injury Proneness",versatility:"Versatility",
  adaptability:"Adaptability",ambition:"Ambition",loyalty:"Loyalty",pressure:"Pressure",professionalism:"Professionalism",sportsmanship:"Sportsmanship",temperament:"Temperament",controversy:"Controversy"};
const ATTR_SHORT_EN = {pace:"Pac",acceleration:"Acc",stamina:"Sta",work_rate:"Wor",finishing:"Fin",off_the_ball:"OtB",composure:"Cmp",passing:"Pas",vision:"Vis",technique:"Tec",first_touch:"Fir",decisions:"Dec",tackling:"Tck",positioning:"Pos",marking:"Mar",heading:"Hea",jumping_reach:"Jum",strength:"Str",anticipation:"Ant",concentration:"Cnt",dribbling:"Dri",crossing:"Cro",reflexes:"Ref",one_on_ones:"1v1",handling:"Han",aerial_reach:"Aer",kicking:"Kic",agility:"Agi",teamwork:"Tea",long_shots:"Lon",flair:"Fla",command_of_area:"Cmd",rushing_out:"TRO",bravery:"Bra",balance:"Bal"};
const POS_EN = {gk:"GK",dl:"DL",dc:"DC",dr:"DR",wbl:"WBL",dm:"DM",wbr:"WBR",ml:"ML",mc:"MC",mr:"MR",aml:"AML",amc:"AMC",amr:"AMR",stc:"ST"};
const STATUS_EN = {star_player:"Star player",important_player:"Important player",regular_starter:"Regular starter",squad_player:"Squad player",fringe_player:"Fringe player",impact_sub:"Impact sub",backup:"Backup",breakthrough_prospect:"Breakthrough prospect",future_prospect:"Future prospect",youngster:"Youngster",surplus_to_requirements:"Surplus to requirements",first_choice_goalkeeper:"First-choice goalkeeper",cup_goalkeeper:"Cup goalkeeper",domestic_cup_goalkeeper:"Domestic cup goalkeeper",emergency_backup:"Emergency backup",goalkeeper_emergency_backup:"Emergency backup goalkeeper",b_team_regular:"B team regular",unknown:"—"};
const SLOT_EN = {0:"First team",1:"U21 / Reserves",2:"U18"};
const NAT_EN = {"Argélia":"Algeria","Angola":"Angola","Benim":"Benin","Botsuana":"Botswana","Burkina Faso":"Burkina Faso","Burundi":"Burundi","Camarões":"Cameroon","Cabo Verde":"Cape Verde","Rep. Centro-Africana":"Central African Rep.","Chade":"Chad","Djibuti":"Djibouti","Egito":"Egypt","Guiné Equatorial":"Equatorial Guinea","Etiópia":"Ethiopia","Gabão":"Gabon","Gâmbia":"Gambia","Gana":"Ghana","Guiné":"Guinea","Guiné-Bissau":"Guinea-Bissau","Costa do Marfim":"Ivory Coast","Quénia":"Kenya","Lesoto":"Lesotho","Libéria":"Liberia","Líbia":"Libya","Madagáscar":"Madagascar","Malawi":"Malawi","Mali":"Mali","Mauritânia":"Mauritania","Maurícia":"Mauritius","Marrocos":"Morocco","Moçambique":"Mozambique","Namíbia":"Namibia","Níger":"Niger","Nigéria":"Nigeria","Ruanda":"Rwanda","São Tomé e Príncipe":"São Tomé and Príncipe","Senegal":"Senegal","Seicheles":"Seychelles","Serra Leoa":"Sierra Leone","Somália":"Somalia","África do Sul":"South Africa","Sudão":"Sudan","Essuatíni":"Eswatini","Tanzânia":"Tanzania","Congo":"Congo","Togo":"Togo","Tunísia":"Tunisia","Uganda":"Uganda","RD Congo":"DR Congo","Zâmbia":"Zambia","Zimbabué":"Zimbabwe",
  "Afeganistão":"Afghanistan","Barém":"Bahrain","Bangladesh":"Bangladesh","China":"China","Hong Kong":"Hong Kong","Índia":"India","Indonésia":"Indonesia","Irão":"Iran","Iraque":"Iraq","Japão":"Japan","Jordânia":"Jordan","Cazaquistão":"Kazakhstan","Kuwait":"Kuwait","Quirguistão":"Kyrgyzstan","Laos":"Laos","Líbano":"Lebanon","Macau":"Macau","Malásia":"Malaysia","Maldivas":"Maldives","Myanmar":"Myanmar","Nepal":"Nepal","Coreia do Norte":"North Korea","Omã":"Oman","Paquistão":"Pakistan","Catar":"Qatar","Arábia Saudita":"Saudi Arabia","Singapura":"Singapore","Coreia do Sul":"South Korea","Sri Lanka":"Sri Lanka","Síria":"Syria","Taiwan":"Taiwan","Tajiquistão":"Tajikistan","Tailândia":"Thailand","Filipinas":"Philippines","Turquemenistão":"Turkmenistan","Emirados Árabes Unidos":"United Arab Emirates","Uzbequistão":"Uzbekistan","Vietname":"Vietnam","Iémen":"Yemen",
  "Antígua e Barbuda":"Antigua and Barbuda","Aruba":"Aruba","Barbados":"Barbados","Bermudas":"Bermuda","Canadá":"Canada","Costa Rica":"Costa Rica","Cuba":"Cuba","El Salvador":"El Salvador","Granada":"Grenada","Guatemala":"Guatemala","Guiana":"Guyana","Haiti":"Haiti","Honduras":"Honduras","Jamaica":"Jamaica","México":"Mexico","Curaçau":"Curaçao","Nicarágua":"Nicaragua","Panamá":"Panama","Porto Rico":"Puerto Rico","São Cristóvão e Nevis":"St Kitts and Nevis","Suriname":"Suriname","Bahamas":"Bahamas","Trinidad e Tobago":"Trinidad and Tobago","Estados Unidos":"United States",
  "Albânia":"Albania","Andorra":"Andorra","Arménia":"Armenia","Áustria":"Austria","Azerbaijão":"Azerbaijan","Bélgica":"Belgium","Bielorrússia":"Belarus","Bósnia e Herzegovina":"Bosnia and Herzegovina","Bulgária":"Bulgaria","Croácia":"Croatia","Chipre":"Cyprus","Chéquia":"Czechia","Dinamarca":"Denmark","Inglaterra":"England","Estónia":"Estonia","Ilhas Faroé":"Faroe Islands","Finlândia":"Finland","França":"France","Geórgia":"Georgia","Alemanha":"Germany","Grécia":"Greece","Hungria":"Hungary","Islândia":"Iceland","Israel":"Israel","Itália":"Italy","Letónia":"Latvia","Liechtenstein":"Liechtenstein","Lituânia":"Lithuania","Luxemburgo":"Luxembourg","Macedónia do Norte":"North Macedonia","Malta":"Malta","Moldávia":"Moldova","Países Baixos":"Netherlands","Irlanda do Norte":"Northern Ireland","Noruega":"Norway","Polónia":"Poland","Portugal":"Portugal","Irlanda":"Republic of Ireland","Roménia":"Romania","Rússia":"Russia","São Marino":"San Marino","Escócia":"Scotland","Eslováquia":"Slovakia","Eslovénia":"Slovenia","Espanha":"Spain","Suécia":"Sweden","Suíça":"Switzerland","Turquia":"Türkiye","Ucrânia":"Ukraine","País de Gales":"Wales","Sérvia":"Serbia",
  "Austrália":"Australia","Fiji":"Fiji","Nova Zelândia":"New Zealand","Taiti":"Tahiti","Vanuatu":"Vanuatu","Argentina":"Argentina","Bolívia":"Bolivia","Brasil":"Brazil","Chile":"Chile","Colômbia":"Colombia","Equador":"Ecuador","Paraguai":"Paraguay","Peru":"Peru","Uruguai":"Uruguay","Venezuela":"Venezuela","Palestina":"Palestine",
  "Mongólia":"Mongolia","Eritreia":"Eritrea","Montserrat":"Montserrat","Turcas e Caicos":"Turks and Caicos","Nova Caledónia":"New Caledonia","República Dominicana":"Dominican Republic","Gibraltar":"Gibraltar","Kosovo":"Kosovo","Guiana Francesa":"French Guiana","Guadalupe":"Guadeloupe","Martinica":"Martinique","Comores":"Comoros","Timor-Leste":"Timor-Leste","Sudão do Sul":"South Sudan","Montenegro":"Montenegro"};

function t(s, v) {
  let r = LANG === "pt" ? s : (EN[s] != null ? EN[s] : s);
  if (v) r = r.replace(/\{(\w+)\}/g, (m, k) => (v[k] != null ? v[k] : m));
  return r;
}
const natT = name => LANG === "pt" || !name ? name : (NAT_EN[name] || name.replace(/^Nação #/, "Nation #"));

// Static page: translate exact text nodes and placeholder/title attributes once, before the app renders.
(function translateStatic() {
  if (LANG !== "pt") {
    const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const nodes = []; while (w.nextNode()) nodes.push(w.currentNode);
    nodes.forEach(n => { const s = n.nodeValue.trim(); if (s && EN[s] != null) n.nodeValue = n.nodeValue.replace(s, EN[s]); });
    document.querySelectorAll("[placeholder],[title]").forEach(el => {
      ["placeholder", "title"].forEach(a => { const v = el.getAttribute(a); if (v && EN[v] != null) el.setAttribute(a, EN[v]); });
    });
  }
  document.querySelectorAll("#langSw button").forEach(b => {
    b.classList.toggle("on", b.dataset.l === LANG);
    b.onclick = () => { if (b.dataset.l === LANG) return; try { localStorage.setItem("fm27lang", b.dataset.l); } catch (e) {} location.reload(); };
  });
})();
