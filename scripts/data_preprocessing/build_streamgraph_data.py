"""
Build season-level free throw type rates per 100 player-minutes.

Input directory:
  data/*.csv

Output file:
  src/app/data/season_ft_types_per100.json
"""

import csv
import json
from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parents[2]
DATA_DIR = PROJECT_ROOT / "data"
OUTPUT_PATH = PROJECT_ROOT / "src" / "app" / "data" / "season_ft_types_per100.json"

TECH_FTA = "Technical Free Throw Trips"
TWO_PT_SFD = "TwoPtShootingFoulsDrawn"
TWO_PT_AND1 = "2pt And 1 Free Throw Trips"
THREE_PT_SFD = "ThreePtShootingFoulsDrawn"
THREE_PT_AND1 = "3pt And 1 Free Throw Trips"
NON_SHOOTING = "NonShootingFoulsDrawn"
MINUTES = "Minutes"


def parse_number(value: str) -> float:
    """Parse CSV numeric values safely."""
    if value is None:
        return 0.0
    text = str(value).strip()
    if text == "":
        return 0.0
    return float(text)


def season_sort_key(path: Path) -> tuple[int, int]:
    """
    Sort season filenames like 96_97.csv or 02_03.csv by start/end year.
    Converts YY to full year: 96->1996, 00->2000.
    """
    season_part = path.stem
    start, end = season_part.split("_")
    s, e = int(start), int(end)

    def to_full_year(yy: int) -> int:
        return 1900 + yy if yy >= 50 else 2000 + yy

    return (to_full_year(s), to_full_year(e))


def aggregate_file(filepath: Path) -> dict:
    total_minutes = 0.0
    total_tech = 0.0
    total_two = 0.0
    total_three = 0.0
    total_non = 0.0

    with open(filepath, newline="", encoding="utf-8") as file_obj:
        reader = csv.DictReader(file_obj)
        for row in reader:
            minutes = parse_number(row.get(MINUTES, "0"))
            tech = parse_number(row.get(TECH_FTA, "0"))
            sfd_2pt = parse_number(row.get(TWO_PT_SFD, "0"))
            and1_2pt = parse_number(row.get(TWO_PT_AND1, "0"))
            sfd_3pt = parse_number(row.get(THREE_PT_SFD, "0"))
            and1_3pt = parse_number(row.get(THREE_PT_AND1, "0"))
            non_shooting = parse_number(row.get(NON_SHOOTING, "0"))

            two_point_fta = (sfd_2pt - and1_2pt) * 2 + and1_2pt
            three_point_fta = (sfd_3pt - and1_3pt) * 3 + and1_3pt
            non_shooting_fta = 2 * non_shooting

            total_minutes += minutes
            total_tech += tech
            total_two += two_point_fta
            total_three += three_point_fta
            total_non += non_shooting_fta

    if total_minutes == 0:
        return {
            "season": filepath.stem,
            "technical_fta_per100": 0.0,
            "two_point_fta_per100": 0.0,
            "three_point_fta_per100": 0.0,
            "non_shooting_fta_per100": 0.0,
        }

    scale = 100.0 / total_minutes
    return {
        "season": filepath.stem,
        "technical_fta_per100": round(total_tech * scale, 6),
        "two_point_fta_per100": round(total_two * scale, 6),
        "three_point_fta_per100": round(total_three * scale, 6),
        "non_shooting_fta_per100": round(total_non * scale, 6),
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
