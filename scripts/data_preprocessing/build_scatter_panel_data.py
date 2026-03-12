"""
Build season-level player scatter data for:
  - 2FGA per 100 player-minutes = (FG2A / Minutes) * 100
  - 3FGA per 100 player-minutes = (FG3A / Minutes) * 100
  - FTA per 100 player-minutes = (FTA / Minutes) * 100
  - 2pt shooting fouls drawn percent
  - 3pt shooting fouls drawn percent

Output file:
  src/app/data/season_scoring_scatter.json
"""

from __future__ import annotations

import csv
import json
from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parents[2]
RAW_DATA_DIR = PROJECT_ROOT / "data"
OUTPUT_PATH = PROJECT_ROOT / "src" / "app" / "data" / "season_scoring_scatter.json"

NAME = "Name"
POINTS = "Points"
ASSISTS = "Assists"
REBOUNDS = "Rebounds"
PLUS_MINUS = "PlusMinus"
GAMES_PLAYED = "GamesPlayed"
FG2A = "FG2A"
FG3A = "FG3A"
FTA = "FTA"
MINUTES = "Minutes"
TWO_PT_SHOOTING_FOULS_DRAWN_PCT = "TwoPtShootingFoulsDrawnPct"
THREE_PT_SHOOTING_FOULS_DRAWN_PCT = "ThreePtShootingFoulsDrawnPct"


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


def aggregate_file(filepath: Path) -> dict[str, object]:
    players = []
    with filepath.open(newline="", encoding="utf-8") as file_obj:
        reader = csv.DictReader(file_obj)
        for row in reader:
            minutes = parse_number(row.get(MINUTES))
            games_played = parse_number(row.get(GAMES_PLAYED))
            if minutes <= 0:
                continue

            points = parse_number(row.get(POINTS))
            assists = parse_number(row.get(ASSISTS))
            rebounds = parse_number(row.get(REBOUNDS))
            plus_minus = parse_number(row.get(PLUS_MINUS))
            fg2a = parse_number(row.get(FG2A))
            fg3a = parse_number(row.get(FG3A))
            fta = parse_number(row.get(FTA))

            players.append(
                {
                    "name": row.get(NAME, "").strip(),
                    "points": round(points, 6),
                    "assists": round(assists, 6),
                    "rebounds": round(rebounds, 6),
                    "plus_minus": round(plus_minus, 6),
                    "games_played": round(games_played, 6),
                    "ppg": round(points / games_played if games_played > 0 else 0.0, 6),
                    "apg": round(assists / games_played if games_played > 0 else 0.0, 6),
                    "rpg": round(rebounds / games_played if games_played > 0 else 0.0, 6),
                    "fg2a_per100": round((fg2a / minutes) * 100, 6),
                    "fg3a_per100": round((fg3a / minutes) * 100, 6),
                    "fta_per100": round((fta / minutes) * 100, 6),
                    "two_pt_shooting_fouls_drawn_pct": round(parse_number(row.get(TWO_PT_SHOOTING_FOULS_DRAWN_PCT)), 6),
                    "three_pt_shooting_fouls_drawn_pct": round(parse_number(row.get(THREE_PT_SHOOTING_FOULS_DRAWN_PCT)), 6),
                }
            )

    players.sort(key=lambda d: d["points"], reverse=True)
    return {"season": filepath.stem, "players": players}


def main() -> None:
    files = sorted(RAW_DATA_DIR.glob("*.csv"), key=season_sort_key)
    if not files:
        raise RuntimeError(f"No season files matching *.csv found in {RAW_DATA_DIR}")

    rows = [aggregate_file(path) for path in files]
    output = {"seasons": rows}

    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_PATH.write_text(json.dumps(output), encoding="utf-8")
    print(f"Wrote {len(rows)} seasons to {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
