"""Unit tests for the in-browser converter helpers (needs the fmsave package)."""
import importlib.util
import json
from pathlib import Path

import pytest

pytest.importorskip("fmsave")
ROOT = Path(__file__).resolve().parent.parent
spec = importlib.util.spec_from_file_location("convert", ROOT / "src" / "py" / "convert.py")
convert = importlib.util.module_from_spec(spec)
spec.loader.exec_module(convert)


def test_int_parsing():
    assert convert._i("12") == 12
    assert convert._i("12.0") == 12
    assert convert._i("") is None
    assert convert._i(None) is None


def test_release_clauses_pick_lowest_per_kind():
    raw = json.dumps([
        {"kind": "minimum_fee_release", "value": 900},
        {"kind": "minimum_fee_release", "value": 800},
        {"kind": "minimum_fee_release_foreign", "value": 500},
        {"kind": "minimum_fee_release_domestic", "value": 700},
        {"kind": "appearance_fee", "value": 10},
    ])
    assert convert._clauses(raw) == [800, 500, 700]


def test_release_clauses_handle_empty_and_bad_input():
    assert convert._clauses("") == [None, None, None]
    assert convert._clauses("not json") == [None, None, None]


def test_every_role_attribute_is_known():
    known = set(convert.A)
    assert len(known) == len(convert.A), "duplicate attribute names"
    assert {"pace", "acceleration", "finishing", "reflexes"} <= known


def test_nation_names_cover_major_nations():
    for db_id, name in {765: "Inglaterra", 788: "Portugal", 796: "Espanha", 1651: "Brasil"}.items():
        assert convert.NAMES[db_id] == name
