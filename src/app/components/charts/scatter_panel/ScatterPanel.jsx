import { useMemo, useState } from "react";
import * as d3 from "d3";
import scatterRows from "../../../data/season_scoring_scatter.json";
import "./ScatterPanel.css";

const MINI_WIDTH = 220;
const MINI_HEIGHT = 198;
const MINI_MARGIN = { top: 18, right: 14, bottom: 44, left: 44 };
const EXPANDED_WIDTH = 980;
const EXPANDED_HEIGHT = 640;
const EXPANDED_MARGIN = { top: 26, right: 24, bottom: 64, left: 68 };

const TREND_WIDTH = 1020;
const TREND_HEIGHT = 220;
const TREND_MARGIN = { top: 18, right: 24, bottom: 44, left: 52 };

const METRICS = [
  { key: "fg2a_per100", label: "2FGA / 100 Player Min" },
  { key: "fg3a_per100", label: "3FGA / 100 Player Min" },
  { key: "fta_per100", label: "FTA / 100 Player Min" },
  { key: "two_pt_shooting_fouls_drawn_pct", label: "2PT SFD Rate" },
  { key: "three_pt_shooting_fouls_drawn_pct", label: "3PT SFD Rate" },
];

const INITIAL_TOP_SCORERS = 100;
const INITIAL_X_METRIC = "fg3a_per100";
const INITIAL_Y_METRIC = "two_pt_shooting_fouls_drawn_pct";
const INITIAL_X_THRESHOLD = 14;
const INITIAL_Y_THRESHOLD = 0.05;

function getRobustAxisMax(players, metricKey) {
  const values = players
    .map((player) => Number(player?.[metricKey]))
    .filter((value) => Number.isFinite(value))
    .sort((a, b) => a - b);

  if (!values.length) return 0.5;

  const rawMax = values[values.length - 1];
  if (metricKey !== "three_pt_shooting_fouls_drawn_pct") {
    return Math.max(0.5, rawMax * 1.1);
  }

  const q1 = d3.quantileSorted(values, 0.25) ?? values[0];
  const q3 = d3.quantileSorted(values, 0.75) ?? rawMax;
  const iqr = Math.max(0, q3 - q1);
  const upperFence = q3 + iqr * 1.5;
  const p98 = d3.quantileSorted(values, 0.98) ?? rawMax;
  const cap = Math.min(upperFence, p98);
  const trimmedMax = d3.max(values.filter((value) => value <= cap));
  const effectiveMax = Number.isFinite(trimmedMax) ? trimmedMax : Math.min(rawMax, cap);
  return Math.max(0.5, effectiveMax * 1.1);
}

function ScatterPanel() {
  const [topX, setTopX] = useState(INITIAL_TOP_SCORERS);
  const [xMetric, setXMetric] = useState(INITIAL_X_METRIC);
  const [yMetric, setYMetric] = useState(INITIAL_Y_METRIC);
  const [xThreshold, setXThreshold] = useState(INITIAL_X_THRESHOLD);
  const [yThreshold, setYThreshold] = useState(INITIAL_Y_THRESHOLD);
  const [expandedSeasonKey, setExpandedSeasonKey] = useState(null);
  const [hovered, setHovered] = useState(null);

  const seasons = useMemo(() => (Array.isArray(scatterRows?.seasons) ? scatterRows.seasons : []), []);
  const prepared = useMemo(
    () =>
      seasons.map((season) => ({
        season: season.season,
        players: (season.players || []).slice(0, topX),
      })),
    [seasons, topX],
  );

  const allPlayers = useMemo(() => prepared.flatMap((season) => season.players), [prepared]);
  const xMax = useMemo(() => getRobustAxisMax(allPlayers, xMetric), [allPlayers, xMetric]);
  const yMax = useMemo(() => getRobustAxisMax(allPlayers, yMetric), [allPlayers, yMetric]);
  const pointsMax = useMemo(() => Math.max(1, d3.max(allPlayers, (d) => +d.points || 0) || 1), [allPlayers]);

  const colorScale = useMemo(
    () => d3.scaleSequential(d3.interpolateTurbo).domain([0, pointsMax]),
    [pointsMax],
  );

  const isInHighRegion = (player) =>
    (+player[xMetric] || 0) >= xThreshold && (+player[yMetric] || 0) >= yThreshold;

  const seasonCounts = useMemo(
    () =>
      prepared.map((season) => {
        const count = season.players.filter((d) => isInHighRegion(d)).length;
        return { season: season.season, value: count };
      }),
    [prepared, xMetric, yMetric, xThreshold, yThreshold],
  );

  const trendX = useMemo(
    () => d3.scalePoint().domain(seasonCounts.map((d) => d.season)).range([TREND_MARGIN.left, TREND_WIDTH - TREND_MARGIN.right]),
    [seasonCounts],
  );
  const trendYMax = useMemo(() => Math.max(1, d3.max(seasonCounts, (d) => d.value) || 1), [seasonCounts]);
  const trendY = useMemo(
    () => d3.scaleLinear().domain([0, trendYMax]).nice().range([TREND_HEIGHT - TREND_MARGIN.bottom, TREND_MARGIN.top]),
    [trendYMax],
  );
  const trendPath = useMemo(() => {
    const line = d3.line().x((d) => trendX(d.season)).y((d) => trendY(d.value)).curve(d3.curveMonotoneX);
    return line(seasonCounts) || "";
  }, [seasonCounts, trendX, trendY]);
  const trendYTicks = useMemo(() => trendY.ticks(5), [trendY]);

  const xMetricLabel = METRICS.find((m) => m.key === xMetric)?.label ?? xMetric;
  const yMetricLabel = METRICS.find((m) => m.key === yMetric)?.label ?? yMetric;

  const expandedSeason = useMemo(
    () => prepared.find((season) => season.season === expandedSeasonKey) ?? null,
    [prepared, expandedSeasonKey],
  );

  const renderSeasonPlot = (season, opts) => {
    const { width, height, margin, interactive, showAxisLabels } = opts;
    const xScale = d3.scaleLinear().domain([0, xMax]).range([margin.left, width - margin.right]);
    const yScale = d3.scaleLinear().domain([0, yMax]).range([height - margin.bottom, margin.top]);
    const highCount = season.players.filter(isInHighRegion).length;

    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="scatter-mini-svg">
        <rect
          x={xScale(xThreshold)}
          y={margin.top}
          width={Math.max(0, width - margin.right - xScale(xThreshold))}
          height={Math.max(0, yScale(yThreshold) - margin.top)}
          className="scatter-high-region"
        />
        <line x1={xScale(xThreshold)} x2={xScale(xThreshold)} y1={margin.top} y2={height - margin.bottom} className="scatter-threshold-line" />
        <line x1={margin.left} x2={width - margin.right} y1={yScale(yThreshold)} y2={yScale(yThreshold)} className="scatter-threshold-line" />

        <line x1={margin.left} x2={width - margin.right} y1={height - margin.bottom} y2={height - margin.bottom} className="scatter-axis" />
        <line x1={margin.left} x2={margin.left} y1={height - margin.bottom} y2={margin.top} className="scatter-axis" />

        {xScale.ticks(4).map((tick) => (
          <g key={`${season.season}-x-${tick}`}>
            <line x1={xScale(tick)} x2={xScale(tick)} y1={height - margin.bottom} y2={height - margin.bottom + 4} className="scatter-tick-line" />
            <text x={xScale(tick)} y={height - margin.bottom + 15} textAnchor="middle" className="scatter-tick-text">
              {tick.toFixed(1)}
            </text>
          </g>
        ))}
        {yScale.ticks(4).map((tick) => (
          <g key={`${season.season}-y-${tick}`}>
            <line x1={margin.left - 4} x2={margin.left} y1={yScale(tick)} y2={yScale(tick)} className="scatter-tick-line" />
            <text x={margin.left - 7} y={yScale(tick) + 3} textAnchor="end" className="scatter-tick-text">
              {tick.toFixed(1)}
            </text>
          </g>
        ))}

        {season.players.map((player, i) => {
          const inHigh = isInHighRegion(player);
          return (
            <circle
              key={`${season.season}-${player.name}-${i}`}
              cx={xScale(+player[xMetric] || 0)}
              cy={yScale(+player[yMetric] || 0)}
              r={inHigh ? 3.9 : interactive ? 3.4 : 3}
              fill={inHigh ? "#f97316" : "#52525b"}
              opacity={inHigh ? 1 : 0.33}
              onMouseMove={
                interactive
                  ? (event) =>
                      setHovered({
                        x: event.clientX + 12,
                        y: event.clientY + 12,
                        player,
                        season: season.season,
                      })
                  : undefined
              }
              onMouseLeave={interactive ? () => setHovered(null) : undefined}
            />
          );
        })}

        <text x={width - 8} y={margin.top + 10} textAnchor="end" className="scatter-mini-count">
          High-High: {highCount}
        </text>

        {showAxisLabels && (
          <>
            <text
              x={(margin.left + width - margin.right) / 2}
              y={height - 5}
              textAnchor="middle"
              className="scatter-axis-label"
            >
              {xMetricLabel}
            </text>
            <text
              transform={`translate(11 ${(margin.top + height - margin.bottom) / 2}) rotate(-90)`}
              textAnchor="middle"
              className="scatter-axis-label"
            >
              {yMetricLabel}
            </text>
          </>
        )}
      </svg>
    );
  };

  if (!seasons.length) {
    return null;
  }

  return (
    <section className="scatter-story-section border-t border-zinc-900">
      <div className="scatter-story-inner">
        {/* <h3 className="scatter-story-title">Who Actually Lives In The High-FTA Zone?</h3>
        <p className="scatter-story-subtitle">
          Explore top scorers by season and compare shot profile vs free throw attempts. The red region marks players above both selected thresholds.
        </p> */}

        <div className="scatter-controls-grid">
          <label>
            Top scorers per season: <strong>{topX}</strong>
            <input type="range" min="10" max="200" step="1" value={topX} onChange={(e) => setTopX(Number(e.target.value))} />
          </label>

          <label>
            X metric
            <select value={xMetric} onChange={(e) => setXMetric(e.target.value)}>
              {METRICS.map((m) => (
                <option key={m.key} value={m.key}>
                  {m.label}
                </option>
              ))}
            </select>
          </label>

          <label>
            Y metric
            <select value={yMetric} onChange={(e) => setYMetric(e.target.value)}>
              {METRICS.map((m) => (
                <option key={m.key} value={m.key}>
                  {m.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="scatter-controls-grid scatter-controls-grid-thresholds">
          <label>
            Threshold for {xMetricLabel}: <strong>{xThreshold.toFixed(2)}</strong>
            <input type="range" min="0" max={xMax} step="0.01" value={xThreshold} onChange={(e) => setXThreshold(Number(e.target.value))} />
          </label>
          <label>
            Threshold for {yMetricLabel}: <strong>{yThreshold.toFixed(2)}</strong>
            <input type="range" min="0" max={yMax} step="0.01" value={yThreshold} onChange={(e) => setYThreshold(Number(e.target.value))} />
          </label>
        </div>

        <p className="scatter-grid-hint">All seasons are shown below. Click any mini scatterplot to drill down.</p>
        <div className="scatter-grid">
          {prepared.map((season) => (
            <article key={season.season} className="scatter-mini-card" onClick={() => setExpandedSeasonKey(season.season)}>
              <header className="scatter-mini-header">
                <span>{season.season}</span>
              </header>
              {renderSeasonPlot(season, {
                width: MINI_WIDTH,
                height: MINI_HEIGHT,
                margin: MINI_MARGIN,
                interactive: false,
                showAxisLabels: false,
              })}
            </article>
          ))}
        </div>

        <div className="scatter-trend-card">
          <h4>
            High-{xMetricLabel} + High-{yMetricLabel} Count Across Seasons
          </h4>
          <svg viewBox={`0 0 ${TREND_WIDTH} ${TREND_HEIGHT}`} className="scatter-trend-svg">
            <line x1={TREND_MARGIN.left} x2={TREND_WIDTH - TREND_MARGIN.right} y1={TREND_HEIGHT - TREND_MARGIN.bottom} y2={TREND_HEIGHT - TREND_MARGIN.bottom} className="scatter-axis" />
            <line x1={TREND_MARGIN.left} x2={TREND_MARGIN.left} y1={TREND_HEIGHT - TREND_MARGIN.bottom} y2={TREND_MARGIN.top} className="scatter-axis" />

            {trendYTicks.map((tick) => (
              <g key={`trend-y-${tick}`}>
                <line
                  x1={TREND_MARGIN.left}
                  x2={TREND_WIDTH - TREND_MARGIN.right}
                  y1={trendY(tick)}
                  y2={trendY(tick)}
                  className="scatter-trend-grid"
                />
                <text
                  x={TREND_MARGIN.left - 7}
                  y={trendY(tick) + 4}
                  textAnchor="end"
                  className="scatter-tick-text"
                >
                  {tick}
                </text>
              </g>
            ))}

            <path d={trendPath} className="scatter-trend-line" />
            {seasonCounts.map((d) => (
              <g key={`trend-${d.season}`}>
                <circle cx={trendX(d.season)} cy={trendY(d.value)} r="3.5" className="scatter-trend-point" />
                <text x={trendX(d.season)} y={TREND_HEIGHT - TREND_MARGIN.bottom + 13} textAnchor="middle" className="scatter-trend-season">
                  {d.season}
                </text>
              </g>
            ))}

            <text
              x={(TREND_MARGIN.left + TREND_WIDTH - TREND_MARGIN.right) / 2}
              y={TREND_HEIGHT - 8}
              textAnchor="middle"
              className="scatter-axis-label"
            >
              Season
            </text>
          </svg>
        </div>
      </div>

      {expandedSeason && (
        <div className="scatter-modal-backdrop" onClick={() => setExpandedSeasonKey(null)}>
          <div className="scatter-modal" onClick={(event) => event.stopPropagation()}>
            <div className="scatter-modal-header">
              <h4>{expandedSeason.season} Drill Down</h4>
              <button type="button" onClick={() => setExpandedSeasonKey(null)}>
                Close
              </button>
            </div>
            <div className="scatter-modal-body">
              {renderSeasonPlot(expandedSeason, {
                width: EXPANDED_WIDTH,
                height: EXPANDED_HEIGHT,
                margin: EXPANDED_MARGIN,
                interactive: true,
                showAxisLabels: true,
              })}
              <div className="scatter-expanded-axis-labels">
                <span>{xMetricLabel}</span>
                <span>{yMetricLabel}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {hovered && (
        <div className="scatter-hover-tooltip" style={{ left: hovered.x, top: hovered.y }}>
          <div>
            <strong>{hovered.player.name}</strong> {hovered.season ? `(${hovered.season})` : ""}
          </div>
          <div>PPG: {(Number(hovered.player.ppg) || 0).toFixed(1)}</div>
          <div>FTA/100: {(Number(hovered.player.fta_per100) || 0).toFixed(2)}</div>
          <div>2FGA/100: {(Number(hovered.player.fg2a_per100) || 0).toFixed(2)}</div>
          <div>3FGA/100: {(Number(hovered.player.fg3a_per100) || 0).toFixed(2)}</div>
          <div>2PT SFD Rate: {((Number(hovered.player.two_pt_shooting_fouls_drawn_pct) || 0) * 100).toFixed(1)}%</div>
          <div>3PT SFD Rate: {((Number(hovered.player.three_pt_shooting_fouls_drawn_pct) || 0) * 100).toFixed(1)}%</div>
        </div>
      )}
    </section>
  );
}

export { ScatterPanel };
