import { useEffect, useMemo, useRef, useState } from "react";
import * as d3 from "d3";
import metricRows from "../../../data/season_fga_sfd_metrics.json";
import "./FgaSfdLineChart.css";
import { NARRATIVE_STAGES, getNarrativeMessage, getNarrativeStage } from "./narrative/narrativeConfig";

const CHART_WIDTH = 520;
const CHART_HEIGHT = 280;
const MARGIN = { top: 20, right: 16, bottom: 52, left: 52 };
const ERA_START_SEASON = "14-15";

function normalizeSeasonLabel(season) {
  return String(season || "").replace("_", "-");
}

function findEraStartSeason(data) {
  const normalizedTarget = normalizeSeasonLabel(ERA_START_SEASON);
  const exactMatch = data.find((row) => normalizeSeasonLabel(row.season) === normalizedTarget);
  if (exactMatch) return exactMatch.season;

  const targetSuffix = `-${normalizedTarget.split("-")[1]}`;
  const suffixMatch = data.find((row) => normalizeSeasonLabel(row.season).endsWith(targetSuffix));
  return suffixMatch?.season ?? null;
}

const METRIC_META = [
  {
    key: "fg2aPer100",
    title: "2PT FGA / 100 Player Min",
    color: "#38bdf8",
    format: (value) => value.toFixed(2),
    axisLabel: "Attempts",
  },
  {
    key: "fg3aPer100",
    title: "3PT FGA / 100 Player Min",
    color: "#22c55e",
    format: (value) => value.toFixed(2),
    axisLabel: "Attempts",
  },
  {
    key: "twoPtSfdPct",
    title: "2PT SFD Percent",
    color: "#f59e0b",
    format: (value) => `${value.toFixed(2)}%`,
    axisLabel: "Percent",
  },
  {
    key: "threePtSfdPct",
    title: "3PT SFD Rate",
    color: "#ef4444",
    format: (value) => `${value.toFixed(2)}%`,
    axisLabel: "Percent",
  },
];

const chartData = metricRows.map((row) => ({
  season: String(row.season).replace("_", "-"),
  fg2aPer100: Number(row.fg2a_per100) || 0,
  fg3aPer100: Number(row.fg3a_per100) || 0,
  twoPtSfdPct: (Number(row.two_pt_sfd_pct) || 0) * 100,
  threePtSfdPct: (Number(row.three_pt_sfd_pct) || 0) * 100,
}));

function getSeasonTicks(data) {
  const total = data.length;
  if (total <= 6) return data.map((d) => d.season);
  const tickCount = 6;
  return Array.from(
    new Set(
      Array.from({ length: tickCount }, (_, index) => {
        const pointIndex = Math.round((index * (total - 1)) / (tickCount - 1));
        return data[pointIndex]?.season;
      }).filter(Boolean),
    ),
  );
}

function MetricLineChart({ data, metric, x, seasonTicks, hoveredSeason, onHoverSeason, showEraShade }) {
  const values = useMemo(() => data.map((row) => row[metric.key]), [data, metric.key]);
  const maxValue = d3.max(values) ?? 1;
  const minValue = d3.min(values) ?? 0;
  const domainPadding = Math.max((maxValue - minValue) * 0.12, maxValue * 0.04, 0.1);
  const y = useMemo(
    () =>
      d3
        .scaleLinear()
        .domain([Math.max(0, minValue - domainPadding), maxValue + domainPadding])
        .nice()
        .range([CHART_HEIGHT - MARGIN.bottom, MARGIN.top]),
    [minValue, maxValue, domainPadding],
  );

  const yTicks = useMemo(() => y.ticks(5), [y]);
  const xPositions = useMemo(
    () => data.map((row) => ({ season: row.season, x: x(row.season) })),
    [data, x],
  );

  const linePath = useMemo(() => {
    const line = d3
      .line()
      .x((row) => x(row.season))
      .y((row) => y(row[metric.key]))
      .curve(d3.curveCatmullRom.alpha(0.5));
    return line(data) || "";
  }, [data, metric.key, x, y]);

  const hoveredPoint = hoveredSeason ? data.find((row) => row.season === hoveredSeason) : null;
  const eraStartSeason = findEraStartSeason(data);
  const eraStartX = eraStartSeason ? x(eraStartSeason) : undefined;
  const hasEraBoundary = Number.isFinite(eraStartX);
  const eraShadeWidth = hasEraBoundary ? CHART_WIDTH - MARGIN.right - eraStartX : 0;
  const eraLabelX = hasEraBoundary ? Math.min(eraStartX + 10, CHART_WIDTH - MARGIN.right - 10) : 0;
  const tooltipWidth = 172;
  const tooltipHeight = 46;
  const tooltipOffset = 10;
  const tooltipAnchorX = hoveredPoint ? x(hoveredPoint.season) : 0;
  const tooltipAnchorY = hoveredPoint ? y(hoveredPoint[metric.key]) : 0;
  const clampedTooltipX = hoveredPoint
    ? Math.max(
      MARGIN.left + 2,
      Math.min(tooltipAnchorX + tooltipOffset, CHART_WIDTH - MARGIN.right - tooltipWidth - 2),
      )
    : 0;
  const clampedTooltipY = hoveredPoint
    ? Math.max(
      MARGIN.top + 2,
      Math.min(tooltipAnchorY - tooltipHeight - tooltipOffset, CHART_HEIGHT - MARGIN.bottom - tooltipHeight - 2),
      )
    : 0;

  return (
    <div className="fga-sfd-mini-chart">
      <h4 className="fga-sfd-mini-title">{metric.title}</h4>
      <svg viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`} className="fga-sfd-svg">
        {showEraShade && hasEraBoundary && (
          <>
            <rect
              x={eraStartX}
              y={MARGIN.top}
              width={Math.max(0, eraShadeWidth)}
              height={CHART_HEIGHT - MARGIN.top - MARGIN.bottom}
              className="fga-sfd-era-shade"
            />
            <line
              x1={eraStartX}
              x2={eraStartX}
              y1={MARGIN.top}
              y2={CHART_HEIGHT - MARGIN.bottom}
              className="fga-sfd-era-boundary"
            />
            <text x={eraLabelX} y={MARGIN.top + 14} textAnchor="start" className="fga-sfd-era-label">
              After 14-15: three point era
            </text>
          </>
        )}

        {yTicks.map((tick) => (
          <g key={`${metric.key}-y-${tick}`}>
            <line x1={MARGIN.left} x2={CHART_WIDTH - MARGIN.right} y1={y(tick)} y2={y(tick)} className="fga-sfd-grid-line" />
            <text x={MARGIN.left - 8} y={y(tick) + 4} textAnchor="end" className="fga-sfd-tick">
              {metric.axisLabel === "Percent" ? `${tick.toFixed(1)}%` : tick.toFixed(1)}
            </text>
          </g>
        ))}

        <line x1={MARGIN.left} x2={CHART_WIDTH - MARGIN.right} y1={CHART_HEIGHT - MARGIN.bottom} y2={CHART_HEIGHT - MARGIN.bottom} className="fga-sfd-axis" />
        <line x1={MARGIN.left} x2={MARGIN.left} y1={CHART_HEIGHT - MARGIN.bottom} y2={MARGIN.top} className="fga-sfd-axis" />

        {seasonTicks.map((season) => (
          <g key={`${metric.key}-x-${season}`}>
            <line x1={x(season)} x2={x(season)} y1={CHART_HEIGHT - MARGIN.bottom} y2={CHART_HEIGHT - MARGIN.bottom + 6} className="fga-sfd-axis" />
            <text x={x(season)} y={CHART_HEIGHT - MARGIN.bottom + 20} textAnchor="middle" className="fga-sfd-tick">
              {season}
            </text>
          </g>
        ))}

        <path d={linePath} className="fga-sfd-line" style={{ stroke: metric.color }} />

        {data.map((row) => (
          <circle key={`${metric.key}-point-${row.season}`} cx={x(row.season)} cy={y(row[metric.key])} r="3.5" className="fga-sfd-point" style={{ stroke: metric.color }} />
        ))}

        {hoveredPoint && (
          <g pointerEvents="none">
            <line x1={x(hoveredPoint.season)} x2={x(hoveredPoint.season)} y1={MARGIN.top} y2={CHART_HEIGHT - MARGIN.bottom} className="fga-sfd-hover-line" />
            <circle cx={x(hoveredPoint.season)} cy={y(hoveredPoint[metric.key])} r="5" className="fga-sfd-hover-point" style={{ stroke: metric.color }} />
          </g>
        )}

        {hoveredPoint && (
          <g className="fga-sfd-inline-tooltip" pointerEvents="none" transform={`translate(${clampedTooltipX}, ${clampedTooltipY})`}>
            <rect width={tooltipWidth} height={tooltipHeight} rx="6" ry="6" className="fga-sfd-inline-tooltip-box" />
            <text x="10" y="18" className="fga-sfd-inline-tooltip-season">{hoveredPoint.season}</text>
            <text x="10" y="35" className="fga-sfd-inline-tooltip-value" style={{ fill: metric.color }}>
              {metric.format(hoveredPoint[metric.key])}
            </text>
          </g>
        )}

        <rect
          x={MARGIN.left}
          y={MARGIN.top}
          width={CHART_WIDTH - MARGIN.left - MARGIN.right}
          height={CHART_HEIGHT - MARGIN.top - MARGIN.bottom}
          fill="transparent"
          onMouseLeave={() => {
            onHoverSeason(null);
          }}
          onMouseMove={(event) => {
            const svgRect = event.currentTarget.ownerSVGElement.getBoundingClientRect();
            const relativeX = ((event.clientX - svgRect.left) / svgRect.width) * CHART_WIDTH;
            let closestSeason = null;
            let minDistance = Infinity;
            xPositions.forEach((point) => {
              const distance = Math.abs(point.x - relativeX);
              if (distance < minDistance) {
                minDistance = distance;
                closestSeason = point.season;
              }
            });
            onHoverSeason(closestSeason);
          }}
        />
      </svg>
    </div>
  );
}

function FgaSfdLineChart() {
  const [hoveredSeason, setHoveredSeason] = useState(null);
  const [narrativeStage, setNarrativeStage] = useState(NARRATIVE_STAGES.INITIAL);
  const narrativeRef = useRef(null);

  const seasonTicks = useMemo(() => getSeasonTicks(chartData), [chartData]);
  const x = useMemo(
    () =>
      d3
        .scalePoint()
        .domain(chartData.map((row) => row.season))
        .range([MARGIN.left, CHART_WIDTH - MARGIN.right])
        .padding(0.35),
    [chartData],
  );

  useEffect(() => {
    function updateNarrativeStage() {
      const element = narrativeRef.current;
      if (!element) return;

      const rect = element.getBoundingClientRect();
      const viewportHeight = window.innerHeight || 1;
      const scrollableDistance = Math.max(rect.height - viewportHeight, 1);
      const progress = Math.min(Math.max((-rect.top) / scrollableDistance, 0), 1);
      const nextStage = getNarrativeStage(progress);

      setNarrativeStage((currentStage) => (currentStage === nextStage ? currentStage : nextStage));
    }

    updateNarrativeStage();
    window.addEventListener("scroll", updateNarrativeStage, { passive: true });
    window.addEventListener("resize", updateNarrativeStage);
    return () => {
      window.removeEventListener("scroll", updateNarrativeStage);
      window.removeEventListener("resize", updateNarrativeStage);
    };
  }, []);

  const narrativeMessage = getNarrativeMessage(narrativeStage);
  const showEraShade = narrativeStage === NARRATIVE_STAGES.SHADED_ERA;

  return (
    <section className="fga-sfd-section fga-sfd-narrative-track" ref={narrativeRef}>
      <div className="fga-sfd-shell fga-sfd-sticky-shell">
        <div className="fga-sfd-chart-stage-wrap">
          <details className="fga-sfd-help" open>
            <summary className="fga-sfd-help-summary">Metric explanations</summary>
            <div className="fga-sfd-help-content">
              <p><span className="fga-sfd-help-key">2PT FGA / 100 Player Min:</span> <code>Number of 2-point field-goal attempts per 100 player minutes.</code></p>
              <p><span className="fga-sfd-help-key">3PT FGA / 100 Player Min:</span> <code>Number of 3-point field-goal attempts per 100 player minutes.</code></p>
              <p><span className="fga-sfd-help-key">2PT SFD Rate:</span> <code>TwoPointShootingFoulsDrawn / (TwoPointFieldGoalAttempts + TwoPointShootingFoulsDrawn - TwoPointAndOneDrawn)</code></p>
              <p><span className="fga-sfd-help-key">3PT SFD Rate:</span> <code>ThreePointShootingFoulsDrawn / (ThreePointFieldGoalAttempts + ThreePointShootingFoulsDrawn - ThreePointAndOneDrawn)</code></p>
            </div>
          </details>

          <div className="fga-sfd-grid">
            {METRIC_META.map((metric) => (
              <MetricLineChart
                key={metric.key}
                data={chartData}
                metric={metric}
                x={x}
                seasonTicks={seasonTicks}
                hoveredSeason={hoveredSeason}
                onHoverSeason={setHoveredSeason}
                showEraShade={showEraShade}
              />
            ))}
          </div>

          {narrativeMessage && (
            <div className="fga-sfd-narrative-overlay" aria-live="polite">
              <div className="fga-sfd-narrative-box">
                <h4 className="fga-sfd-narrative-title">{narrativeMessage.title}</h4>
                <p className="fga-sfd-narrative-body">{narrativeMessage.body}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export { FgaSfdLineChart };
