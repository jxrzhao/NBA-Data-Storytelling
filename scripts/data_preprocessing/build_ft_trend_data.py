"""
Build season-level FT trend metrics from data/*.csv:
  - FTA per 100 player-minutes = sum(FTA) / sum(Minutes) * 100
  - FTM per 100 player-minutes = sum(FtPoints) / sum(Minutes) * 100
  - FT% = sum(FtPoints) / sum(FTA)

Output:
  src/app/data/season_ft_trend.json
"""

from __future__ import annotations

import csv
import json
from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parents[2]
DATA_DIR = PROJECT_ROOT / "data"
OUTPUT_PATH = PROJECT_ROOT / "src" / "app" / "data" / "season_ft_trend.json"

FTA = "FTA"
FT_POINTS = "FtPoints"
MINUTES = "Minutes"


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
    total_fta = 0.0
    total_ft_points = 0.0
    total_minutes = 0.0

    with filepath.open(newline="", encoding="utf-8") as file_obj:
        reader = csv.DictReader(file_obj)
        for row in reader:
            total_fta += parse_number(row.get(FTA))
            total_ft_points += parse_number(row.get(FT_POINTS))
            total_minutes += parse_number(row.get(MINUTES))

    if total_minutes <= 0:
        fta_per100 = 0.0
        ftm_per100 = 0.0
    else:
        scale = 100.0 / total_minutes
        fta_per100 = total_fta * scale
        ftm_per100 = total_ft_points * scale

    ft_pct = (total_ft_points / total_fta) if total_fta > 0 else 0.0

    return {
        "season": filepath.stem,
        "fta_per100": round(fta_per100, 6),
        "ftm_per100": round(ftm_per100, 6),
        "ft_pct": round(ft_pct, 6),
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
