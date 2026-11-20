# Corre dentro do browser (Pyodide). Converte um save do FM27 nos dados da app.
import contextlib, csv, io, json, os
from fmsave.cli import main as fmsave_main
csv.field_size_limit(10**8)

NAMES = {5:"Argélia",6:"Angola",7:"Benim",8:"Botsuana",9:"Burkina Faso",10:"Burundi",11:"Camarões",12:"Cabo Verde",13:"Rep. Centro-Africana",14:"Chade",15:"Djibuti",16:"Egito",17:"Guiné Equatorial",18:"Etiópia",19:"Gabão",20:"Gâmbia",21:"Gana",22:"Guiné",23:"Guiné-Bissau",24:"Costa do Marfim",25:"Quénia",26:"Lesoto",27:"Libéria",28:"Líbia",29:"Madagáscar",30:"Malawi",31:"Mali",32:"Mauritânia",33:"Maurícia",34:"Marrocos",35:"Moçambique",36:"Namíbia",37:"Níger",38:"Nigéria",39:"Ruanda",40:"São Tomé e Príncipe",41:"Senegal",42:"Seicheles",43:"Serra Leoa",44:"Somália",45:"África do Sul",46:"Sudão",47:"Essuatíni",48:"Tanzânia",49:"Congo",50:"Togo",51:"Tunísia",52:"Uganda",53:"RD Congo",54:"Zâmbia",55:"Zimbabué",
106:"Afeganistão",107:"Barém",108:"Bangladesh",110:"China",111:"Hong Kong",112:"Índia",113:"Indonésia",114:"Irão",115:"Iraque",116:"Japão",117:"Jordânia",119:"Cazaquistão",120:"Kuwait",121:"Quirguistão",122:"Laos",123:"Líbano",124:"Macau",125:"Malásia",126:"Maldivas",127:"Myanmar",128:"Nepal",129:"Coreia do Norte",130:"Omã",131:"Paquistão",132:"Catar",133:"Arábia Saudita",134:"Singapura",135:"Coreia do Sul",136:"Sri Lanka",137:"Síria",138:"Taiwan",139:"Tajiquistão",140:"Tailândia",141:"Filipinas",142:"Turquemenistão",143:"Emirados Árabes Unidos",144:"Uzbequistão",145:"Vietname",146:"Iémen",
359:"Antígua e Barbuda",360:"Aruba",361:"Barbados",363:"Bermudas",364:"Canadá",366:"Costa Rica",367:"Cuba",370:"El Salvador",371:"Granada",373:"Guatemala",374:"Guiana",375:"Haiti",376:"Honduras",377:"Jamaica",379:"México",380:"Curaçau",381:"Nicarágua",382:"Panamá",383:"Porto Rico",384:"São Cristóvão e Nevis",387:"Suriname",388:"Bahamas",389:"Trinidad e Tobago",390:"Estados Unidos",
752:"Albânia",753:"Andorra",754:"Arménia",755:"Áustria",756:"Azerbaijão",757:"Bélgica",758:"Bielorrússia",759:"Bósnia e Herzegovina",760:"Bulgária",761:"Croácia",762:"Chipre",763:"Chéquia",764:"Dinamarca",765:"Inglaterra",766:"Estónia",767:"Ilhas Faroé",768:"Finlândia",769:"França",770:"Geórgia",771:"Alemanha",772:"Grécia",773:"Hungria",774:"Islândia",775:"Israel",776:"Itália",777:"Letónia",778:"Liechtenstein",779:"Lituânia",780:"Luxemburgo",781:"Macedónia do Norte",782:"Malta",783:"Moldávia",784:"Países Baixos",785:"Irlanda do Norte",786:"Noruega",787:"Polónia",788:"Portugal",789:"Irlanda",790:"Roménia",791:"Rússia",792:"São Marino",793:"Escócia",794:"Eslováquia",795:"Eslovénia",796:"Espanha",797:"Suécia",798:"Suíça",799:"Turquia",800:"Ucrânia",801:"País de Gales",802:"Sérvia",
1435:"Austrália",1437:"Fiji",1438:"Nova Zelândia",1441:"Taiti",1443:"Vanuatu",1649:"Argentina",1650:"Bolívia",1651:"Brasil",1652:"Chile",1653:"Colômbia",1654:"Equador",1655:"Paraguai",1656:"Peru",1657:"Uruguai",1658:"Venezuela",1662:"Palestina",
129505:"Mongólia",129511:"Eritreia",129520:"Montserrat",129526:"Turcas e Caicos",129532:"Nova Caledónia",142527:"República Dominicana",214394:"Gibraltar",217945:"Kosovo",917496:"Guiana Francesa",917498:"Guadalupe",917502:"Martinica",919586:"Comores",5626837:"Timor-Leste",13113220:"Sudão do Sul",62002127:"Montenegro"}

TECH=["corners","crossing","dribbling","finishing","first_touch","free_kick_taking","heading","long_shots","long_throws","marking","passing","penalty_taking","tackling","technique"]
MENT=["aggression","anticipation","bravery","composure","concentration","decisions","determination","flair","leadership","off_the_ball","positioning","teamwork","vision","work_rate"]
PHYS=["acceleration","agility","balance","jumping_reach","natural_fitness","pace","stamina","strength"]
GK=["aerial_reach","command_of_area","communication","eccentricity","handling","kicking","one_on_ones","punching","reflexes","rushing_out","throwing"]
HID=["consistency","dirtiness","important_matches","injury_proneness","versatility"]
PERS=["adaptability","ambition","loyalty","pressure","professionalism","sportsmanship","temperament","controversy"]
POS=["gk","dl","dc","dr","wbl","dm","wbr","ml","mc","mr","aml","amc","amr","stc"]
A=TECH+MENT+PHYS+GK+HID


def _i(v):
    try:
        return int(float(v))
    except (TypeError, ValueError):
        return None


def _clauses(raw):
    rc = rcf = rcd = None
    try:
        for cl in json.loads(raw or "[]"):
            k, v = cl.get("kind"), cl.get("value")
            if not v:
                continue
            if k == "minimum_fee_release":
                rc = v if rc is None else min(rc, v)
            elif k == "minimum_fee_release_foreign":
                rcf = v if rcf is None else min(rcf, v)
            elif k in ("minimum_fee_release_domestic", "minimum_fee_release_domestic_higher_division"):
                rcd = v if rcd is None else min(rcd, v)
    except ValueError:
        pass
    return [rc, rcf, rcd]


def convert(path, save_name):
    tmp = "/work"
    os.makedirs(tmp, exist_ok=True)
    buf = io.StringIO()
    with contextlib.redirect_stdout(buf):
        fmsave_main(["info", path, "--json"])
    try:
        m = json.loads(buf.getvalue())
    except ValueError:
        m = {}
    if m.get("game") not in (None, "FM27"):
        raise RuntimeError(f"Este save é do {m.get('game')}, não do FM27.")
    managed = None
    try:
        fmsave_main(["export", path, "managed-clubs", "--all", "-o", f"{tmp}/managed.csv"])
        mrows = list(csv.DictReader(open(f"{tmp}/managed.csv", encoding="utf-8")))
        if mrows:
            managed = _i(mrows[0]["club_uid"])
    except Exception:
        pass
    tactics = []
    try:
        fmsave_main(["export", path, "tactics", "--managed-club", "--format", "json", "-o", f"{tmp}/tactics.json"])
        for tc in json.load(open(f"{tmp}/tactics.json", encoding="utf-8")):
            if tc.get("team_slot") not in (0, None):
                continue
            sl = []
            for s_ in tc.get("slots", []):
                sl.append([s_.get("in_possession_positions_code") or [], s_.get("in_possession_mask") or 0,
                           s_.get("out_of_possession_positions_code") or [], s_.get("out_of_possession_mask") or 0])
            if len(sl) == 11:
                tactics.append({"name": tc.get("name") or "Tática", "mentality": tc.get("mentality"), "slots": sl})
    except Exception:
        pass
    for t in ("nations", "clubs", "players"):
        code = fmsave_main(["export", path, t, "--all", "-o", f"{tmp}/{t}.csv"])
        if code:
            raise RuntimeError("O fmsave não conseguiu ler este save.")
    nat = {}
    for x in csv.DictReader(open(f"{tmp}/nations.csv", encoding="utf-8")):
        db = int(x["database_id"])
        nat[int(x["nation_id"])] = NAMES.get(db, f"Nação #{db}")
    clubs, clist = {}, []
    for c in csv.DictReader(open(f"{tmp}/clubs.csv", encoding="utf-8")):
        clubs[int(c["uid"])] = len(clist)
        clist.append([c["name"], c["short_name"], _i(c["nation_id"]) if c["nation_id"] else -1, _i(c["reputation"]) or 0, c["gender"] == "women"])
    P = []
    for p in csv.DictReader(open(f"{tmp}/players.csv", encoding="utf-8")):
        cu, lp = _i(p["club_uid"]), _i(p["loan_parent_club_uid"])
        tr = [t for t in p["traits"].split(";") if t and t != "unknown"]
        sec = [int(s) for s in p["second_nation_ids"].split(";") if s]
        P.append([p["name"], _i(p["age"]), p["birth_date"], _i(p["nation_id"]), sec[0] if sec else None,
                  clubs.get(cu) if cu is not None else None, _i(p["team_slot"]), _i(p["height_cm"]),
                  _i(p["ability_current"]), _i(p["ability_potential"]), p["natural_positions"], p["accomplished_positions"],
                  _i(p["left_foot"]), _i(p["right_foot"]), _i(p["transfer_value"]), _i(p["contract_wage"]), p["contract_end"],
                  p["contract_squad_status"], p["on_loan"] == "true", clubs.get(lp) if lp is not None else None,
                  _i(p["reputation_world"]), [_i(p["attributes_" + a]) for a in A],
                  [_i(p["personality_" + a]) for a in PERS], [_i(p["positions_" + a]) for a in POS], tr, _i(p["uid"])] + _clauses(p["contract_clauses"]))
    for t in ("nations", "clubs", "players"):
        os.remove(f"{tmp}/{t}.csv")
    meta = {k: m.get(k) for k in ("game", "build", "game_date")}
    meta["save"] = save_name
    meta["managed"] = clubs.get(managed) if managed is not None else None
    meta["tactics"] = tactics
    D = dict(meta=meta, nations=nat, clubs=clist, A=A, TECH=TECH, MENT=MENT, PHYS=PHYS, GK=GK, HID=HID, PERS=PERS, POS=POS, players=P)
    return json.dumps(D, ensure_ascii=False, separators=(",", ":"))
