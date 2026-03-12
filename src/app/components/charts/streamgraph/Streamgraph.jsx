import { useState } from "react";
import { ScrollyStep } from "../../ScrollyStep";
import { StreamgraphSvg } from "./StreamgraphSvg";
import streamgraphRows from "../../../data/season_ft_types_per100.json";
import "./Streamgraph.css";

const streamgraphData = streamgraphRows.map((row) => ({
  season: row.season.replace("_", "-"),
  technical: row.technical_fta_per100,
  twoPoint: row.two_point_fta_per100,
  threePoint: row.three_point_fta_per100,
  nonShooting: row.non_shooting_fta_per100,
}));

function Streamgraph() {
  const [chartState, setChartState] = useState(0);

  return (
    <section className="relative w-full text-zinc-300">
      <div className="flex flex-col md:flex-row max-w-[90rem] mx-auto px-2 lg:px-4">
        <div className="w-full md:w-1/2 relative z-10 pointer-events-none pb-32 pt-10 px-4 md:px-12">
          <ScrollyStep onStepEnter={() => setChartState(0)}>
            <div className="bg-zinc-900/90 backdrop-blur border border-zinc-800 p-8 rounded-xl shadow-2xl pointer-events-auto shadow-black/50 mb-[50vh]">
              <h3 className="text-xl font-bold font-sans uppercase mb-4 text-white">Streamgraph of FTA Composition </h3>
              <p className="font-serif text-lg leading-relaxed text-zinc-400">
              <ul className="list-disc pl-6">
                <li>
                  2pt shooting foul FTs: When a defender fouls a player during a two-point shot attempt. Most common.
                </li>

                <li>
                  3pt shooting foul FTs: When a defender fouls a player during a three-point shot attempt.
                </li>
                <li>
                  Non-shooting foul FTs: When a defender fouls a player during a non-shooting action. (Inluding Team Foul Bonuses)
                </li>
                <li>
                  Technical foul FTs: When a player commits a technical foul, in violation of sportsmanlike conduct.
                </li>
              </ul>
              </p>
            </div>
          </ScrollyStep>

          <ScrollyStep onStepEnter={() => setChartState(1)}>
            <div className="bg-zinc-900/90 backdrop-blur border border-zinc-800 p-8 rounded-xl shadow-2xl pointer-events-auto shadow-black/50 border-l-4 border-l-[#8b5cf6] mb-[50vh]">
              <h3 className="text-xl font-bold font-sans uppercase mb-4 text-[#8b5cf6]">Non-Shooting Foul FTs</h3>
              <p className="font-serif text-lg leading-relaxed text-zinc-400">The number of non-shooting foul FTs has decreased over time.</p>
            </div>
          </ScrollyStep>

          <ScrollyStep onStepEnter={() => setChartState(2)}>
            <div className="bg-zinc-900/90 backdrop-blur border border-zinc-800 p-8 rounded-xl shadow-2xl pointer-events-auto shadow-black/50 border-l-4 border-l-[#ef4444] mb-[50vh]">
              <h3 className="text-xl font-bold font-sans uppercase mb-4 text-[#ef4444]">Technical Foul FTs</h3>
              <p className="font-serif text-lg leading-relaxed text-zinc-400">
                The number of technical foul FTs has decreased slightly too. 
                Maybe the NBA players are becoming more disciplined? 
              </p>
            </div>
          </ScrollyStep>

          <ScrollyStep onStepEnter={() => setChartState(3)}>
            <div className="bg-zinc-900/90 backdrop-blur border border-zinc-800 p-8 rounded-xl shadow-2xl pointer-events-auto shadow-black/50 border-l-4 border-l-[#0ea5e9] mb-[50vh]">
              <h3 className="text-xl font-bold font-sans uppercase mb-4 text-[#0ea5e9]">2pt Shooting Foul FTs</h3>
              <p className="font-serif text-lg leading-relaxed text-zinc-400">
                The number of 2pt shooting fouls remains relatively stable.
              </p>
            </div>
          </ScrollyStep>

          <ScrollyStep onStepEnter={() => setChartState(4)}>
            <div className="bg-zinc-900/90 backdrop-blur border border-zinc-800 p-8 rounded-xl shadow-2xl pointer-events-auto shadow-black/50 border-l-4 border-l-[#22c55e] mb-[20vh]">
              <h3 className="text-xl font-bold font-sans uppercase mb-4 text-[#22c55e]">3pt Shooting Foul FTs</h3>
              <p className="font-serif text-lg leading-relaxed text-zinc-400">
                The number of 3pt shooting fouls has <span className="text-orange-300 font-semibold">increased significantly</span> over time.
                At its peak in 2019-2020 season, a player will shoot <span className="text-orange-300 font-semibold">0.63 FT</span> due to 3pt shooting fouls per 100 player minutes.
              </p>
            </div>
          </ScrollyStep>

          <ScrollyStep onStepEnter={() => setChartState(0)}>
            <div className="bg-zinc-900/90 backdrop-blur border border-zinc-800 p-8 rounded-xl shadow-2xl pointer-events-auto shadow-black/50 mb-[50vh]">
              <h3 className="text-xl font-bold font-sans uppercase mb-4 text-white">Conclusion</h3>
              <p className="font-serif text-lg leading-relaxed text-zinc-400">
              <ul className="list-disc pl-6">
                  <li>
                    2pt shooting foul FTs: Stable.
                  </li>

                  <li>
                    3pt shooting foul FTs: <span className="text-orange-300 font-semibold">Increased significantly</span>.
                  </li>
                  <li>
                    Non-shooting foul FTs: Decreased.
                  </li>
                  <li>
                    Technical foul FTs: Decreased slightly.
                  </li>
                </ul>
              </p>
            </div>
          </ScrollyStep>
        </div>



        <div className="w-full md:w-1/2 sticky top-0 h-screen flex flex-col justify-center items-center pointer-events-none p-2 md:p-6 overflow-hidden">
          <div className="streamgraph-panel w-full pointer-events-auto">
            <h4 className="text-center font-sans uppercase tracking-widest text-sm text-zinc-500 mb-6">
              FTA Composition Across Seasons
            </h4>
            <StreamgraphSvg data={streamgraphData} chartState={chartState} />
          </div>
        </div>
      </div>
    </section>
  );
}

export { Streamgraph };
