function app(D){

// ---------- labels ----------
const L_PT = {corners:"Cantos",crossing:"Cruzamentos",dribbling:"Finta",finishing:"Finalização",first_touch:"Primeiro Toque",free_kick_taking:"Livres",heading:"Cabeceamento",long_shots:"Remates de Longe",long_throws:"Lançamentos Longos",marking:"Marcação",passing:"Passe",penalty_taking:"Marcação de Penáltis",tackling:"Desarme",technique:"Técnica",
aggression:"Agressividade",anticipation:"Antecipação",bravery:"Bravura",composure:"Compostura",concentration:"Concentração",decisions:"Decisões",determination:"Determinação",flair:"Imprevisibilidade",leadership:"Liderança",off_the_ball:"Sem Bola",positioning:"Posicionamento",teamwork:"Trabalho de Equipa",vision:"Visão de Jogo",work_rate:"Índice de Trabalho",
acceleration:"Aceleração",agility:"Agilidade",balance:"Equilíbrio",jumping_reach:"Impulsão",natural_fitness:"Aptidão Física",pace:"Velocidade",stamina:"Resistência",strength:"Força",
aerial_reach:"Alcance Aéreo",command_of_area:"Domínio da Área",communication:"Comunicação",eccentricity:"Excentricidade",handling:"Jogo de Mãos",kicking:"Pontapé",one_on_ones:"Um para Um",punching:"Tendência para Socar",reflexes:"Reflexos",rushing_out:"Tendência para Sair",throwing:"Lançamento",
consistency:"Consistência",dirtiness:"Jogo Sujo",important_matches:"Jogos Importantes",injury_proneness:"Propensão a Lesões",versatility:"Versatilidade",
adaptability:"Adaptabilidade",ambition:"Ambição",loyalty:"Lealdade",pressure:"Pressão",professionalism:"Profissionalismo",sportsmanship:"Desportivismo",temperament:"Temperamento",controversy:"Controvérsia"};
const POS_PT = {gk:"GR",dl:"DE",dc:"DC",dr:"DD",wbl:"ALE",dm:"MDC",wbr:"ALD",ml:"ME",mc:"MC",mr:"MD",aml:"MOE",amc:"MOC",amr:"MOD",stc:"PL"};
const POSXY = {gk:[50,92],dl:[14,76],dc:[50,78],dr:[86,76],wbl:[12,62],dm:[50,64],wbr:[88,62],ml:[14,47],mc:[50,48],mr:[86,47],aml:[16,30],amc:[50,31],amr:[84,30],stc:[50,13]};
const STATUS_PT = {star_player:"Jogador estrela",important_player:"Jogador importante",regular_starter:"Titular regular",squad_player:"Jogador do plantel",fringe_player:"Jogador marginal",impact_sub:"Suplente de impacto",backup:"Suplente",breakthrough_prospect:"Promessa a despontar",future_prospect:"Promessa futura",youngster:"Jovem",surplus_to_requirements:"Excedentário",first_choice_goalkeeper:"GR titular",cup_goalkeeper:"GR das taças",domestic_cup_goalkeeper:"GR das taças nacionais",emergency_backup:"Reserva de emergência",goalkeeper_emergency_backup:"GR de emergência",b_team_regular:"Titular da equipa B",unknown:"—"};
const SLOT_PT = {0:"Principal",1:"Sub-21 / Reservas",2:"Sub-18"};
const L = LANG==="pt" ? L_PT : ATTR_EN, POSPT = LANG==="pt" ? POS_PT : POS_EN, STATUS = LANG==="pt" ? STATUS_PT : STATUS_EN, SLOT = LANG==="pt" ? SLOT_PT : SLOT_EN;
const GBP2EUR = 1.16;

// ---------- data prep ----------
const A = D.A, ai = {}; A.forEach((k,i)=>ai[k]=i);
const POS = D.POS;
const fold = s => (s||"").normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase();
const clubs = D.clubs; // [name, short, nation, rep, women]
const clubFold = clubs.map(c=>fold(c[0]+" "+c[1]));
const P = D.players.map((r,idx)=>({idx,name:r[0],age:r[1],birth:r[2],nat:r[3],nat2:r[4],club:r[5],slot:r[6],h:r[7],ca:r[8],pa:r[9],npos:r[10],apos:r[11],lf:r[12],rf:r[13],val:r[14],wage:r[15],cend:r[16],status:r[17],loan:r[18],loanFrom:r[19],rep:r[20],at:r[21],per:r[22],pos:r[23],traits:r[24],uid:r[25],rc:r[26],rcf:r[27],rcd:r[28],f:fold(r[0])}));
P.forEach(p=>{p.women = p.club!=null ? !!clubs[p.club][4] : false;});
const byClub = {}; P.forEach(p=>{ if(p.club!=null){(byClub[p.club]=byClub[p.club]||[]).push(p);} });
const loanedOut = {}; P.forEach(p=>{ if(p.loan && p.loanFrom!=null){(loanedOut[p.loanFrom]=loanedOut[p.loanFrom]||[]).push(p);} });
const natName = n => n==null? "—" : (natT(D.nations[n])||"—");
const clubName = c => c==null? t("Sem clube") : clubs[c][0];
const posStr = p => (p.npos||"").split(";").filter(Boolean).map(x=>POSPT[x.toLowerCase()]||x).join(", ") || "—";
const eur = v => v==null?"—": (v>=1e6? (v/1e6).toFixed(v>=1e7?0:1)+"M €" : v>=1e3? Math.round(v/1e3)+"K €" : v+" €");
const valEUR = p => p.val==null?null:p.val*GBP2EUR;
const wageEUR = p => p.wage==null?null:p.wage*52/12*GBP2EUR;
// ---------- preço pedido estimado ----------
const GD = D.meta.game_date ? new Date(D.meta.game_date) : null;
const yearsLeft = p => (!p.cend||!GD) ? null : (new Date(p.cend)-GD)/31557600000;
const STM={star_player:1.3,important_player:1.2,first_choice_goalkeeper:1.2,regular_starter:1.1,breakthrough_prospect:1.1,future_prospect:1.05,youngster:1.05,squad_player:0.95,impact_sub:0.95,backup:0.85,cup_goalkeeper:0.85,domestic_cup_goalkeeper:0.85,fringe_player:0.75,emergency_backup:0.7,goalkeeper_emergency_backup:0.7,surplus_to_requirements:0.6};
const BUYER_NAT = D.meta.managed!=null && clubs[D.meta.managed] ? clubs[D.meta.managed][2] : null;
function clauseEUR(p){ let c=p.rc||null; const sell=p.club!=null?clubs[p.club][2]:null;
  if(BUYER_NAT!=null && sell!=null){ if(BUYER_NAT!==sell && p.rcf) c=c?Math.min(c,p.rcf):p.rcf; if(BUYER_NAT===sell && p.rcd) c=c?Math.min(c,p.rcd):p.rcd; }
  return c?c*GBP2EUR:null; }
function priceEst(p){
  if(p._pe) return p._pe;
  const clause=clauseEUR(p), v=valEUR(p), yl=yearsLeft(p);
  if(p.club==null) return p._pe={free:true,mid:0,lo:0,hi:0,clause:null,yl};
  if(v==null) return p._pe={mid:clause,lo:clause,hi:clause,clause,yl,onlyClause:!!clause};
  let m = yl==null?1.2 : yl<0.5?0.5 : yl<1?0.8 : yl<2?1.0 : yl<3?1.2 : 1.3;
  m *= STM[p.status]||1; if(p.age<=23) m*=1.1; else if(p.age>=31) m*=0.85;
  m = Math.min(m, 1.7);
  let mid=v*m, lo=mid*0.85, hi=mid*1.15, capped=false;
  if(clause && hi>clause){ hi=clause; capped=true; if(lo>clause) lo=clause; if(mid>clause) mid=clause; }
  return p._pe={mid,lo,hi,clause,capped,yl,pre: yl!=null && yl<0.5};
}
const eurShort = v => v==null?"—": v>=1e6? (v/1e6).toFixed(v>=1e7?0:1)+"M" : v>=1e3? Math.round(v/1e3)+"K" : Math.round(v)+"";
function priceTxt(p){ const e=priceEst(p); if(e.free) return t("Grátis"); if(e.mid==null) return "—"; if(e.onlyClause) return "≤ "+eurShort(e.clause)+" €";
  return (eurShort(e.lo)===eurShort(e.hi)? eurShort(e.mid) : eurShort(e.lo)+"–"+eurShort(e.hi))+" €"+(e.capped?" ⚑":""); }
function priceTip(p){ const e=priceEst(p); if(e.free) return t("Sem clube: não há transferência, só salário e prémio de assinatura.");
  return t("Estimativa a partir do valor de mercado ({v}), anos de contrato ({y}), estatuto e idade.",{v:eur(valEUR(p)),y:e.yl==null?"?":e.yl.toFixed(1)})+" "
    +(e.clause? t("Cláusula de rescisão: {c}",{c:eur(e.clause)})+(e.capped?" "+t("(o preço não passa disto)."):".") : t("Sem cláusula de rescisão conhecida."))
    +(e.pre?" "+t("Contrato a acabar: pode haver pré-contrato a custo zero."):""); }
const col = v => v==null?"#777": v>=18?"#39e07a": v>=15?"#7bd36b": v>=11?"#f2c14e": v>=6?"#e8e3ee":"#8a8f98";
const esc = s => String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));

document.getElementById('meta').textContent = t("data do jogo {d} · {p} jogadores · {c} clubes",{d:(D.meta.game_date||"?").split("-").reverse().join("/"),p:P.length.toLocaleString(NUMLOC),c:clubs.length.toLocaleString(NUMLOC)});

// ---------- filters setup ----------
const fPos = document.getElementById('fPos');
fPos.innerHTML = `<option value="">${t("Todas")}</option>` + POS.map(k=>`<option value="${k}">${POSPT[k]}</option>`).join("");
const natOpts = Object.entries(D.nations).map(([k,v])=>[k,natT(v)]).sort((a,b)=>a[1].localeCompare(b[1],NUMLOC)).map(([k,v])=>`<option value="${k}">${esc(v)}</option>`).join("");
document.getElementById('fNat').innerHTML = `<option value="">${t("Todas")}</option>`+natOpts;
document.getElementById('cNat').innerHTML = `<option value="">${t("Todos")}</option>`+natOpts;

// ---------- players table ----------
const COLS = [
 {k:"name",t:t("Nome"),v:p=>p.name},
 {k:"age",t:t("Idade"),n:1,v:p=>p.age},
 {k:"pos",t:t("Posição"),v:p=>posStr(p)},
 {k:"club",t:t("Clube"),v:p=>clubName(p.club)},
 {k:"nat",t:t("Nacionalidade"),v:p=>natName(p.nat)},
 {k:"ca",t:"CA",n:1,v:p=>p.ca,sec:1},
 {k:"pa",t:"PA",n:1,v:p=>p.pa,sec:1},
 {k:"val",t:t("Valor"),n:1,v:p=>valEUR(p),f:p=>eur(valEUR(p))},
 {k:"price",t:t("Preço est."),n:1,v:p=>priceEst(p).mid,f:p=>priceTxt(p)},
 {k:"wage",t:t("Salário/mês"),n:1,v:p=>wageEUR(p),f:p=>eur(wageEUR(p))},
 {k:"cend",t:t("Fim contrato"),v:p=>p.cend||""},
];
let sortK="ca", sortDir=-1, lastRows=[];
function renderHead(){
  document.getElementById('headP').innerHTML = "<tr>"+COLS.map(c=>`<th data-k="${c.k}" class="${c.n?'num':''} ${c.sec?'secret':''} ${c.k===sortK?'sorted':''}">${c.t}${c.k===sortK?(sortDir<0?" ▼":" ▲"):""}</th>`).join("")+"</tr>";
}
document.getElementById('headP').addEventListener('click',e=>{
  const k=e.target.closest('th')?.dataset.k; if(!k)return;
  if(sortK===k) sortDir*=-1; else {sortK=k; sortDir=COLS.find(c=>c.k===k).n?-1:1;}
  runP();
});
const $ = id=>document.getElementById(id);
const num = id=>{const v=$(id).value; return v===""?null:+v;};
function runP(){
  const q=fold($('fName').value.trim()), pos=$('fPos').value, amin=num('fAgeMin'), amax=num('fAgeMax'), ca=num('fCa'), pa=num('fPa'), nat=$('fNat').value, cq=fold($('fClub').value.trim()), vmax=num('fVal'), free=$('fFree').checked;
  const pi = pos? POS.indexOf(pos):-1;
  const rows=[];
  for(const p of P){
    if(q && !p.f.includes(q)) continue;
    if(pi>=0 && !(p.pos[pi]>=15)) continue;
    if(amin!=null && !(p.age>=amin)) continue;
    if(amax!=null && !(p.age<=amax)) continue;
    if(ca!=null && !(p.ca>=ca)) continue;
    if(pa!=null && !(p.pa>=pa)) continue;
    if(nat!=="" && p.nat!=+nat && p.nat2!=+nat) continue;
    if(free && p.club!=null) continue;
    if(cq && (p.club==null || !clubFold[p.club].includes(cq))) continue;
    if(vmax!=null && !(valEUR(p)!=null && valEUR(p)<=vmax*1e6)) continue;
    rows.push(p);
  }
  const c=COLS.find(c=>c.k===sortK);
  rows.sort((a,b)=>{let x=c.v(a),y=c.v(b); if(x==null)return 1; if(y==null)return -1; return (c.n? x-y : String(x).localeCompare(String(y),'pt'))*sortDir;});
  lastRows=rows;
  renderHead();
  const shown=rows.slice(0,300);
  $('countP').textContent = t("{n} jogadores encontrados",{n:rows.length.toLocaleString(NUMLOC)}) + (rows.length>300?t(" · a mostrar os primeiros 300 (afina os filtros ou ordena por outra coluna)"):"");
  $('bodyP').innerHTML = shown.map(p=>"<tr data-i='"+p.idx+"'>"+COLS.map(c=>{const v=c.f?c.f(p):c.v(p);return `<td class="${c.n?'num':''} ${c.sec?'secret':''} ${c.k==='ca'?'ca':''}">${c.k==='club'&&p.loan?esc(v)+' <span class="pill">'+t("empréstimo")+'</span>':esc(v==null?'—':v)}</td>`}).join("")+"</tr>").join("");
}
let tP; ["fName","fClub","fAgeMin","fAgeMax","fCa","fPa","fVal"].forEach(id=>$(id).addEventListener('input',()=>{clearTimeout(tP);tP=setTimeout(runP,180);}));
["fPos","fNat","fFree"].forEach(id=>$(id).addEventListener('change',runP));
$('btnReset').onclick=()=>{["fName","fClub","fAgeMin","fAgeMax","fCa","fPa","fVal"].forEach(id=>$(id).value="");$('fPos').value="";$('fNat').value="";$('fFree').checked=false;runP();};
$('bodyP').addEventListener('click',e=>{const tr=e.target.closest('tr');if(tr)openPlayer(+tr.dataset.i);});
$('btnCsv').onclick=()=>{
  const head=[...["Nome","Idade","Posição","Clube","Nacionalidade"].map(x=>t(x)),"CA","PA",t("Valor (€)"),t("Salário/mês (€)"),t("Fim contrato"),...A.map(k=>L[k]||k)];
  const lines=[head.join(";")].concat(lastRows.map(p=>[p.name,p.age,posStr(p),clubName(p.club),natName(p.nat),p.ca,p.pa,Math.round(valEUR(p)||0),Math.round(wageEUR(p)||0),p.cend,...p.at].map(x=>String(x==null?"":x).replace(/;/g,",")).join(";")));
  const blob=new Blob(["﻿"+lines.join("\n")],{type:"text/csv;charset=utf-8"});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=LANG==="pt"?"jogadores_fm27.csv":"fm27_players.csv";a.click();
};

// ---------- player card ----------
function attrList(keys,p){return keys.map(k=>{const v=p.at[ai[k]];return `<div class="attr"><span>${L[k]||k}</span><span style="color:${col(v)}">${v??"—"}</span></div>`}).join("");}
function openPlayer(i){
  const p=P[i], isGK = p.pos[0]>=15;
  const dots=POS.map((k,j)=>{const v=p.pos[j]; if(!(v>=5))return ""; const [x,y]=POSXY[k]; const c=v>=18?"#39e07a":v>=15?"#a6e06b":v>=10?"#f2c14e":"#e8874a"; return `<div class="dot" style="left:${x}%;top:${y}%;background:${c}" title="${POSPT[k]}: ${v}/20">${POSPT[k]}</div>`}).join("");
  const feet=v=>t(v>=19?"Muito Forte":v>=15?"Forte":v>=12?"Bastante Forte":v>=9?"Razoável":v>=6?"Fraco":"Muito Fraco");
  const nat = natName(p.nat)+(p.nat2!=null?" / "+natName(p.nat2):"");
  const clubLink = p.club!=null?`<a class="link" data-club="${p.club}">${esc(clubName(p.club))}</a>`:t("Sem clube");
  const loanTxt = p.loan&&p.loanFrom!=null?` (${t("emprestado por")} <a class="link" data-club="${p.loanFrom}">${esc(clubName(p.loanFrom))}</a>)`:"";
  $('card').innerHTML = `
  <div class="top"><div><h2>${esc(p.name)}</h2><div class="sub">${posStr(p)} · ${t("{n} anos",{n:p.age})} (${p.birth||"?"}) · ${esc(nat)}</div><div class="sub">${clubLink}${loanTxt}${p.slot!=null&&p.club!=null?" · "+SLOT[p.slot]:""}</div></div>
  <button class="btn close" id="closeBtn">${t("Fechar ✕")}</button></div>
  <div class="facts">
    <div class="secret"><b>CA</b>${p.ca??"—"}<div class="bar" style="width:140px"><i style="width:${(p.ca||0)/2}%"></i></div></div>
    <div class="secret"><b>PA</b>${p.pa??"—"}<div class="bar" style="width:140px"><i style="width:${(p.pa||0)/2}%"></i></div></div>
    <div><b>${t("Valor de mercado")}</b>≈ ${eur(valEUR(p))}</div>
    <div title="${esc(priceTip(p))}"><b>${t("Preço pedido (estimativa)")}</b>${priceTxt(p)}</div>
    ${clauseEUR(p)?`<div><b>${t("Cláusula de rescisão")}</b>${eur(clauseEUR(p))}</div>`:""}
    <div><b>${t("Salário")}</b>≈ ${eur(wageEUR(p))} ${t("p/m")}</div>
    <div><b>${t("Contrato até")}</b>${p.cend||"—"}</div>
    <div><b>${t("Estatuto")}</b>${STATUS[p.status]||(p.status||"—").replace(/_/g," ")}</div>
    <div><b>${t("Altura")}</b>${p.h?p.h+" cm":"—"}</div>
    <div><b>${t("Pé esq.")}</b>${feet(p.lf)} (${p.lf})</div>
    <div><b>${t("Pé dir.")}</b>${feet(p.rf)} (${p.rf})</div>
  </div>
  <div class="grid ${isGK?'gk':''}">
    <div class="col"><h3>${t("Posições")}</h3><div class="pitch">${dots}</div><div class="note">${t("Verde = natural, amarelo = razoável, laranja = fraco. Passa o rato para ver o valor (1–20).")}</div></div>
    ${isGK?`<div class="col"><h3>${t("Guarda-Redes")}</h3>${attrList(D.GK,p)}</div>`:""}
    <div class="col"><h3>${t("Técnicos")}</h3>${attrList(D.TECH,p)}</div>
    <div class="col"><h3>${t("Mentais")}</h3>${attrList(D.MENT,p)}</div>
    <div class="col"><h3>${t("Físicos")}</h3>${attrList(D.PHYS,p)}</div>
  </div>
  <div class="extra">
    <div class="col secret"><h3>${t("Atributos ocultos")}</h3>${attrList(D.HID,p)}<div class="note" style="margin-top:6px">${t("Na Propensão a Lesões e no Jogo Sujo, mais baixo é melhor.")}</div></div>
    <div class="col secret"><h3>${t("Personalidade (oculta)")}</h3>${D.PERS.map((k,j)=>`<div class="attr"><span>${L[k]}</span><span style="color:${col(p.per[j])}">${p.per[j]??"—"}</span></div>`).join("")}</div>
    <div class="col"><h3>${t("Características")}</h3>${p.traits.length?p.traits.map(tr=>`<span class="pill">${esc(tr.replace(/_/g," "))}</span>`).join(" "):'<span class="note">'+t("Nenhuma identificada")+'</span>'}
    ${!isGK && p.pos[0]<15 ? "" : ""}<div class="note" style="margin-top:10px">${t("Valores em € convertidos de libras (×{r}), por isso são aproximados.",{r:GBP2EUR})}</div></div>
  </div>`;
  $('ov').classList.add('on'); $('ov').scrollTop=0;
  $('closeBtn').onclick=()=>$('ov').classList.remove('on');
}
$('ov').addEventListener('click',e=>{ if(e.target.id==='ov') $('ov').classList.remove('on'); const c=e.target.closest('[data-club]'); if(c){$('ov').classList.remove('on'); showTab('C'); openClub(+c.dataset.club);} });
document.addEventListener('keydown',e=>{if(e.key==='Escape')$('ov').classList.remove('on');});

// ---------- ordenação genérica de tabelas (clicar no título; 2.º clique inverte) ----------
function enableSort(table){
  const thead=table.tHead; if(!thead || thead.dataset.sortable) return; thead.dataset.sortable=1;
  thead.addEventListener('click',e=>{
    const th=e.target.closest('th'); if(!th) return;
    const idx=[...th.parentNode.children].indexOf(th);
    const dir = th.dataset.dir==="desc" ? "asc" : (th.dataset.dir==="asc" ? "desc" : (th.classList.contains('num')?"desc":"asc"));
    [...thead.querySelectorAll('th')].forEach(h=>{ h.dataset.dir=""; h.classList.remove('sorted'); h.textContent=h.textContent.replace(/ [▼▲]$/,""); });
    th.dataset.dir=dir; th.classList.add('sorted'); th.textContent += dir==="desc"?" ▼":" ▲";
    const tb=table.tBodies[0], rows=[...tb.rows];
    const val=r=>{ const c=r.cells[idx]; if(!c) return null; const v=c.dataset.v!=null?c.dataset.v:c.innerText.trim(); const n=parseFloat(v); return (c.dataset.v!=null||/^-?[\d.]+$/.test(v)) && !isNaN(n) ? n : (v==="—"||v===""?null:v.toLowerCase()); };
    rows.sort((a,b)=>{ const x=val(a), y=val(b); if(x==null) return 1; if(y==null) return -1; const c = typeof x==="number"&&typeof y==="number" ? x-y : String(x).localeCompare(String(y),'pt'); return dir==="asc"?c:-c; });
    rows.forEach(r=>tb.appendChild(r));
  });
  [...thead.querySelectorAll('th')].forEach(h=>{ h.style.cursor="pointer"; h.title = h.title || t("Clica para ordenar (2.º clique inverte)"); });
}

// ---------- clubs ----------
const clubStats = clubs.map((c,i)=>{const L=(byClub[i]||[]).filter(p=>!p.loan||true); const top=L.map(p=>p.ca||0).sort((a,b)=>b-a).slice(0,11); return {n:L.length, avg: top.length? Math.round(top.reduce((s,x)=>s+x,0)/top.length):0};});
function runC(){
  const q=fold($('cName').value.trim()), nat=$('cNat').value;
  const rows=[]; clubs.forEach((c,i)=>{ if(q&&!clubFold[i].includes(q))return; if(nat!==""&&c[2]!=+nat)return; if(!clubStats[i].n)return; rows.push(i);});
  rows.sort((a,b)=>clubs[b][3]-clubs[a][3]);
  $('countC').textContent=t("{n} clubes",{n:rows.length.toLocaleString(NUMLOC)})+(rows.length>300?t(" · a mostrar os 300 com mais reputação"):"");
  $('bodyC').innerHTML=rows.slice(0,300).map(i=>`<tr data-c="${i}"><td>${esc(clubs[i][0])}</td><td>${esc(natName(clubs[i][2]))}</td><td class="num" data-v="${clubs[i][3]}">${clubs[i][3].toLocaleString(NUMLOC)}</td><td class="num">${clubStats[i].n}</td><td class="num secret">${clubStats[i].avg}</td></tr>`).join("");
}
let tC; $('cName').addEventListener('input',()=>{clearTimeout(tC);tC=setTimeout(runC,180);}); $('cNat').addEventListener('change',runC);
$('bodyC').addEventListener('click',e=>{const tr=e.target.closest('tr');if(tr)openClub(+tr.dataset.c);});
enableSort($('bodyC').closest('table'));
function squadTable(list){
  list=list.slice().sort((a,b)=>(b.ca||0)-(a.ca||0));
  return `<table><thead><tr><th>${t("Nome")}</th><th class="num">${t("Idade")}</th><th>${t("Posição")}</th><th>${t("Nacionalidade")}</th><th class="num secret">CA</th><th class="num secret">PA</th><th class="num">${t("Valor")}</th><th class="num" title="${t("Preço pedido estimado (passa o rato por cima de cada valor)")}">${t("Preço est.")}</th><th class="num">${t("Salário/mês")}</th><th>${t("Fim contrato")}</th><th>${t("Estatuto")}</th></tr></thead><tbody>`+
  list.map(p=>`<tr data-i="${p.idx}"><td>${esc(p.name)}${p.loan&&p.loanFrom!=null&&p.club!=null?' <span class="pill">'+t("emprestado")+'</span>':''}</td><td class="num">${p.age}</td><td>${posStr(p)}</td><td>${esc(natName(p.nat))}</td><td class="num ca secret">${p.ca??"—"}</td><td class="num secret">${p.pa??"—"}</td><td class="num" data-v="${valEUR(p)??""}">${eur(valEUR(p))}</td><td class="num" data-v="${priceEst(p).mid??""}" title="${esc(priceTip(p))}">${priceTxt(p)}</td><td class="num" data-v="${wageEUR(p)??""}">${eur(wageEUR(p))}</td><td>${p.cend||"—"}</td><td>${STATUS[p.status]||(p.status||"").replace(/_/g," ")}</td></tr>`).join("")+`</tbody></table>`;
}
function openClub(i){
  const c=clubs[i], list=byClub[i]||[];
  const groups={}; list.forEach(p=>{const s=p.slot??0;(groups[s]=groups[s]||[]).push(p);});
  let html=`<div class="clubhead"><button class="btn" id="backC">${t("← Voltar")}</button><h2>${esc(c[0])}</h2><span class="note">${esc(natName(c[2]))} · ${t("reputação")} ${c[3].toLocaleString(NUMLOC)} · ${t("{n} jogadores",{n:list.length})}</span></div>`;
  Object.keys(groups).sort().forEach(s=>{html+=`<div class="section-title">${SLOT[s]||t("Equipa {n}",{n:s})} (${groups[s].length})</div>`+squadTable(groups[s]);});
  const out=loanedOut[i]||[];
  if(out.length) html+=`<div class="section-title">${t("Emprestados a outros clubes ({n})",{n:out.length})}</div>`+squadTable(out);
  $('clubList').hidden=true; const v=$('clubView'); v.hidden=false; v.innerHTML=html; window.scrollTo(0,0);
  $('backC').onclick=()=>{v.hidden=true;$('clubList').hidden=false;};
  v.querySelectorAll('tbody').forEach(tb=>tb.addEventListener('click',e=>{const tr=e.target.closest('tr');if(tr)openPlayer(+tr.dataset.i);}));
  v.querySelectorAll('table').forEach(enableSort);
}

/*@include js/tactic.js*/
// ---------- tabs ----------
function showTab(tab){ ['P','C','T'].forEach(k=>{ $('tab'+k).classList.toggle('on',tab===k); $('view'+k).hidden=tab!==k; }); try{localStorage.setItem('fm27tab',tab)}catch(e){} }
$('tabP').onclick=()=>showTab('P'); $('tabC').onclick=()=>{showTab('C'); $('clubView').hidden=true; $('clubList').hidden=false;}; $('tabT').onclick=()=>showTab('T');
// modo realista
const rm=$('realMode'); try{ rm.checked = localStorage.getItem('fm27real')==='1'; }catch(e){}
const applyReal=()=>{ document.body.classList.toggle('real',rm.checked); try{localStorage.setItem('fm27real',rm.checked?'1':'0')}catch(e){} if(rm.checked && (sortK==='ca'||sortK==='pa')){ sortK='val'; sortDir=-1; runP(); } if(typeof renderT==='function') renderT(); };
rm.onchange=applyReal; applyReal();

$('loading').remove(); let t0='P'; try{ t0=localStorage.getItem('fm27tab')||'P'; }catch(e){} showTab(['P','C','T'].includes(t0)?t0:'P'); runP(); runC();
}
