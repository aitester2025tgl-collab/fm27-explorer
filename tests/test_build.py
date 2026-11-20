"""Build sanity checks: the single-file app is complete and its embedded code parses."""
import ast
import re
import shutil
import subprocess
import sys
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "tools"))
import build  # noqa: E402


@pytest.fixture(scope="module")
def html(tmp_path_factory):
    out = build.build(tmp_path_factory.mktemp("dist"))
    return out.read_text(encoding="utf-8")


def test_committed_app_is_up_to_date():
    """FM27-Explorer.html at the repo root must match the sources (run tools/build.py)."""
    assert build.APP_FILE.read_text(encoding="utf-8") == build.render_app()


def test_no_unresolved_markers(html):
    assert "@include" not in html
    assert "{{VERSION}}" not in html


def test_core_ui_present(html):
    for element_id in ("tabP", "tabC", "tabT", "btnImport", "fileIn", "realMode", "tPitch", "pycode"):
        assert f'id="{element_id}"' in html, element_id


def test_embedded_python_parses(html):
    code = re.search(r'<script type="text/plain" id="pycode">(.*?)</script>', html, re.S).group(1)
    ast.parse(code)
    assert "def convert(" in code


def test_pinned_runtime_versions(html):
    assert "pyodide/v314.0.7/" in html
    assert "fmsave-0.12.6-py3-none-any.whl" in html


@pytest.mark.skipif(shutil.which("node") is None, reason="node not installed")
def test_embedded_javascript_parses(html, tmp_path):
    scripts = re.findall(r"<script>(.*?)</script>", html, re.S)
    assert scripts, "no inline scripts found"
    for i, js in enumerate(scripts):
        f = tmp_path / f"s{i}.js"
        f.write_text(js, encoding="utf-8")
        result = subprocess.run(["node", "--check", str(f)], capture_output=True, text=True)
        assert result.returncode == 0, result.stderr


@pytest.mark.skipif(shutil.which("node") is None, reason="node not installed")
def test_every_translated_string_has_english(tmp_path):
    """Every t("…") literal in the JS sources must exist in the English dictionary (src/js/i18n.js)."""
    import json
    loader = tmp_path / "keys.js"
    loader.write_text(
        "global.localStorage={getItem:()=>null};global.NodeFilter={SHOW_TEXT:4};"
        "global.document={documentElement:{},body:null,createTreeWalker:()=>({nextNode:()=>false}),querySelectorAll:()=>[]};"
        "const fs=require('fs');eval(fs.readFileSync(process.argv[2],'utf8')+';global.__K=Object.keys(EN);');"
        "console.log(JSON.stringify(global.__K));",
        encoding="utf-8",
    )
    out = subprocess.run(["node", str(loader), str(ROOT / "src" / "js" / "i18n.js")], capture_output=True, text=True)
    keys = set(json.loads(out.stdout))
    missing = []
    for js in (ROOT / "src" / "js").glob("*.js"):
        if js.name == "i18n.js":
            continue
        for m in re.finditer(r'\bt\(\s*"((?:[^"\\]|\\.)*)"', js.read_text(encoding="utf-8")):
            key = json.loads('"' + m.group(1) + '"')
            if key not in keys:
                missing.append(f"{js.name}: {key}")
    assert not missing, missing


def test_language_switch_present(html):
    assert 'id="langSw"' in html
    assert 'data-l="en"' in html and 'data-l="pt"' in html
