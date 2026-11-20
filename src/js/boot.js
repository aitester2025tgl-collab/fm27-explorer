const CFG = {
  pyodide: "https://cdn.jsdelivr.net/pyodide/v314.0.7/full/",
  wheel: "https://files.pythonhosted.org/packages/ae/77/305e45c51850df8658131756e58676017c931d38ca80e93e1c796cf1b8b4/fmsave-0.12.6-py3-none-any.whl"
};

// ---------- armazenamento local (IndexedDB, fica só neste browser/PC) ----------
function openDB(){
  return new Promise((res,rej)=>{
    const r = indexedDB.open("fm27explorer", 1);
    r.onupgradeneeded = () => { const d=r.result; d.createObjectStore("index",{keyPath:"id"}); d.createObjectStore("data"); };
    r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error);
  });
}
function req(r){ return new Promise((res,rej)=>{ r.onsuccess=()=>res(r.result); r.onerror=()=>rej(r.error); }); }
async function listSaves(){ const d=await openDB(); return req(d.transaction("index").objectStore("index").getAll()); }
async function getSaveData(id){ const d=await openDB(); return req(d.transaction("data").objectStore("data").get(id)); }
async function putSave(entry, json){
  const d=await openDB();
  return new Promise((res,rej)=>{ const tx=d.transaction(["index","data"],"readwrite"); tx.objectStore("index").put(entry); tx.objectStore("data").put(json, entry.id); tx.oncomplete=()=>res(); tx.onerror=()=>rej(tx.error); });
}
async function deleteSave(id){
  const d=await openDB();
  return new Promise((res,rej)=>{ const tx=d.transaction(["index","data"],"readwrite"); tx.objectStore("index").delete(id); tx.objectStore("data").delete(id); tx.oncomplete=()=>res(); tx.onerror=()=>rej(tx.error); });
}
const fmtDate = d => /^\d{4}-\d{2}-\d{2}$/.test(d||"") ? d.split("-").reverse().join("/") : (d||"?");
const slugify = s => (s||"save").normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/[^A-Za-z0-9]+/g,"_").replace(/^_|_$/g,"").toLowerCase() || "save";

// ---------- importar ----------
const fileIn = document.getElementById('fileIn');
document.getElementById('btnImport').onclick = () => fileIn.click();
fileIn.onchange = () => { const f=fileIn.files[0]; fileIn.value=""; if(f) importSave(f); };

let PY = null;
const paint = () => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(r, 30))));
async function importSave(file){
  if(!/\.fm$/i.test(file.name)){ showImport(t("Esse ficheiro não é um save do Football Manager (.fm)."), true); return; }
  try {
    if(!PY){
      showImport(t("A preparar o leitor de saves (na primeira vez pode demorar um pouco)…")); await paint();
      const m = await import(CFG.pyodide + "pyodide.mjs");
      PY = await m.loadPyodide({ indexURL: CFG.pyodide });
      showImport(t("A carregar o fmsave…")); await paint();
      const whl = new Uint8Array(await (await fetch(CFG.wheel)).arrayBuffer());
      PY.FS.writeFile("/tmp/fmsave.whl", whl);
      PY.runPython("import zipfile, site, sys\nd = site.getsitepackages()[0]\nzipfile.ZipFile('/tmp/fmsave.whl').extractall(d)\nif d not in sys.path: sys.path.append(d)");
      PY.runPython(document.getElementById('pycode').textContent);
    }
    showImport(t("A copiar o save para a memória…")); await paint();
    PY.FS.writeFile("/save.fm", new Uint8Array(await file.arrayBuffer()));
    showImport(t("A ler jogadores e clubes… Isto demora 1 a 3 minutos e a página fica parada enquanto isso. Não a feches.")); await paint();
    let json;
    try { json = PY.globals.get("convert")("/save.fm", file.name.replace(/\.fm$/i, "")); }
    finally { try { PY.FS.unlink("/save.fm"); } catch(_){} }
    showImport(t("A guardar…")); await paint();
    const D = JSON.parse(json);
    const id = slugify(D.meta.save) + "__" + (D.meta.game_date || "sem-data");
    await putSave({id, save:D.meta.save, game_date:D.meta.game_date, players:D.players.length,
      imported: new Date().toISOString().slice(0,16).replace("T"," ")}, json);
    location.href = location.pathname + "?save=" + encodeURIComponent(id);
  } catch(err) {
    let msg = String(err && err.message || err).trim().split("\n").filter(Boolean).slice(-1)[0] || t("erro desconhecido");
    if(/fetch|import|network|Failed to load/i.test(msg) && !PY) msg += t(" — confirma que tens internet (é preciso na primeira importação para descarregar o leitor).");
    showImport(t("Não foi possível importar: {m}",{m:msg.replace(/</g,"&lt;")}), true);
  }
}
function showImport(html, done){
  const ov=document.getElementById('ov'), card=document.getElementById('card');
  card.innerHTML = `<div class="top"><div><h2>${t("Importar save")}</h2></div>${done?'<button class="btn close" id="closeImp">'+t("Fechar ✕")+'</button>':''}</div>
   <div style="padding:22px 20px 26px;font-size:15px">${done?"":'<span class="spin"></span>'} ${html}
   ${done?"":'<p class="note" style="margin-top:14px">'+t("O save é lido aqui no teu computador e não é enviado para lado nenhum. Não feches esta página.")+'</p>'}</div>`;
  ov.classList.add('on');
  if(done) document.getElementById('closeImp').onclick=()=>ov.classList.remove('on');
}

// ---------- arranque ----------
(async function boot(){
  const loading = document.getElementById('loading');
  const sel = document.getElementById('saveSel');
  let S;
  try { S = await listSaves(); }
  catch(e){ loading.innerHTML = `<h2>${t("O browser não deixa guardar dados")}</h2><p>${t("Abre esta página no Chrome ou no Edge (sem janela anónima).")}</p>`; return; }
  if(!S.length){
    sel.parentElement.hidden = true; document.getElementById('btnDel').hidden = true;
    loading.innerHTML = `<h2>${t("Bem-vindo ao FM27 Explorer")}</h2>
      <p>${t("Para começar, importa um save do Football Manager 27.")}</p>
      <p><button class="btn big" onclick="document.getElementById('fileIn').click()">${t("Importar save (.fm)")}</button></p>
      <p class="note">${t("Os saves estão normalmente em {p}.",{p:`<code>${LANG==="pt"?"Documentos":"Documents"}\\Sports Interactive\\Football Manager 27\\games</code>`})}<br>
      ${t("O save é lido no teu computador e nunca sai dele. Na primeira importação é preciso internet para descarregar o leitor.")}</p>
      <p class="note">${t("A leitura dos saves é feita pelo {l}, um projeto open source de Randal S. Olson.",{l:'<a class="link" href="https://github.com/rhiever/fmsave" target="_blank" rel="noopener">fmsave</a>'})}</p>`;
    return;
  }
  S.sort((a,b)=>a.save.localeCompare(b.save,'pt') || (a.game_date||"").localeCompare(b.game_date||""));
  const q = new URLSearchParams(location.search).get('save');
  let last = null; try { last = localStorage.getItem('fm27save'); } catch(e) {}
  const newest = S.slice().sort((a,b)=>(b.imported||"").localeCompare(a.imported||""))[0];
  const cur = S.find(x=>x.id===q) || S.find(x=>x.id===last) || newest;
  sel.innerHTML = S.map(x=>`<option value="${x.id}" ${x.id===cur.id?"selected":""}>${x.save.replace(/</g,"&lt;")} — ${fmtDate(x.game_date)}</option>`).join("");
  sel.onchange = () => { location.href = location.pathname + "?save=" + encodeURIComponent(sel.value); };
  document.getElementById('btnDel').onclick = async () => {
    if(!confirm(t("Apagar \"{s}\" da aplicação?\n(O ficheiro do save no jogo não é afetado.)",{s:cur.save+" — "+fmtDate(cur.game_date)}))) return;
    await deleteSave(cur.id); try{localStorage.removeItem('fm27save')}catch(e){}
    location.href = location.pathname;
  };
  try { localStorage.setItem('fm27save', cur.id); } catch(e) {}
  loading.textContent = t("A carregar \"{s}\" ({d})…",{s:cur.save,d:fmtDate(cur.game_date)});
  const json = await getSaveData(cur.id);
  if(!json){ loading.textContent = t("Não encontrei os dados deste save. Volta a importá-lo."); return; }
  app(JSON.parse(json));
})();

