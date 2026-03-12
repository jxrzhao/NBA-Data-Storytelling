# Free Throw Analysis (figma)

This app uses Python data scripts to crawl and preprocess season data before running the Vite frontend.

## Setup and Run

Run these commands in order from `figma/`:

```bash
# 1) Crawl + process all data outputs
python3 scripts/data_preprocessing/run_all_preprocessing.py

# 2) Install frontend dependencies
npm install

# 3) Start the app
npm run start
```

## Data Scripts

All preprocessing scripts are in `scripts/data_preprocessing/`:

- `crawl_player_data.py`
- `build_ft_trend_data.py`
- `build_streamgraph_data.py`
- `build_fga_sfd_data.py`
- `build_scatter_panel_data.py`
- `run_all_preprocessing.py`

<!-- You can also run the full data pipeline via npm:

```bash
npm run data:process
``` -->
