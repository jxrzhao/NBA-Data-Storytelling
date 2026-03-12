"""
Build season-level FGA and SFD metrics.

Input:
  data/*.csv

Output:
  src/app/data/season_fga_sfd_metrics.json

Metrics:
  - fg2a_per100 = sum(FG2A) / sum(Minutes) * 100
  - fg3a_per100 = sum(FG3A) / sum(Minutes) * 100
  - two_pt_sfd_pct = sum(TwoPtShootingFoulsDrawn) / (sum(FG2A) + sum(TwoPtShootingFoulsDrawn) - sum(2pt And 1 Free Throw Trips))
  - three_pt_sfd_pct = sum(ThreePtShootingFoulsDrawn) / (sum(FG3A) + sum(ThreePtShootingFoulsDrawn) - sum(3pt And 1 Free Throw Trips))
"""

from __future__ import annotations

import csv
import json
from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parents[2]
DATA_DIR = PROJECT_ROOT / "data"
OUTPUT_PATH = PROJECT_ROOT / "src" / "app" / "data" / "season_fga_sfd_metrics.json"

FG2A = "FG2A"
FG3A = "FG3A"
MINUTES = "Minutes"
TWO_PT_SFD = "TwoPtShootingFoulsDrawn"
THREE_PT_SFD = "ThreePtShootingFoulsDrawn"
TWO_PT_AND1 = "2pt And 1 Free Throw Trips"
THREE_PT_AND1 = "3pt And 1 Free Throw Trips"


def parse_number(value: str | None) -> float:
    if value is None:
        return 0.0
    text = str(value).strip()
    if text == "":
        return 0.0
    return float(text)


def season_sort_key(path: Path) -> tuple[int, int]:
    start, end = path.stem.split("_")
    s, e = int(start), int(end)

    def to_full_year(yy: int) -> int:
        return 1900 + yy if yy >= 50 else 2000 + yy

    return (to_full_year(s), to_full_year(e))


def aggregate_file(filepath: Path) -> dict[str, float | str]:
    total_fg2a = 0.0
    total_fg3a = 0.0
    total_minutes = 0.0
    total_two_pt_sfd = 0.0
    total_three_pt_sfd = 0.0
    total_two_pt_and1 = 0.0
    total_three_pt_and1 = 0.0

    with filepath.open(newline="", encoding="utf-8") as file_obj:
        reader = csv.DictReader(file_obj)
        for row in reader:
            total_fg2a += parse_number(row.get(FG2A))
            total_fg3a += parse_number(row.get(FG3A))
            total_minutes += parse_number(row.get(MINUTES))
            total_two_pt_sfd += parse_number(row.get(TWO_PT_SFD))
            total_three_pt_sfd += parse_number(row.get(THREE_PT_SFD))
            total_two_pt_and1 += parse_number(row.get(TWO_PT_AND1))
            total_three_pt_and1 += parse_number(row.get(THREE_PT_AND1))

    fg2a_per100 = (total_fg2a / total_minutes * 100) if total_minutes > 0 else 0.0
    fg3a_per100 = (total_fg3a / total_minutes * 100) if total_minutes > 0 else 0.0

    two_pt_denom = total_fg2a + total_two_pt_sfd - total_two_pt_and1
    three_pt_denom = total_fg3a + total_three_pt_sfd - total_three_pt_and1

    two_pt_sfd_pct = (total_two_pt_sfd / two_pt_denom) if two_pt_denom > 0 else 0.0
    three_pt_sfd_pct = (total_three_pt_sfd / three_pt_denom) if three_pt_denom > 0 else 0.0

    return {
        "season": filepath.stem,
        "fg2a_per100": round(fg2a_per100, 6),
        "fg3a_per100": round(fg3a_per100, 6),
        "two_pt_sfd_pct": round(two_pt_sfd_pct, 6),
        "three_pt_sfd_pct": round(three_pt_sfd_pct, 6),
    }


def main() -> None:
    files = sorted(DATA_DIR.glob("*.csv"), key=season_sort_key)
    if not files:
        raise RuntimeError(f"No season files matching *.csv found in {DATA_DIR}")

    rows = [aggregate_file(path) for path in files]

    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_PATH.write_text(json.dumps(rows, indent=2), encoding="utf-8")
    print(f"Wrote {len(rows)} seasons to {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
