import { useMemo, useState } from "react";
import * as d3 from "d3";

const WIDTH = 980;
const HEIGHT = 540;
const MARGIN = { top: 14, right: 16, bottom: 54, left: 58 };

function FtLinechartSvg({ data, chartState }) {
  const [hoveredSeason, setHoveredSeason] = useState(null);
  const showFtm = chartState >= 3;

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
        .padding(0.35),
    [data],
  );

  const y = useMemo(() => {
    const maxY = d3.max(data, (d) => Math.max(d.fta, d.ftm)) || 1;
    return d3
      .scaleLinear()
      .domain([0, maxY * 1.1])
      .nice()
      .range([HEIGHT - MARGIN.bottom, MARGIN.top]);
  }, [data]);

  const yTicks = useMemo(() => y.ticks(6), [y]);
  const ftaValues = useMemo(() => data.map((d) => d.fta), [data]);
  const minFta = ftaValues.length ? Math.min(...ftaValues) : 0;
  const maxFta = ftaValues.length ? Math.max(...ftaValues) : 0;

  const ftaPath = useMemo(() => {
    const line = d3
      .line()
      .x((d) => x(d.season))
      .y((d) => y(d.fta))
      .curve(d3.curveCatmullRom.alpha(0.5));
    return line(data) || "";
  }, [data, x, y]);

  const ftmPath = useMemo(() => {
    const line = d3
      .line()
      .x((d) => x(d.season))
      .y((d) => y(d.ftm))
      .curve(d3.curveCatmullRom.alpha(0.5));
    return line(data) || "";
  }, [data, x, y]);

  const betweenPath = useMemo(() => {
    const area = d3
      .area()
      .x((d) => x(d.season))
      .y0((d) => y(d.fta))
      .y1((d) => y(d.ftm))
      .curve(d3.curveCatmullRom.alpha(0.5));
    return area(data) || "";
  }, [data, x, y]);

  const xPositions = useMemo(
    () => data.map((d) => ({ season: d.season, x: x(d.season) })),
    [data, x],
  );

  const hoveredPoint = hoveredSeason ? data.find((d) => d.season === hoveredSeason) : null;
  const bandY1 = y(Math.max(0, minFta - 0.25));
  const bandY2 = y(maxFta + 0.25);

  return (
    <div className="ft-trend-chart-wrap">
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="ft-trend-svg">
        {yTicks.map((tick) => (
          <g key={`y-${tick}`}>
            <line x1={MARGIN.left} x2={WIDTH - MARGIN.right} y1={y(tick)} y2={y(tick)} className="ft-trend-grid" />
            <text x={MARGIN.left - 8} y={y(tick) + 4} textAnchor="end" className="ft-trend-tick-label">
              {tick.toFixed(1)}
            </text>
          </g>
        ))}

        <line x1={MARGIN.left} x2={WIDTH - MARGIN.right} y1={HEIGHT - MARGIN.bottom} y2={HEIGHT - MARGIN.bottom} className="ft-trend-axis" />
        <line x1={MARGIN.left} x2={MARGIN.left} y1={HEIGHT - MARGIN.bottom} y2={MARGIN.top} className="ft-trend-axis" />

        {seasonTicks.map((season) => (
          <g key={`x-${season}`}>
            <line x1={x(season)} x2={x(season)} y1={HEIGHT - MARGIN.bottom} y2={HEIGHT - MARGIN.bottom + 6} className="ft-trend-axis" />
            <text x={x(season)} y={HEIGHT - MARGIN.bottom + 20} textAnchor="middle" className="ft-trend-tick-label">
              {season}
            </text>
          </g>
        ))}

        <text x={(MARGIN.left + (WIDTH - MARGIN.right)) / 2} y={HEIGHT - 10} textAnchor="middle" className="ft-trend-axis-label">
          Season
        </text>
        <text transform={`translate(16 ${(MARGIN.top + (HEIGHT - MARGIN.bottom)) / 2}) rotate(-90)`} textAnchor="middle" className="ft-trend-axis-label">
          Number per 100 Player minutes
        </text>

        {chartState === 1 && (
          <rect
            x={MARGIN.left}
            y={Math.min(bandY1, bandY2)}
            width={WIDTH - MARGIN.left - MARGIN.right}
            height={Math.abs(bandY2 - bandY1)}
            className="ft-trend-flat-band"
          />
        )}

        {showFtm && <path d={betweenPath} className="ft-trend-between-area" />}

        <path d={ftaPath} className="ft-trend-line ft-trend-line-fta" />
        {data.map((d) => (
          <circle
            key={`fta-${d.season}`}
            cx={x(d.season)}
            cy={y(d.fta)}
            r="4"
            className={`ft-trend-point ft-trend-point-fta ${showFtm ? "is-interactive" : ""}`}
            onMouseEnter={() => showFtm && setHoveredSeason(d.season)}
            onMouseLeave={() => setHoveredSeason(null)}
          />
        ))}

        <g className={showFtm ? "ftm-visible" : "ftm-hidden"}>
          <path d={ftmPath} className="ft-trend-line ft-trend-line-ftm" />
          {data.map((d) => (
            <circle
              key={`ftm-${d.season}`}
              cx={x(d.season)}
              cy={y(d.ftm)}
              r="4"
              className={`ft-trend-point ft-trend-point-ftm ${showFtm ? "is-interactive" : ""}`}
              onMouseEnter={() => showFtm && setHoveredSeason(d.season)}
              onMouseLeave={() => setHoveredSeason(null)}
            />
          ))}
        </g>

        {showFtm && hoveredPoint && (
          <g pointerEvents="none">
            <line
              x1={x(hoveredPoint.season)}
              x2={x(hoveredPoint.season)}
              y1={Math.min(y(hoveredPoint.fta), y(hoveredPoint.ftm))}
              y2={Math.max(y(hoveredPoint.fta), y(hoveredPoint.ftm))}
              className="ft-trend-hover-connector"
            />
            <circle cx={x(hoveredPoint.season)} cy={y(hoveredPoint.fta)} r="5" className="ft-trend-hover-point ft-trend-hover-point-fta" />
            <circle cx={x(hoveredPoint.season)} cy={y(hoveredPoint.ftm)} r="5" className="ft-trend-hover-point ft-trend-hover-point-ftm" />
          </g>
        )}

        {showFtm && (
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
        )}
      </svg>

      {showFtm && hoveredPoint && (
        <div className="ft-trend-tooltip">
          <div className="ft-trend-tooltip-season">{hoveredPoint.season}</div>
          <div className="ft-trend-tooltip-fta">FTA: {hoveredPoint.fta.toFixed(2)}</div>
          <div className="ft-trend-tooltip-ftm">FTM: {hoveredPoint.ftm.toFixed(2)}</div>
          <div className="ft-trend-tooltip-pct">FT%: {(hoveredPoint.ftPct * 100).toFixed(1)}%</div>
        </div>
      )}
    </div>
  );
}

export { FtLinechartSvg };
