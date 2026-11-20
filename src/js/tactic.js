// ================= TÁTICA: equipa, formação, funções, encaixe e reforços =================
const ROLES = {
  gr:     {n:"Guarda-redes", w:{reflexes:3,one_on_ones:2,handling:2,positioning:2,aerial_reach:2,command_of_area:1.5,communication:1,kicking:1.5,passing:1,composure:1,agility:1.5,concentration:1,decisions:1}},
  gr_c:   {n:"Guarda-redes construtor", w:{reflexes:2.5,one_on_ones:2,handling:1.5,positioning:1.5,rushing_out:1.5,kicking:2.5,passing:2,first_touch:1,composure:2,decisions:1.5,agility:1}},
  dc:     {n:"Central", w:{marking:2,tackling:2,positioning:2.5,heading:2,jumping_reach:2,strength:1.5,anticipation:1.5,concentration:1.5,bravery:1,composure:1,pace:1.5,acceleration:1,passing:1}},
  dc_c:   {n:"Central construtor", w:{marking:1.5,tackling:2,positioning:2.5,heading:1.5,jumping_reach:1.5,strength:1,anticipation:1.5,concentration:1.5,composure:1.5,passing:2,first_touch:1,vision:1,pace:1.5,acceleration:1}},
  lat:    {n:"Lateral ofensivo", w:{pace:2.5,acceleration:2,stamina:2,work_rate:2,crossing:1.5,dribbling:1,tackling:1.5,marking:1,positioning:1,teamwork:1,anticipation:1,off_the_ball:1,agility:1}},
  lat_d:  {n:"Lateral defensivo", w:{tackling:2,marking:2,positioning:2,anticipation:1.5,concentration:1,pace:1.5,acceleration:1,stamina:1,strength:1,heading:1,teamwork:1}},
  ala:    {n:"Ala", w:{pace:2.5,acceleration:2,stamina:2.5,work_rate:2,crossing:2,dribbling:1.5,tackling:1,positioning:0.5,teamwork:1,off_the_ball:1.5,agility:1,first_touch:1}},
  lat_c:  {n:"Lateral construtor", w:{passing:2,crossing:2,vision:1.5,stamina:2,work_rate:1.5,pace:2,acceleration:1.5,first_touch:1,technique:1,decisions:1,tackling:1,positioning:1}},
  chm:    {n:"Médio de corredor", w:{off_the_ball:2,stamina:2,work_rate:2,pace:1.5,acceleration:1.5,passing:1.5,dribbling:1,first_touch:1,decisions:1,anticipation:1,tackling:1,teamwork:1}},
  mdc:    {n:"Médio defensivo (proteção)", w:{tackling:2,positioning:2.5,anticipation:2,concentration:1.5,marking:1.5,teamwork:1.5,work_rate:1.5,passing:1.5,decisions:1.5,composure:1,strength:1,stamina:1,pace:1,acceleration:1}},
  b2b:    {n:"Box-to-box", w:{stamina:2,work_rate:2,passing:1.5,tackling:1.5,off_the_ball:1.5,decisions:1.5,anticipation:1.5,teamwork:1,first_touch:1,long_shots:0.5,pace:1.5,acceleration:1.5,strength:0.5}},
  org:    {n:"Médio organizador", w:{passing:2.5,vision:2.5,first_touch:1.5,technique:1.5,decisions:2,composure:1.5,anticipation:1,teamwork:1,positioning:1,acceleration:1,pace:0.5}},
  mo:     {n:"Médio ofensivo", w:{passing:2,vision:2,technique:2,first_touch:1.5,decisions:1.5,composure:1.5,off_the_ball:1.5,dribbling:1,flair:1,finishing:1,long_shots:1,acceleration:1.5,agility:1}},
  ext_in: {n:"Extremo invertido", w:{pace:2.5,acceleration:2.5,dribbling:2,finishing:2,off_the_ball:1.5,technique:1.5,first_touch:1,long_shots:1,agility:1.5,composure:1,flair:1,work_rate:1}},
  ext:    {n:"Extremo (cruzador)", w:{pace:2.5,acceleration:2.5,dribbling:2,crossing:2,off_the_ball:1.5,technique:1.5,first_touch:1,finishing:1,agility:1.5,flair:1,work_rate:1}},
  pl:     {n:"Avançado de rutura", w:{finishing:2.5,off_the_ball:2,acceleration:2,composure:2,pace:2,first_touch:1,anticipation:1.5,dribbling:1,heading:1,strength:1,jumping_reach:1,technique:1}},
  pl_ref: {n:"Ponta de lança de referência", w:{heading:2.5,jumping_reach:2,strength:2.5,finishing:2.5,composure:1.5,off_the_ball:1.5,first_touch:1,bravery:1,balance:1,anticipation:1,pace:1,acceleration:1}},
};
const roleName = k => t(ROLES[k].n);
const slotLabel = s => t(s.label);
const GROUP_ROLES = {GK:["gr","gr_c"], CB:["dc","dc_c"], FB:["lat","lat_d","lat_c","ala"], WB:["ala","lat","lat_c"], DM:["mdc","b2b","org","chm"], CM:["b2b","org","chm","mdc","mo"], AM:["mo","org","ext_in","pl"], W:["ext_in","ext","mo"], ST:["pl","pl_ref"]};
const S = (id,label,x,y,pos,g,role)=>({id,label,x,y,pos,g,role});
const BACK4 = [S("gk","GR",50,91,["gk"],"GK","gr"),S("dl","DE",12,72,["dl","wbl"],"FB","lat"),S("dcl","DC",36,79,["dc"],"CB","dc"),S("dcr","DC",64,79,["dc"],"CB","dc"),S("dr","DD",88,72,["dr","wbr"],"FB","lat")];
const FORMATIONS = {
  "4-2-3-1": [...BACK4, S("dml","MDC",36,58,["dm","mc"],"DM","mdc"),S("dmr","MC",64,58,["mc","dm"],"CM","org"),S("aml","MOE",13,32,["aml","ml"],"W","ext_in"),S("amc","MOC",50,37,["amc"],"AM","mo"),S("amr","MOD",87,32,["amr","mr"],"W","ext_in"),S("st","PL",50,11,["stc"],"ST","pl")],
  "4-3-3":   [...BACK4, S("dm","MDC",50,62,["dm"],"DM","mdc"),S("mcl","MC",31,47,["mc"],"CM","b2b"),S("mcr","MC",69,47,["mc","amc"],"CM","org"),S("aml","EE",13,25,["aml","ml"],"W","ext_in"),S("amr","ED",87,25,["amr","mr"],"W","ext_in"),S("st","PL",50,11,["stc"],"ST","pl")],
  "4-4-2":   [...BACK4, S("ml","ME",11,47,["ml","aml"],"W","ext"),S("mcl","MC",38,52,["mc"],"CM","b2b"),S("mcr","MC",62,52,["mc"],"CM","org"),S("mr","MD",89,47,["mr","amr"],"W","ext"),S("stl","PL",38,13,["stc"],"ST","pl_ref"),S("str","PL",62,13,["stc"],"ST","pl")],
  "4-2-2-2": [...BACK4, S("dml","MDC",36,58,["dm","mc"],"DM","mdc"),S("dmr","MC",64,58,["mc","dm"],"CM","b2b"),S("amcl","MO",30,33,["amc","aml"],"AM","mo"),S("amcr","MO",70,33,["amc","amr"],"AM","mo"),S("stl","PL",38,12,["stc"],"ST","pl"),S("str","PL",62,12,["stc"],"ST","pl_ref")],
  "3-4-2-1": [S("gk","GR",50,91,["gk"],"GK","gr"),S("dcl","DC",28,78,["dc","dl"],"CB","dc_c"),S("dc","DC",50,81,["dc"],"CB","dc"),S("dcr","DC",72,78,["dc","dr"],"CB","dc_c"),S("wbl","ALE",9,52,["wbl","dl","ml"],"WB","ala"),S("mcl","MC",38,57,["mc","dm"],"DM","mdc"),S("mcr","MC",62,57,["mc","dm"],"CM","b2b"),S("wbr","ALD",91,52,["wbr","dr","mr"],"WB","ala"),S("aml","MO",33,31,["amc","aml"],"AM","mo"),S("amr","MO",67,31,["amc","amr"],"AM","mo"),S("st","PL",50,11,["stc"],"ST","pl")],
};
const PRESETS = {
  lxs: {n:t("LXS 4231 W (meta FM-Arena)"), f:"4-2-3-1",
    roles:{dl:"lat_c",dr:"lat_c",dcl:"dc",dcr:"dc",dml:"chm",dmr:"chm",aml:"ext_in",amr:"ext_in",amc:"mo",st:"pl",gk:"gr"},
    info: LANG!=="pt" ? `<b>LXS 4231 W</b> — one of the best-performing tactics in FM-Arena's tests (patch 27.0.1): 68 pts out of 114, +25 goal difference.<br>
    <b>Player instructions published by the author:</b> everyone — Tackle Harder · Striker — Make More Runs, Trigger Press More Often · Attacking midfielder — Make More Runs, Move Into Channel, Trigger Press More Often · Wingers — Make More Runs, Stay Wider, Cross From Byline, Trigger Press More Often · Central midfielders — Make More Runs, Move Into Channel, Trigger Press More Often · Full-backs — Stay Wider, Shoot Less Often, Cross From Deep.<br>
    <span class="note">The .fmf file is encrypted and can't be read: the roles here are inferred from the published instructions. Load the .fmf in the game and confirm the roles there. The author prefers the inside-forward version, depending on the wingers' preferred foot.</span>` : `<b>LXS 4231 W</b> — uma das táticas com melhores resultados nos testes do FM-Arena (patch 27.0.1): 68 pts em 114, +25 de diferença de golos.<br>
    <b>Instruções individuais publicadas pelo autor:</b> todos — Desarmar com mais força · Avançado — Mais desmarcações, Pressionar mais vezes · Médio ofensivo — Mais desmarcações, Ir para o corredor, Pressionar mais vezes · Extremos — Mais desmarcações, Abrir mais, Cruzar da linha de fundo, Pressionar mais vezes · Médios centro — Mais desmarcações, Ir para o corredor, Pressionar mais vezes · Laterais — Abrir mais, Rematar menos, Cruzar de trás.<br>
    <span class="note">O ficheiro .fmf é encriptado e não dá para o ler: as funções aqui são deduzidas das instruções publicadas. Carrega o .fmf no jogo e confirma as funções lá. O autor prefere a versão com extremos invertidos, dependendo do pé dos extremos.</span>`},
  rec: {n:t("4-2-3-1 recomendado para o plantel"), f:"4-2-3-1",
    roles:{gk:"gr",dl:"lat",dr:"lat",dcl:"dc",dcr:"dc",dml:"mdc",dmr:"org",aml:"ext_in",amr:"ext_in",amc:"mo",st:"pl"},
    info: LANG!=="pt" ? `<b>Recommended 4-2-3-1</b> — your best playmaker at No.10, inside forwards (right-footer on the left, left-footer on the right), a screening midfielder and a playmaker.<br>
    <b>Team instructions to start with:</b> Positive mentality · high press with "Trigger Press More Often" up front · "Tackle Harder" for everyone · wingers with "Make More Runs".` : `<b>4-2-3-1 recomendado</b> — Bruno no 10, extremos invertidos (destro na esquerda, canhoto na direita), um médio de proteção e um organizador.<br>
    <b>Instruções de equipa para começar:</b> mentalidade Positiva · pressão alta com "Pressionar mais vezes" na frente · "Desarmar com mais força" em todos · extremos com "Mais desmarcações".`},
  b433: {n:t("4-3-3 equilibrado"), f:"4-3-3",
    roles:{gk:"gr",dl:"lat",dr:"lat",dcl:"dc",dcr:"dc",dm:"mdc",mcl:"b2b",mcr:"org",aml:"ext_in",amr:"ext_in",st:"pl"},
    info: LANG!=="pt" ? `<b>4-3-3</b> — the safest shape early in FM27: a screening midfielder, a box-to-box and a playmaker, inside forwards and a channel forward.` : `<b>4-3-3</b> — a formação mais segura no arranque do FM27: um médio de proteção, um box-to-box e um organizador, extremos invertidos e avançado de rutura.`},
  t3421: {n:t("3-4-2-1 com alas"), f:"3-4-2-1",
    roles:{gk:"gr",dcl:"dc_c",dc:"dc",dcr:"dc_c",wbl:"ala",wbr:"ala",mcl:"mdc",mcr:"b2b",aml:"mo",amr:"mo",st:"pl"},
    info: LANG!=="pt" ? `<b>3-4-2-1</b> — three centre-backs, wing-backs providing width and two attacking midfielders behind the striker. Good for squads with many centre-backs.` : `<b>3-4-2-1</b> — três centrais, alas a dar a largura e dois médios ofensivos atrás do avançado. Bom para planteis com muitos centrais.`},
};
// ---------- táticas guardadas no save (as que carregaste no jogo) ----------
// Códigos de posição do FM: 0 GR,1 Líbero,2 DD,3 DE,4 DC,5 ALD,6 ALE,7 MDC,8 MD,9 ME,10 MC,11 MOD,12 MOE,13 MOC,14 PL. Bits 20/21 = lado do par.
const PCODE = {0:{k:"gk",l:"GR",y:91,g:"GK",pos:["gk"]},1:{k:"sw",l:"DC",y:85,g:"CB",pos:["dc"]},2:{k:"dr",l:"DD",x:88,y:72,g:"FB",pos:["dr","wbr"]},3:{k:"dl",l:"DE",x:12,y:72,g:"FB",pos:["dl","wbl"]},
  4:{k:"dc",l:"DC",y:79,g:"CB",pos:["dc"]},5:{k:"wbr",l:"ALD",x:90,y:55,g:"WB",pos:["wbr","dr","mr"]},6:{k:"wbl",l:"ALE",x:10,y:55,g:"WB",pos:["wbl","dl","ml"]},7:{k:"dm",l:"MDC",y:63,g:"DM",pos:["dm","mc"]},
  8:{k:"mr",l:"MD",x:89,y:47,g:"W",pos:["mr","amr"]},9:{k:"ml",l:"ME",x:11,y:47,g:"W",pos:["ml","aml"]},10:{k:"mc",l:"MC",y:52,g:"CM",pos:["mc","dm"]},11:{k:"amr",l:"MOD",x:87,y:30,g:"W",pos:["amr","mr"]},
  12:{k:"aml",l:"MOE",x:13,y:30,g:"W",pos:["aml","ml"]},13:{k:"amc",l:"MOC",y:35,g:"AM",pos:["amc"]},14:{k:"st",l:"PL",y:11,g:"ST",pos:["stc"]}};
const DEF_ROLE = {GK:"gr",FB:"lat",WB:"ala",CB:"dc",DM:"mdc",CM:"b2b",AM:"mo",W:"ext_in",ST:"pl"};
const MENT = {very_defensive:"Muito defensiva",defensive:"Defensiva",cautious:"Cautelosa",balanced:"Equilibrada",positive:"Positiva",attacking:"Atacante",very_attacking:"Muito atacante"};
const _seenTac=new Set();
const SAVE_TACTICS = (D.meta.tactics||[]).filter(tc=>{ const sig=tc.name+"|"+JSON.stringify(tc.slots.map(s=>[s[0],s[1]])); if(_seenTac.has(sig)) return false; _seenTac.add(sig); return true; }).map((tc,ti,arr)=>{
  const used={}; const slots=[];
  tc.slots.forEach((s,i)=>{
    const code=(s[0]||[])[0], pc=PCODE[code]; if(!pc) return;
    const side = (s[1] & (1<<20)) ? "l" : (s[1] & (1<<21)) ? "r" : "";
    const same = tc.slots.filter(z=>(z[0]||[])[0]===code).length;
    let x = pc.x!=null ? pc.x : 50;
    if(pc.x==null && same>=2){ x = side==="l" ? (same===3?28:36) : side==="r" ? (same===3?72:64) : 50; if(code===14||code===13) x = side==="l"?36:side==="r"?64:50; }
    let id = pc.k + side; while(used[id]) id+="_"; used[id]=1;
    const oc=(s[2]||[])[0], op=PCODE[oc];
    slots.push({id, label:pc.l, x, y:pc.y, pos:pc.pos, g:pc.g, role:DEF_ROLE[pc.g], oop: op && oc!==code ? op.l : null});
  });
  const cnt = g => slots.filter(s=>g.includes(s.g)).length;
  const shape = [cnt(["FB","WB","CB"]), cnt(["DM"]), cnt(["CM"])+slots.filter(s=>s.g==="W"&&s.y>40).length, cnt(["AM"])+slots.filter(s=>s.g==="W"&&s.y<=40).length, cnt(["ST"])].filter(n=>n>0).join("-");
  return {key:"save:"+tc.name+(arr.slice(0,ti).some(z=>z.name===tc.name)?" #"+ti:""), name:tc.name, mentality:MENT[tc.mentality]?t(MENT[tc.mentality]):(tc.mentality||"?"), shape, slots: slots.length===11?slots:null};
}).filter(x=>x.slots);
SAVE_TACTICS.forEach(st=>{ FORMATIONS[st.key]=st.slots; });
const TKEY = "fm27tactic::" + (D.meta.id || D.meta.save || "save");
let T = (()=>{ try { return JSON.parse(localStorage.getItem(TKEY)) || {}; } catch(e) { return {}; } })();
if(!FORMATIONS[T.formation]) T.formation = "4-2-3-1";
if(T.preset===undefined) T.preset = "rec";
T.f = T.f || {scope:"world", fam:true, sort:"fit"};
T.roles = T.roles || {}; T.weights = T.weights || {};
if(T.team==null) T.team = (D.meta.managed!=null ? D.meta.managed : null);
const saveT = ()=>{ try { localStorage.setItem(TKEY, JSON.stringify(T)); } catch(e) {} };
const weightsOf = r => T.weights[r] || ROLES[r].w;
const POSI = {}; POS.forEach((k,i)=>POSI[k]=i);
function famF(p, pos){ let v=0; for(const k of pos){ const x=p.pos[POSI[k]]; if(x>v) v=x; } return v>=18?1:v>=15?0.93:v>=12?0.8:v>=9?0.65:0.4; }
let KCACHE={};
function keyAttrs(r){ if(KCACHE[r]) return KCACHE[r]; return KCACHE[r]=keyAttrs0(r); }
function keyAttrs0(r){ const e=Object.entries(weightsOf(r)).sort((a,b)=>b[1]-a[1]); const k=e.filter(x=>x[1]>=2).map(x=>x[0]); return (k.length>=3?k:e.slice(0,4).map(x=>x[0])).slice(0,6); }
function roleScore(p, r){ const w=weightsOf(r); let s=0,t=0; for(const k in w){ const v=p.at[ai[k]]; if(v!=null){ s+=v*w[k]; t+=w[k]; } }
  if(!t) return 0; const ks=keyAttrs(r); let km=0; for(const k of ks) km+=(p.at[ai[k]]||0); km/=ks.length;
  return (0.6*(s/t)+0.4*km)*5; }
const fit = (p, slot, r) => roleScore(p, r||roleOf(slot)) * famF(p, slot.pos);
const roleOf = slot => T.roles[T.formation+"/"+slot.id] || slot.role;
const fitCol = v => v>=76?"#39e07a": v>=72?"#9bdc5e": v>=68?"#f2c14e": v>=64?"#f0954a":"#e05a5a";

// Hungarian (linhas = posições, colunas = jogadores), maximiza o encaixe
function assign(M){ // M[n][m], n<=m
  const n=M.length, m=M[0].length, INF=1e18, u=new Array(n+1).fill(0), v=new Array(m+1).fill(0), p=new Array(m+1).fill(0), way=new Array(m+1).fill(0);
  for(let i=1;i<=n;i++){ p[0]=i; let j0=0; const minv=new Array(m+1).fill(INF), used=new Array(m+1).fill(false);
    do{ used[j0]=true; const i0=p[j0]; let delta=INF, j1=0;
      for(let j=1;j<=m;j++) if(!used[j]){ const cur=-M[i0-1][j-1]-u[i0]-v[j]; if(cur<minv[j]){minv[j]=cur;way[j]=j0;} if(minv[j]<delta){delta=minv[j];j1=j;} }
      for(let j=0;j<=m;j++){ if(used[j]){u[p[j]]+=delta;v[j]-=delta;} else minv[j]-=delta; }
      j0=j1; } while(p[j0]!==0);
    do{ const j1=way[j0]; p[j0]=p[j1]; j0=j1; } while(j0);
  }
  const res=new Array(n).fill(-1); for(let j=1;j<=m;j++) if(p[j]) res[p[j]-1]=j-1; return res;
}

function squadOf(c){ return (byClub[c]||[]).filter(p=>!p.loan); }
function computeXI(){
  const slots=FORMATIONS[T.formation], sq=squadOf(T.team);
  if(sq.length<slots.length) return null;
  const M=slots.map(s=>sq.map(p=>fit(p,s)));
  const a=assign(M), used=new Set(a);
  return slots.map((s,i)=>{ const starter=sq[a[i]]; const alts=sq.map((p,k)=>({p,v:M[i][k],k})).filter(x=>!used.has(x.k)).sort((x,y)=>y.v-x.v);
    return {slot:s, starter, sv:M[i][a[i]], alt:alts[0]&&alts[0].p, av:alts[0]?alts[0].v:0}; });
}

// ---------- UI ----------
function applyPreset(k){ T.preset=k; if(k.startsWith("save:")){ if(FORMATIONS[k]) T.formation=k; return; } const pr=PRESETS[k]; if(!pr) return; T.formation=pr.f; for(const sid in pr.roles) T.roles[pr.f+"/"+sid]=pr.roles[sid]; }
if(T.preset && PRESETS[T.preset] && !T.applied){ applyPreset(T.preset); T.applied=1; }
const vT = $('viewT');
vT.innerHTML = `
<div class="tgrid">
  <div>
    <div class="filters">
      <label>${t("Equipa")}<input id="tTeam" class="wide" placeholder="${t("ex.: FC Porto")}" list="tTeamList"><datalist id="tTeamList"></datalist></label>
      <label>${t("Tática")}<select id="tPreset"><option value="">${t("Personalizada")}</option>
        ${SAVE_TACTICS.length?`<optgroup label="${t("Carregadas no teu jogo (do save)")}">${SAVE_TACTICS.map(s=>`<option value="${s.key}">${esc(s.name)} (${s.shape})</option>`).join("")}</optgroup>`:""}
        <optgroup label="${t("Predefinidas da app")}">${Object.entries(PRESETS).map(([k,v])=>`<option value="${k}">${v.n}</option>`).join("")}</optgroup></select></label>
      <label>${t("Formação")}<select id="tForm">${Object.keys(FORMATIONS).map(f=>`<option value="${f}">${f.startsWith("save:")?t("Do save: {n}",{n:esc(SAVE_TACTICS.find(s=>s.key===f).name)}):f}</option>`).join("")}</select></label>
      <button class="btn" id="tReset">${t("Funções por defeito")}</button>
    </div>
    <div class="tpitch" id="tPitch"></div>
    <div class="note" id="tSummary" style="margin-top:8px"></div>
    <div class="tinfo" id="tInfo"></div>
  </div>
  <div id="tSide" class="tside"></div>
</div>`;
const teamOpts = clubs.map((c,i)=>({i,c})).filter(x=>!x.c[4] && clubStats[x.i].n>=11).sort((a,b)=>b.c[3]-a.c[3]);
$('tTeamList').innerHTML = teamOpts.slice(0,3000).map(x=>`<option value="${esc(x.c[0])}">`).join("");
const tTeam=$('tTeam'), tForm=$('tForm');
function setTeamInput(){ tTeam.value = T.team!=null ? clubs[T.team][0] : ""; }
tTeam.addEventListener('change',()=>{ const q=fold(tTeam.value.trim()); const hit=teamOpts.find(x=>fold(x.c[0])===q) || teamOpts.find(x=>clubFold[x.i].includes(q)); if(hit){ T.team=hit.i; saveT(); renderT(); } setTeamInput(); });
tForm.addEventListener('change',()=>{ T.formation=tForm.value; T.preset=T.formation.startsWith("save:")?T.formation:""; saveT(); renderT(); });
$('tPreset').addEventListener('change',()=>{ const k=$('tPreset').value; if(k) applyPreset(k); else T.preset=""; saveT(); renderT(); });
$('tReset').onclick=()=>{ Object.keys(T.roles).filter(k=>k.startsWith(T.formation+"/")).forEach(k=>delete T.roles[k]); saveT(); renderT(); };
let curSlot=null;

function renderT(){
  KCACHE={};
  setTeamInput(); tForm.value=T.formation; $('tPreset').value=(T.preset && (PRESETS[T.preset]||FORMATIONS[T.preset]))?T.preset:"";
  const svT = SAVE_TACTICS.find(s=>s.key===T.formation);
  $('tInfo').innerHTML = svT ? t("<b>{n}</b> — carregada do teu save · formação com bola {f} · mentalidade {m}.<br>A formação e as posições vêm do jogo. As <b>funções não ficam legíveis no save</b>: vêm por defeito, por isso escolhe em cada posição a mesma função que tens no jogo (a app lembra-se).",{n:esc(svT.name),f:svT.shape,m:svT.mentality})
    : T.preset && PRESETS[T.preset] ? PRESETS[T.preset].info : `<span class="note">${t("Tática personalizada: escolhe a formação e a função de cada posição.")}${SAVE_TACTICS.length?"":t(" Para usares as táticas do teu jogo: carrega a tática no jogo, grava, e volta a importar o save.")}</span>`;
  const pitch=$('tPitch'), side=$('tSide');
  if(T.team==null){ pitch.innerHTML=`<div class="note" style="padding:30px">${t("Escolhe uma equipa no campo \"Equipa\".")}</div>`; side.innerHTML=""; $('tSummary').textContent=""; return; }
  const XI=computeXI();
  if(!XI){ pitch.innerHTML=`<div class="note" style="padding:30px">${t("Esta equipa não tem jogadores suficientes.")}</div>`; return; }
  pitch.innerHTML = XI.map(x=>{ const s=x.slot, r=roleOf(s), weak = x.sv<66 || x.av<62;
    return `<div class="tslot ${weak?'weak':''} ${curSlot===s.id?'sel':''}" style="left:${s.x}%;top:${s.y}%" data-s="${s.id}">
      <div class="tl">${slotLabel(s)}${weak?' ⚠':''}</div>
      <select data-role="${s.id}">${GROUP_ROLES[s.g].map(k=>`<option value="${k}" ${k===r?'selected':''}>${roleName(k)}</option>`).join("")}</select>
      <div class="tp" title="${esc(x.starter.name)}"><b class="n">${esc(x.starter.name)}</b><span style="color:${fitCol(x.sv)}">${x.sv.toFixed(1)}</span></div>
      <div class="ta" title="${x.alt?esc(x.alt.name):''}">${x.alt?'<span class="n">'+esc(x.alt.name)+'</span><span style="color:'+fitCol(x.av)+'">'+x.av.toFixed(1)+'</span>':'—'}</div></div>`; }).join("");
  const avg=XI.reduce((s,x)=>s+x.sv,0)/XI.length, avg2=XI.reduce((s,x)=>s+x.av,0)/XI.length;
  const weak=XI.filter(x=>x.sv<66||x.av<62).map(x=>slotLabel(x.slot)+" ("+roleName(roleOf(x.slot))+")");
  $('tSummary').innerHTML = `<b>${t("Encaixe médio do onze:")}</b> ${avg.toFixed(1)} · <b>${t("2.ªs opções:")}</b> ${avg2.toFixed(1)}${weak.length?` · <span style="color:#f08a8a">${t("Posições a reforçar: {p}",{p:weak.join(", ")})}</span>`:""}<br>${t("Em cada posição: titular (nome a negrito) e 2.ª opção por baixo. Clica numa posição para ver o ranking do plantel e procurar reforços. As notas vão de 0 a 100 e já contam com a familiaridade com a posição.")}`;
  pitch.querySelectorAll('select[data-role]').forEach(sel=>{ sel.onclick=e=>e.stopPropagation(); sel.onchange=()=>{ T.roles[T.formation+"/"+sel.dataset.role]=sel.value; if(!T.formation.startsWith("save:")) T.preset=""; saveT(); renderT(); }; });
  pitch.querySelectorAll('.tslot').forEach(d=>d.onclick=()=>{ curSlot = curSlot===d.dataset.s ? null : d.dataset.s; renderT(); });
  const cs = curSlot ? XI.find(x=>x.slot.id===curSlot) : null;
  if(!cs) curSlot=null;
  renderSide(cs, XI);
}

const footTd = p => { const b=p.lf>=15&&p.rf>=15, txt=t(b?"Ambos":(p.rf>=p.lf?"Dir.":"Esq.")); return `<td title="${t("Esquerdo {l}/20 · Direito {r}/20",{l:p.lf,r:p.rf})}"${b?' style="color:#7bd36b"':''}>${txt}</td>`; };
let lastSlotKey=null;
function renderSide(x, XI){
  const all=!x;
  const sk= all ? "ALL" : T.formation+"/"+x.slot.id+"/"+roleOf(x.slot); if(sk!==lastSlotKey){ T.f.dir="desc"; T.f.sort= all ? (document.body.classList.contains('real')?"fit":"ca") : "fit"; lastSlotKey=sk; } delete T.f.ageMin;
  const side=$('tSide'), F=T.f, real=document.body.classList.contains('real');
  const s = all ? null : x.slot, r = all ? null : roleOf(s);
  const wl = all ? "" : Object.entries(weightsOf(r)).sort((a,b)=>b[1]-a[1]).map(([k,v])=>`${L[k]||k}${v>=2?" ●":""}`).join(", ");
  const posNames = all ? "" : s.pos.map(k=>POSPT[k]).join(" / ");
  side.innerHTML = (all ? `
   <h3 class="sh">${t("Todas as posições")}</h3>
   <div class="note">${t("Pesquisa geral. A coluna \"Melhor na tática\" diz em que posição da tua tática cada jogador encaixa melhor. Clica numa posição do campo para filtrar por ela (clica outra vez para voltar aqui).")}</div>` : `
   <h3 class="sh">${slotLabel(s)} — ${roleName(r)} <a class="link" id="tAll" style="font-size:12px;font-weight:400;margin-left:8px">${t("ver todas as posições")}</a></h3>
   <div class="note">${t("Titular")}: <b>${esc(x.starter.name)}</b> (${x.sv.toFixed(1)}) · ${t("Atributos que contam (● = mais peso)")}: ${wl} · <a class="link" id="tEditW">${t("editar pesos")}</a></div>`) + `
   <div class="filters" style="margin:10px 0 6px">
     <label>${t("Procurar em")}<select id="rScope"><option value="world">${t("Todos os clubes")}</option><option value="team">${t("O meu plantel")}</option><option value="free">${t("Sem clube")}</option></select></label>
     <label>${t("Idade máx.")}<input id="rAge" type="number" value="${F.age??""}"></label>
     <label title="${t("Aplica-se ao preço pedido estimado")}">${t("Preço máx. (M€)")}<input id="rVal" type="number" value="${F.val??""}"></label>
     <label>${t("Salário máx. (K€/mês)")}<input id="rWage" type="number" value="${F.wage??""}"></label>
     <label>${t("Contrato até (ano)")}<input id="rCon" type="number" placeholder="2027" value="${F.con??""}"></label>
     <label>${t("Pé preferido")}<select id="rFoot"><option value="">${t("Qualquer")}</option><option value="L">${t("Esquerdo")}</option><option value="R">${t("Direito")}</option><option value="B">${t("Ambos")}</option></select></label>
     <label>${t("Altura mín. (cm)")}<input id="rH" type="number" value="${F.hmin??""}"></label>
     <label>${t("Nacionalidade")}<select id="rNat"><option value="">${t("Todas")}</option>${natOpts}</select></label>
     <label class="secret">${t("CA mín.")}<input id="rCa" type="number" value="${F.ca??""}"></label>
     <label class="secret">${t("PA mín.")}<input id="rPa" type="number" value="${F.pa??""}"></label>
     <label>${t("Encaixe mín.")}<input id="rMin" type="number" step="1" placeholder="${all?"":(x.sv-5).toFixed(0)}" value="${F.minFit??""}"></label>
     ${all?"":`<label class="chk"><input type="checkbox" id="rFam" ${F.fam?"checked":""}> ${t("Só quem joga em {p}",{p:posNames})}</label>`}
   </div>
   <div id="rRes"></div>`;
  $('rScope').value=F.scope||"world"; $('rNat').value=F.nat||""; $('rFoot').value=F.foot||"";
  if(!all){ $('tEditW').onclick=()=>editWeights(r); $('tAll').onclick=()=>{ curSlot=null; renderT(); }; }
  const num=id=>{const v=$(id).value; return v===""?null:+v;};
  const read=()=>{ F.scope=$('rScope').value; F.age=num('rAge'); F.val=num('rVal'); F.wage=num('rWage'); F.con=num('rCon'); F.nat=$('rNat').value; F.foot=$('rFoot').value; F.hmin=num('rH'); F.ca=num('rCa'); F.pa=num('rPa'); F.minFit=num('rMin'); if(!all) F.fam=$('rFam').checked; saveT(); run(); };
  let tm; side.querySelectorAll('.filters input,.filters select').forEach(el=>el.addEventListener(el.type==='number'?'input':'change',()=>{clearTimeout(tm);tm=setTimeout(read,250);}));
  const famOk = p => { for(const k of s.pos){ if(p.pos[POSI[k]]>=15) return true; } return false; };
  const slots = XI.map(z=>z.slot);
  const best = p => { let bv=-1, bs=null; for(const sl of slots){ const v=fit(p,sl); if(v>bv){bv=v;bs=sl;} } return [bv,bs]; };
  const KA= all ? [] : keyAttrs(r);
  function run(){
    const out=[], minFit = F.minFit!=null ? F.minFit : (all ? -1 : x.sv-5);
    for(const p of P){
      if(F.scope==="team"){ if(p.club!==T.team || p.loan) continue; }
      else if(F.scope==="free"){ if(p.club!=null) continue; }
      else if(p.club===T.team && !p.loan) continue;
      if(!all && F.fam && !famOk(p)) continue;
      if(F.age!=null && !(p.age<=F.age)) continue;
      if(F.val!=null){ const pe=priceEst(p); if(!(pe.mid!=null && pe.mid<=F.val*1e6)) continue; }
      if(F.wage!=null && !(wageEUR(p)!=null && wageEUR(p)<=F.wage*1e3)) continue;
      if(F.con!=null && !(p.cend && +p.cend.slice(0,4)<=F.con)) continue;
      if(F.nat && p.nat!=+F.nat && p.nat2!=+F.nat) continue;
      if(F.foot==="L" && !(p.lf>=15)) continue;
      if(F.foot==="R" && !(p.rf>=15)) continue;
      if(F.foot==="B" && !(p.lf>=15 && p.rf>=15)) continue;
      if(F.hmin!=null && !(p.h>=F.hmin)) continue;
      if(!real && F.ca!=null && !(p.ca>=F.ca)) continue;
      if(!real && F.pa!=null && !(p.pa>=F.pa)) continue;
      if(all){ const [v,bs]=best(p); if(v<minFit) continue; out.push({p,v,bs}); continue; }
      const v=fit(p,s); if(v<minFit) continue;
      out.push({p,v});
    }
    let k=F.sort||"fit"; if(real && (k==="ca"||k==="pa")) k="fit";
    if(k.startsWith("a:") && !KA.includes(k.slice(2))) k="fit";
    const key = k.startsWith("a:") ? (o=>o.p.at[ai[k.slice(2)]]||0) : {fit:o=>o.v, ca:o=>o.p.ca||0, pa:o=>o.p.pa||0, val:o=>priceEst(o.p).mid||0, wage:o=>wageEUR(o.p)||0, age:o=>o.p.age||0, h:o=>o.p.h||0}[k];
    const asc = F.dir==="asc";
    out.sort((a,b)=>(asc? key(a)-key(b) : key(b)-key(a)) || b.v-a.v);
    const top=out.slice(0,150), H=(id,lbl,cls="",tip="")=>`<th class="num ${cls} ${k===id?'sorted':''}" data-sort="${id}" title="${(tip||lbl)}${t(" — clica para ordenar (2.º clique inverte)")}">${lbl}${k===id?(asc?" ▲":" ▼"):""}</th>`;
    const SH={pace:"Vel.",acceleration:"Acel.",stamina:"Resist.",work_rate:"Trab.",finishing:"Final.",off_the_ball:"S/Bola",composure:"Comp.",passing:"Passe",vision:"Visão",technique:"Téc.",first_touch:"1.º Toq.",decisions:"Decis.",tackling:"Desarme",positioning:"Posic.",marking:"Marc.",heading:"Cabec.",jumping_reach:"Impul.",strength:"Força",anticipation:"Antec.",concentration:"Conc.",dribbling:"Finta",crossing:"Cruz.",reflexes:"Refl.",one_on_ones:"1x1",handling:"Mãos",aerial_reach:"Alc.Aér.",kicking:"Pontapé",agility:"Agil.",teamwork:"Equipa",long_shots:"R.Longe",flair:"Imprev.",command_of_area:"Dom.Área",rushing_out:"Saídas",bravery:"Bravura",balance:"Equil."};
    const short = a => (LANG==="pt" ? SH[a] : ATTR_SHORT_EN[a]) || (L[a]||a);
    const sortName = k==="fit"?t("encaixe"):k.startsWith("a:")?(L[k.slice(2)]||k):({ca:"CA",pa:"PA",val:t("preço estimado"),wage:t("salário"),age:t("idade"),h:t("altura")}[k]);
    const countTxt = `${out.length.toLocaleString(NUMLOC)} ${out.length===1?t("jogador"):t("jogadores")}${out.length>150?t(" · a mostrar os 150 primeiros"):""}`;
    const ageTxt = F.age!=null?t("Até {n} anos. ",{n:F.age}):"";
    if(all){
      $('rRes').innerHTML = `<div class="note" style="margin-bottom:6px">${ageTxt}${t("Ordenados por")} <b>${sortName}</b>; ${t("clica nos títulos para mudar.")}</div>` + (!top.length ? `<div class="note">${t("Nenhum jogador com estes filtros.")}</div>` :
      `<div class="note" style="margin-bottom:4px">${countTxt}</div>
      <table class="mini"><thead><tr><th>${t("Nome")}</th>${H("age",t("Idade"))}<th title="${t("Pé preferido (Ambos = os dois pés Fortes ou melhor)")}">${t("Pé")}</th>${H("h",t("Alt."),"",t("Altura (cm)"))}<th>${t("Clube")}</th><th>${t("Posições")}</th>${H("ca","CA","secret")}${H("pa","PA","secret")}<th title="${t("Posição da tua tática onde encaixa melhor")}">${t("Melhor na tática")}</th>${H("fit",t("Encaixe"))}${H("val",t("Preço est."),"",t("Preço pedido estimado (passa o rato por cima de cada valor)"))}${H("wage",t("Salário"))}<th>${t("Contr.")}</th></tr></thead><tbody>`+
      top.map(o=>`<tr data-i="${o.p.idx}"><td>${esc(o.p.name)}</td><td class="num">${o.p.age}</td>${footTd(o.p)}<td class="num">${o.p.h??"—"}</td><td>${esc(clubName(o.p.club))}</td><td>${posStr(o.p)}</td><td class="num secret">${o.p.ca??"—"}</td><td class="num secret">${o.p.pa??"—"}</td><td>${o.bs?slotLabel(o.bs)+" · "+roleName(roleOf(o.bs)):"—"}</td><td class="num" style="color:${fitCol(o.v)};font-weight:700">${o.v.toFixed(1)}</td><td class="num" title="${esc(priceTip(o.p))}">${priceTxt(o.p)}</td><td class="num">${eur(wageEUR(o.p))}</td><td>${o.p.cend?o.p.cend.slice(0,4):"—"}</td></tr>`).join("")+`</tbody></table>`);
      const tbl=$('rRes').querySelector('table');
      if(tbl){ tbl.querySelector('thead').onclick=e=>{const th=e.target.closest('th[data-sort]'); if(th){ if(F.sort===th.dataset.sort) F.dir = F.dir==="asc"?"desc":"asc"; else { F.sort=th.dataset.sort; F.dir="desc"; } saveT(); run(); }};
             tbl.querySelector('tbody').onclick=e=>{const tr=e.target.closest('tr'); if(tr) openPlayer(+tr.dataset.i);}; }
      return;
    }
    const st = x.starter;
    $('rRes').innerHTML = `<div class="note" style="margin-bottom:6px">${t("Jogadores que encaixam na função {r}: encaixe mínimo {m} (por defeito, 5 abaixo do teu titular).",{r:"<b>"+roleName(r)+"</b>",m:minFit.toFixed(0)})} ${ageTxt}${t("Ordenados por")} <b>${sortName}</b>; ${t("clica nos títulos para mudar.")}</div>` + (!top.length ? `<div class="note">${t("Nenhum jogador com estes filtros. Baixa o encaixe mínimo ou alarga os filtros.")}</div>` :
      `<div class="note" style="margin-bottom:4px">${countTxt}</div>
      <table class="mini"><thead><tr><th>${t("Nome")}</th>${H("age",t("Idade"))}<th title="${t("Pé preferido (Ambos = os dois pés Fortes ou melhor)")}">${t("Pé")}</th>${H("h",t("Alt."),"",t("Altura (cm)"))}<th>${t("Clube")}</th>${H("fit",t("Encaixe"))}<th class="num">${t("vs tit.")}</th>${KA.map(a=>H("a:"+a,short(a),"ka",L[a])).join("")}${H("ca","CA","secret")}${H("pa","PA","secret")}${H("val",t("Preço est."),"",t("Preço pedido estimado (passa o rato por cima de cada valor)"))}${H("wage",t("Salário"))}<th>${t("Contr.")}</th></tr></thead><tbody>`+
      `<tr class="starter" data-i="${st.idx}"><td>${esc(st.name)} <span class="pill">${t("titular")}</span></td><td class="num">${st.age}</td>${footTd(st)}<td class="num">${st.h??"—"}</td><td>${esc(clubName(st.club))}</td><td class="num" style="color:${fitCol(x.sv)};font-weight:700">${x.sv.toFixed(1)}</td><td class="num">—</td>${KA.map(a=>{const v=st.at[ai[a]];return `<td class="num" style="color:${col(v)}">${v??"—"}</td>`}).join("")}<td class="num secret">${st.ca??"—"}</td><td class="num secret">${st.pa??"—"}</td><td class="num" title="${esc(priceTip(st))}">${priceTxt(st)}</td><td class="num">${eur(wageEUR(st))}</td><td>${st.cend?st.cend.slice(0,4):"—"}</td></tr>`+
      top.map(o=>{const d=o.v-x.sv; return `<tr data-i="${o.p.idx}"><td>${esc(o.p.name)}<div class="note">${posStr(o.p)}</div></td><td class="num">${o.p.age}</td>${footTd(o.p)}<td class="num">${o.p.h??"—"}</td><td>${esc(clubName(o.p.club))}</td><td class="num" style="color:${fitCol(o.v)};font-weight:700">${o.v.toFixed(1)}</td><td class="num" style="color:${d>=0?'#7bd36b':'#e0a04a'}">${d>=0?'+':''}${d.toFixed(1)}</td>${KA.map(a=>{const v=o.p.at[ai[a]]; const sv=st.at[ai[a]]; return `<td class="num" style="color:${col(v)}" title="${t("titular: {v}",{v:sv})}">${v??"—"}${v>sv?'<span class="up">▲</span>':''}</td>`}).join("")}<td class="num secret">${o.p.ca??"—"}</td><td class="num secret">${o.p.pa??"—"}</td><td class="num" title="${esc(priceTip(o.p))}">${priceTxt(o.p)}</td><td class="num">${eur(wageEUR(o.p))}</td><td>${o.p.cend?o.p.cend.slice(0,4):"—"}</td></tr>`}).join("")+`</tbody></table>`);
    const tbl=$('rRes').querySelector('table');
    if(tbl){ tbl.querySelector('thead').onclick=e=>{const th=e.target.closest('th[data-sort]'); if(th){ if(F.sort===th.dataset.sort) F.dir = F.dir==="asc"?"desc":"asc"; else { F.sort=th.dataset.sort; F.dir="desc"; } saveT(); run(); }};
           tbl.querySelector('tbody').onclick=e=>{const tr=e.target.closest('tr'); if(tr) openPlayer(+tr.dataset.i);}; }
  }
  run();
}

function editWeights(r){
  const w={...weightsOf(r)}; const keys=[...D.TECH,...D.MENT,...D.PHYS,...D.GK];
  $('card').innerHTML=`<div class="top"><div><h2>${t("Pesos — {r}",{r:roleName(r)})}</h2><div class="sub">${t("0 = não conta · 1 = normal · 2 a 3 = muito importante")}</div></div><button class="btn close" id="wClose">${t("Fechar ✕")}</button></div>
   <div class="wgrid">${keys.map(k=>`<label class="wrow"><span>${L[k]||k}</span><input type="number" min="0" max="5" step="0.5" data-k="${k}" value="${w[k]||0}"></label>`).join("")}</div>
   <div style="padding:0 20px 18px;display:flex;gap:8px"><button class="btn big" id="wSave">${t("Guardar")}</button><button class="btn" id="wDef">${t("Repor valores por defeito")}</button></div>`;
  $('ov').classList.add('on');
  $('wClose').onclick=()=>$('ov').classList.remove('on');
  $('wDef').onclick=()=>{ delete T.weights[r]; saveT(); $('ov').classList.remove('on'); renderT(); };
  $('wSave').onclick=()=>{ const nw={}; $('card').querySelectorAll('input[data-k]').forEach(i=>{const v=+i.value; if(v>0) nw[i.dataset.k]=v;}); if(Object.keys(nw).length){ T.weights[r]=nw; saveT(); } $('ov').classList.remove('on'); renderT(); };
}
renderT();

