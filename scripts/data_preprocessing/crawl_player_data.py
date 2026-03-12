"""
Crawl player totals from PBP Stats API (get-totals endpoint).

Uses: https://api.pbpstats.com/get-totals/nba

Output: CSV files under data/ folder, one per season.
"""

from __future__ import annotations

import csv
import json
import subprocess
import time
from pathlib import Path

BASE_URL = "https://api.pbpstats.com/get-totals/nba"
PROJECT_ROOT = Path(__file__).resolve().parents[2]
OUTPUT_DIR = PROJECT_ROOT / "data"
YEAR_RANGE = list(range(96, 99)) + list(range(0, 25))


def season_yy_to_api(short: str) -> str:
    """Convert YY_YY -> YYYY-YY. Supports pre-2000 and post-2000 seasons."""
    start_yy, end_yy = short.split("_")
    start_yy = int(start_yy)
    end_yy = int(end_yy)
    start_full = 1900 + start_yy if start_yy >= 50 else 2000 + start_yy
    return f"{start_full}-{end_yy:02d}"


def season_api_to_filename(api_season: str) -> str:
    """Convert 1996-97 -> 96_97.csv, 2002-03 -> 02_03.csv."""
    start, end = api_season.split("-")
    short_start = start[-2:]
    return f"{int(short_start):02d}_{int(end):02d}.csv"


def fetch_season(api_season: str) -> list[dict]:
    """Fetch player totals for one NBA season from PBP Stats API."""
    url = f"{BASE_URL}?Season={api_season}&SeasonType=All&Type=Player"
    result = subprocess.run(
        ["curl", "-s", "-L", url],
        capture_output=True,
        text=True,
        timeout=60,
        check=False,
    )
    if result.returncode != 0:
        raise RuntimeError(f"curl failed: {result.stderr or result.stdout}")
    data = json.loads(result.stdout)
    return data.get("multi_row_table_data") or []


def get_all_columns(rows: list[dict]) -> list[str]:
    """Collect all column names from rows, preserving first-row order."""
    all_keys = set()
    for row in rows:
        all_keys.update(row.keys())
    first_keys = list(rows[0].keys()) if rows else []
    extra = sorted(all_keys - set(first_keys))
    return first_keys + extra


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    seasons_short = []
    for start in YEAR_RANGE:
        end = (start + 1) % 100
        seasons_short.append(f"{start:02d}_{end:02d}")

    print(f"Crawling {len(seasons_short)} seasons from PBP Stats API...")
    success = 0
    failed: list[tuple[str, str]] = []

    for short in seasons_short:
        api_season = season_yy_to_api(short)
        filename = season_api_to_filename(api_season)
        out_path = OUTPUT_DIR / filename

        try:
            rows = fetch_season(api_season)
            if not rows:
                print(f"  {short}: no data")
                failed.append((short, "no data"))
                continue

            columns = get_all_columns(rows)
            clean_rows = [{k: ("" if v is None else v) for k, v in r.items()} for r in rows]
            with out_path.open("w", newline="", encoding="utf-8") as file_obj:
                writer = csv.DictWriter(file_obj, fieldnames=columns, extrasaction="ignore", restval="")
                writer.writeheader()
                writer.writerows(clean_rows)

            print(f"  {short}: {len(rows)} rows, {len(columns)} cols -> {out_path}")
            success += 1
        except Exception as exc:
            print(f"  {short}: {exc}")
            failed.append((short, str(exc)))

        time.sleep(2)

    print(f"\nDone: {success} seasons saved to {OUTPUT_DIR}")
    if failed:
        print(f"Failed: {len(failed)} - {failed}")


if __name__ == "__main__":
    main()
