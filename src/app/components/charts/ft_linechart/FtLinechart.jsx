import { useState } from "react";
import { ScrollyStep } from "../../ScrollyStep";
import { FtLinechartSvg } from "./FtLinechartSvg";
import trendRows from "../../../data/season_ft_trend.json";
import "./FtLinechart.css";

const trendData = trendRows.map((row) => ({
  season: row.season.replace("_", "-"),
  fta: row.fta_per100,
  ftm: row.ftm_per100,
  ftPct: row.ft_pct,
}));

function FtLinechart() {
  const [chartState, setChartState] = useState(0);

  return <section className="relative w-full text-zinc-300">
      <div className="flex flex-col md:flex-row max-w-[90rem] mx-auto px-2 lg:px-4">
        
        {
    /* Scrollable Text Blocks (Left) */
  }
        <div className="w-full md:w-1/2 relative z-10 pointer-events-none pb-32 pt-10 px-4 md:px-12">
          
          <ScrollyStep onStepEnter={() => setChartState(0)}>
            <div className="bg-zinc-900/90 backdrop-blur border border-zinc-800 p-8 rounded-xl shadow-2xl pointer-events-auto shadow-black/50 mb-[50vh]">
            <h3 className="text-xl font-bold font-sans uppercase mb-4 text-white">Check Out The Line Chart</h3>
              <p className="font-serif text-lg leading-relaxed text-zinc-400">
                This line chart shows free throw attempts  <span className="text-orange-300 font-semibold">(FTA)</span> per 100 player minutes on the y-axis, across seasons (96-97 to 24-25) on the x-axis.
                <span className="text-orange-300 font-semibold"> A player minute </span> means one player spending one clocked minute on the floor. Since there are 10 players on court, one
                full game has 48 * 10 = 480 player minutes. We will use "per 100 player minutes" metrics throughout our story  since it normalizes for pace and usage, and reflects interruption frequency over time.
              </p>
            </div>
          </ScrollyStep>

          <ScrollyStep onStepEnter={() => setChartState(1)}>
            <div className="bg-zinc-900/90 backdrop-blur border border-zinc-800 p-8 rounded-xl shadow-2xl pointer-events-auto shadow-black/50 mb-[50vh]">
              <h3 className="text-xl font-bold font-sans uppercase mb-4 text-white">FTA Has Not Increased</h3>
              <p className="font-serif text-lg leading-relaxed text-zinc-400">
                 To our suprise, the FTA trend is broadly flat or slightly decreasing over time, not rising the way the narrative suggests.
                 <span className="text-orange-500 font-semibold"> So weird</span>, why is the data somehow suggesting the opposite? NBA is becoming less of a free throw contest than before?
              </p>
            </div>
          </ScrollyStep>

          {/* <ScrollyStep onStepEnter={() => setChartState(2)}>
            <div className="bg-zinc-900/90 backdrop-blur border border-zinc-800 p-8 rounded-xl shadow-2xl pointer-events-auto shadow-black/50 mb-[20vh]">
              <h3 className="text-xl font-bold font-sans uppercase mb-4 text-zinc-300">What About Makes?</h3>
              <p className="font-serif text-lg leading-relaxed text-zinc-400">
                For your curiosity, check out how many of these free throws are actually made.
                In the next scroll step, we reveal the made line along with a visual gap between attempts and makes.
              </p>
            </div>
          </ScrollyStep> */}
          <ScrollyStep onStepEnter={() => setChartState(3)}>
            <div className="bg-zinc-900/90 backdrop-blur border border-zinc-800 p-8 rounded-xl shadow-2xl pointer-events-auto shadow-black/50 mb-[20vh]">
              <h3 className="text-xl font-bold font-sans uppercase mb-4 text-white">What About FT Makes?</h3>
              <p className="font-serif text-lg leading-relaxed text-zinc-400">
                For your curiosity, the green line shows free throw makes (FTM) per 100 player minutes. 
                It's pretty steady too.
                Hover your mouse over the chart to see the actual FTA, FTM, and FT% for each season.
              </p>
            </div>
          </ScrollyStep>

        </div>

        {
    /* Sticky Chart (Right) */
  }
        <div className="w-full md:w-1/2 sticky top-0 h-screen flex flex-col justify-center items-center pointer-events-none p-2 md:p-6 overflow-hidden">
          <div className="ft-trend-panel w-full h-[62vh] md:h-[74vh] pointer-events-auto">
            <h4 className="text-center font-sans uppercase tracking-widest text-sm text-zinc-500 mb-6">
              Free Throws Per 100 Player Minutes
            </h4>
            <FtLinechartSvg data={trendData} chartState={chartState} />
          </div>
        </div>
      </div>
    </section>;
}
export {
  FtLinechart
};
