"""
Run the complete data pipeline:
1) Crawl data into data/*.csv
2) Build all processed JSON files in src/app/data/
"""

from __future__ import annotations

import subprocess
import sys
from pathlib import Path


SCRIPT_DIR = Path(__file__).resolve().parent

PIPELINE = [
    # "crawl_player_data.py",
    "build_ft_trend_data.py",
    "build_streamgraph_data.py",
    "build_fga_sfd_data.py",
    "build_scatter_panel_data.py",
]


def run_script(script_name: str) -> None:
    script_path = SCRIPT_DIR / script_name
    print(f"\n=== Running {script_name} ===")
    subprocess.run([sys.executable, str(script_path)], check=True)


def main() -> None:
    for script_name in PIPELINE:
        run_script(script_name)
    print("\nPipeline complete.")


if __name__ == "__main__":
    main()
