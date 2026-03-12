import { useMemo, useState } from "react";
import * as d3 from "d3";

const WIDTH = 980;
const HEIGHT = 540;
const MARGIN = { top: 16, right: 16, bottom: 54, left: 58 };

const KEY_META = [
  { key: "technical", label: "Technical foul FTs", color: "#ef4444" },
  { key: "twoPoint", label: "2pt shooting foul FTs", color: "#0ea5e9" },
  { key: "threePoint", label: "3pt shooting foul FTs", color: "#22c55e" },
  { key: "nonShooting", label: "Non-shooting foul FTs", color: "#8b5cf6" },
];

const STEP_TO_ACTIVE = {
  0: "all",
  1: "nonShooting",
  2: "technical",
  3: "twoPoint",
  4: "threePoint",
};

function StreamgraphSvg({ data, chartState }) {
  const activeLayer = STEP_TO_ACTIVE[chartState] || "all";
  const [hoveredSeason, setHoveredSeason] = useState(null);
  const keysByTotal = useMemo(
    () =>
      [...KEY_META]
        .sort((a, b) => d3.sum(data, (row) => row[b.key]) - d3.sum(data, (row) => row[a.key]))
        .map((item) => item.key),
    [data],
  );
  const visibleKeys = useMemo(
    () => (activeLayer === "all" ? keysByTotal : [activeLayer]),
    [activeLayer, keysByTotal],
  );

  const seasonTicks = useMemo(() => {
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
  }, [data]);

  const x = useMemo(
    () =>
      d3
        .scalePoint()
        .domain(data.map((d) => d.season))
        .range([MARGIN.left, WIDTH - MARGIN.right])
        .padding(0.25),
    [data],
  );

  const stacked = useMemo(() => {
    const stack = d3
      .stack()
      .keys(visibleKeys)
      .offset(d3.stackOffsetNone)
      .order(d3.stackOrderNone);
    return stack(data);
  }, [data, visibleKeys]);

  const y = useMemo(() => {
    const maxY = d3.max(stacked.flatMap((layer) => layer.map((point) => point[1]))) ?? 1;
    return d3
      .scaleLinear()
      .domain([0, maxY])
      .nice()
      .range([HEIGHT - MARGIN.bottom, MARGIN.top]);
  }, [stacked]);

  const yTicks = useMemo(() => y.ticks(6), [y]);

  const area = useMemo(
    () =>
      d3
        .area()
        .x((_, index) => x(data[index].season))
        .y0((point) => y(point[0]))
        .y1((point) => y(point[1]))
        .curve(d3.curveMonotoneX),
    [x, y, data],
  );

  const layers = useMemo(
    () =>
      stacked.map((layer) => {
        const meta = KEY_META.find((d) => d.key === layer.key);
        return {
          key: layer.key,
          label: meta?.label ?? layer.key,
          color: meta?.color ?? "#999",
          path: area(layer) || "",
        };
      }),
    [stacked, area],
  );
  const xPositions = useMemo(
    () => data.map((row) => ({ season: row.season, x: x(row.season) })),
    [data, x],
  );
  const hoveredPoint = hoveredSeason ? data.find((row) => row.season === hoveredSeason) : null;
  const tooltipKeys = useMemo(
    () => (activeLayer === "all" ? KEY_META.map((d) => d.key) : [activeLayer]),
    [activeLayer],
  );
  const tooltipRows = useMemo(
    () =>
      tooltipKeys
        .map((key) => {
          const meta = KEY_META.find((d) => d.key === key);
          return {
            key,
            label: meta?.label ?? key,
            color: meta?.color ?? "#999",
            value: hoveredPoint ? hoveredPoint[key] : 0,
          };
        }),
    [tooltipKeys, hoveredPoint],
  );

  return (
    <div className="streamgraph-chart-wrap">
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="streamgraph-svg">
        {yTicks.map((tick) => (
          <g key={`y-${tick}`}>
            <line x1={MARGIN.left} x2={WIDTH - MARGIN.right} y1={y(tick)} y2={y(tick)} className="streamgraph-grid" />
            <text x={MARGIN.left - 8} y={y(tick) + 4} textAnchor="end" className="streamgraph-tick-label">
              {tick.toFixed(1)}
            </text>
          </g>
        ))}

        <line x1={MARGIN.left} x2={WIDTH - MARGIN.right} y1={HEIGHT - MARGIN.bottom} y2={HEIGHT - MARGIN.bottom} className="streamgraph-axis" />
        <line x1={MARGIN.left} x2={MARGIN.left} y1={HEIGHT - MARGIN.bottom} y2={MARGIN.top} className="streamgraph-axis" />

        {seasonTicks.map((season) => (
          <g key={`x-${season}`}>
            <line x1={x(season)} x2={x(season)} y1={HEIGHT - MARGIN.bottom} y2={HEIGHT - MARGIN.bottom + 6} className="streamgraph-axis" />
            <text x={x(season)} y={HEIGHT - MARGIN.bottom + 20} textAnchor="middle" className="streamgraph-tick-label">
              {season}
            </text>
          </g>
        ))}

        <text x={(MARGIN.left + (WIDTH - MARGIN.right)) / 2} y={HEIGHT - 10} textAnchor="middle" className="streamgraph-axis-label">
          Season
        </text>
        <text transform={`translate(16 ${(MARGIN.top + (HEIGHT - MARGIN.bottom)) / 2}) rotate(-90)`} textAnchor="middle" className="streamgraph-axis-label">
          FTs per 100 player minutes
        </text>

        {layers.map((layer) => (
          <path key={layer.key} d={layer.path} fill={layer.color} className="streamgraph-layer is-active" />
        ))}

        <rect
          x={MARGIN.left}
          y={MARGIN.top}
          width={WIDTH - MARGIN.left - MARGIN.right}
          height={HEIGHT - MARGIN.top - MARGIN.bottom}
          fill="transparent"
          onMouseLeave={() => setHoveredSeason(null)}
          onMouseMove={(event) => {
            const svgRect = event.currentTarget.ownerSVGElement.getBoundingClientRect();
            const relativeX = ((event.clientX - svgRect.left) / svgRect.width) * WIDTH;
            let closestSeason = null;
            let minDist = Infinity;
            xPositions.forEach((point) => {
              const distance = Math.abs(point.x - relativeX);
              if (distance < minDist) {
                minDist = distance;
                closestSeason = point.season;
              }
            });
            setHoveredSeason(closestSeason);
          }}
        />
      </svg>

      <div className="streamgraph-legend">
        {KEY_META.map((item) => {
          const dimmed = !visibleKeys.includes(item.key);
          return (
            <div key={item.key} className={`streamgraph-legend-item ${dimmed ? "is-dimmed" : "is-active"}`}>
              <span className="streamgraph-legend-swatch" style={{ backgroundColor: item.color }} />
              <span>{item.label}</span>
            </div>
          );
        })}
      </div>

      {hoveredPoint && (
        <div className="streamgraph-tooltip">
          <div className="streamgraph-tooltip-season">{hoveredPoint.season}</div>
          {tooltipRows.map((row) => (
            <div key={row.key} className="streamgraph-tooltip-row" style={{ color: row.color }}>
              {row.label}: {row.value.toFixed(2)}
            </div>
          ))}
          <div className="streamgraph-tooltip-note">FT / 100 player mins</div>
        </div>
      )}
    </div>
  );
}

export { StreamgraphSvg };
