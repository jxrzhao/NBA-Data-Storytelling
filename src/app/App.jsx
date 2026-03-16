import { FtLinechart } from "./components/charts/ft_linechart/FtLinechart";
import { Streamgraph } from "./components/charts/streamgraph/Streamgraph";
import { FgaSfdLineChart } from "./components/charts/fga_sfd_linechart/FgaSfdLineChart";
import { ScatterPanel } from "./components/charts/scatter_panel/ScatterPanel";
import { NarrativeText } from "./components/Typography";
import { Dribbble } from "lucide-react";

function App() {
  return <main className="relative min-h-screen bg-[#111] text-zinc-300 font-sans selection:bg-orange-600/30 selection:text-orange-200">
      
      {
    /* Noise Texture Overlay */
  }
      <div
    className="fixed inset-0 opacity-[0.03] pointer-events-none z-50"
    style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}
  />

      {
    /* Intro Header Section */
  }
      <header className="relative w-full min-h-[90vh] flex flex-col items-center text-center px-3 md:px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-950/20 to-zinc-950 pointer-events-none" />
        
        {
    /* Decorative Circles */
  }
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-orange-900/20 rounded-full opacity-50 blur-sm pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-orange-900/10 rounded-full opacity-50 blur-md pointer-events-none" />

        <div className="flex-1 flex flex-col justify-center min-h-0">
          <Dribbble className="w-12 h-12 text-orange-600 mb-8 animate-pulse opacity-50 relative z-10" />
          
          <h1 className="font-sans font-black text-6xl md:text-8xl tracking-wide leading-snug uppercase text-transparent bg-clip-text bg-gradient-to-br from-zinc-100 to-zinc-600 mb-6 relative z-10 drop-shadow-2xl">
            Is This A Basketball Game <br /> Or <span className="text-orange-500"> <br/>Is This Just A Free Throw <span style={{ textDecoration: "line-through" }}> Fantasy</span> Contest?</span>
          </h1>
          
          <p className="font-serif text-xl md:text-2xl text-zinc-400 max-w-4xl mx-auto italic relative z-10">
            Investigate free throw trends in the NBA across seasons. Explore the data and see for yourself.
          </p>
        </div>

        <div className="flex-shrink-0 pb-12 flex flex-col items-center animate-bounce">
          <span className="text-xs uppercase tracking-[0.2em] font-sans text-zinc-500 mb-2">Scroll to Read the Data Story</span>
          <div className="w-px h-12 bg-gradient-to-b from-orange-500/50 to-transparent" />
        </div>
      </header>

      {
    /* Narrative Intro */
  }
      <section className="bg-zinc-950 py-32 relative z-10 border-t border-zinc-900 min-h-screen flex items-center">
        <div className="w-full max-w-[76rem] mx-auto px-3 md:px-4">
          <div className="rounded-2xl border border-zinc-800/80 bg-gradient-to-br from-zinc-900 to-zinc-950 p-7 md:p-10 shadow-2xl shadow-black/30">
            <NarrativeText className="my-0 px-0 max-w-none text-xl md:text-2xl leading-loose text-zinc-200">
              Free throws are a fundamental part of basketball.
              Introduced shortly after basketball itself was introduced back in the <span className="text-orange-300 font-semibold">19th century</span> by James Naismith, free throw has been adopted by the NBA since its first day.
              <br /><br />
              In modern days, NBA players will shoot free throws when certain fouls are committed against them.
              They will shoot behind the free throw line that is <span className="text-orange-300 font-semibold">19 feet</span> from the baseline, uncontested, and make one point for each successful shot.
            </NarrativeText>
          </div>
        </div>
      </section>


      <section className="bg-zinc-950 py-32 relative z-10 border-t border-zinc-900 min-h-screen flex items-center">
        <div className="w-full max-w-[76rem] mx-auto px-3 md:px-4">
          <div className="rounded-2xl border border-zinc-800/80 bg-gradient-to-br from-zinc-900 to-zinc-950 p-7 md:p-10 shadow-2xl shadow-black/30">
            <NarrativeText className="my-0 px-0 max-w-none text-xl md:text-2xl leading-loose text-zinc-200">
              The most common ways to earn free throws are by drawing shooting fouls.
              If the defensive player makes illegal contact with an offensive player who is shooting, the referee will call a shooting foul on the defensive player.
              The offensive player will then shoot 2 free throws if they attempts a 2-pointer and 3 free throws if they attempts a 3-pointer. Other sources of free throws are non-shooting fouls (including team foul bonuses) and technical fouls.
              <br /><br />
              Free throws could be rewarding. According to statistics from recent NBA seasons, elite shooters like Stephen Curry, Kevin Durant, and Damian Lillard shoot 2-pointers at roughly <span className="text-zinc-100 font-semibold">55%</span>,
              3-pointers at roughly <span className="text-zinc-100 font-semibold">40%</span>, and free throws at up to <span className="text-zinc-100 font-semibold">90%</span>.
              This will make drawing a 2-pointer shooting foul earn <span className="text-orange-300 font-semibold">2 * 90% - 2 * 55%  = 0.7 more expected points</span> and drawing a 3-pointer shooting fouls earn <span className="text-orange-300 font-semibold">3 * 90% - 3 * 40% = 1.5 more expected points</span>.
            </NarrativeText>
          </div>
        </div>
      </section>

      <section className="bg-zinc-950 py-32 relative z-10 border-t border-zinc-900 min-h-screen flex items-center">
        <div className="w-full max-w-[76rem] mx-auto px-3 md:px-4">
          <div className="rounded-2xl border border-zinc-800/80 bg-gradient-to-br from-zinc-900 to-zinc-950 p-7 md:p-10 shadow-2xl shadow-black/30">
            <NarrativeText className="my-0 px-0 max-w-none text-xl md:text-2xl leading-loose text-zinc-200">
              Over the past decade, many NBA fans have felt that the game is becoming increasingly dominated by free throws.
              On social media and sports commentary shows, players who frequently draw fouls—often labeled <span className="text-zinc-100 font-semibold">“free throw merchants”</span>—are criticized
              for slowing down the pace of the game and taking advantage of foul calls rather than traditional shot-making.
            </NarrativeText>
          </div>
        </div>
      </section>

      

      {
    /* Social Media Images */
  }
      <section className="bg-zinc-950 py-32 relative z-10 border-t border-zinc-900 min-h-screen flex flex-col items-center justify-center px-3 md:px-4">
        <NarrativeText className="mb-12 text-center text-xl md:text-2xl font-medium text-zinc-200 not-italic tracking-wide">
          <span className="text-orange-400/90">What do fans think?</span> Here's how some complained on social media...
        </NarrativeText>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-[90rem] mx-auto w-full">
          <div className="aspect-[4/5] relative rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl bg-zinc-900 flex items-center justify-center">
            <img src="../../public/img/meme1.png" alt="Angry fan" className="object-contain w-full h-full" />
 
          </div>
          <div className="aspect-[4/5] relative rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl bg-zinc-900 flex items-center justify-center">
            <img src="../../public/img/meme2.png" alt="Angry fan on phone" className="object-contain w-full h-full" />
 
          </div>
        </div>
      </section>

      {
    /* Video Highlight */
  }
      <section className="bg-zinc-950 py-32 relative z-10 border-t border-zinc-900 min-h-screen flex flex-col items-center justify-center px-3 md:px-4">
        <NarrativeText className="mb-12 text-center text-xl md:text-2xl font-medium text-zinc-200 not-italic tracking-wide">
          <span className="text-orange-400/90">See it in action.</span> A 15+ minute compilation of SGA drawing fouls.
        </NarrativeText>
        <div className="w-full max-w-[90rem] aspect-video bg-black rounded-2xl border border-zinc-800 flex items-center justify-center overflow-hidden shadow-2xl shadow-orange-900/10">
          <iframe width="100%" height="100%" 
            src="https://www.youtube.com/embed/Mo4ni69qUbY?si=knApx21oyrcey6SB" 
            title="YouTube video player" 
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            referrerpolicy="strict-origin-when-cross-origin" 
            allowfullscreen
            className="opacity-70 grayscale hover:grayscale-0 transition-all duration-500"
          ></iframe>
        </div>
      </section>

      {
    /* Question */
  }
      <section className="bg-zinc-950 py-48 relative z-10 border-t border-zinc-900 min-h-screen flex items-center justify-center">
        <h2 className="font-serif italic text-3xl md:text-5xl text-white text-center max-w-[72rem] leading-snug px-3 md:px-4">
          However... is it <span className="text-orange-500 font-bold not-italic">true</span> that the NBA is becoming a free throw game?
        </h2>
      </section>

      {
    /* Visual Component 1: Ft Line Chart */
  }
      <FtLinechart />


      {
    /* Intro to Streamgraph*/ 
  }
      <section className="bg-zinc-950 py-48 relative z-10 border-t border-zinc-900 min-h-screen flex items-center justify-center">
        <h2 className="font-serif italic text-3xl md:text-5xl text-white text-center max-w-[72rem] leading-snug px-3 md:px-4">
          {/* However... is it <span className="text-orange-500 font-bold not-italic">true</span> that the NBA is becoming a free throw game? */}
          We need a more fine-grained analysis. How about the <span className="text-orange-500 font-bold not-italic">composition </span> of free throw attempts across seasons?
        </h2>
      </section>

      {
    /* Visual Component 2: Streamgraph */
  }
      <Streamgraph />

      {
        /* Summary of Streamgraph. Intro to the FGA and SFD Line Chart*/
      }


      <section className="bg-zinc-950 py-32 relative z-10 border-t border-zinc-900 min-h-screen flex items-center">
        <div className="w-full max-w-[76rem] mx-auto px-3 md:px-4">
          <div className="rounded-2xl border border-zinc-800/80 bg-gradient-to-br from-zinc-900 to-zinc-950 p-7 md:p-10 shadow-2xl shadow-black/30">
            <NarrativeText className="my-0 px-0 max-w-none text-xl md:text-2xl leading-loose text-zinc-200">
              This streamgraph of FTA composition essentially aligns with our knowledge of NBA trends. After the 2014-2015 season, with the rise of the <span className="font-bold text-[#0ea5e9]">Golden State Warriors</span> and Stephen Curry,
              the league has shifted to shoot more 3-pointers and, as a result, draw more 3-point shooting fouls.

              <br /><br />
              At the same time, teams like the <span className="font-bold text-[#ef4444]">Houston Rockets</span> during the 2017-2018 season adopted the <a href="https://jjhoffstein.github.io/moreyball.html" target="_blank" rel="noopener noreferrer" className="underline text-[#ef4444] font-medium">“Moreyball”</a> strategy of basketball:
              prioritizing 3-pointers, 2-pointers at the rim, and drawing free throws at the rim, while reducing mid-range 2-point attempts.

            </NarrativeText>
          </div>
        </div>
      </section>


      <section className="bg-zinc-950 py-32 relative z-10 border-t border-zinc-900 min-h-screen flex items-center">
        <div className="w-full max-w-[76rem] mx-auto px-3 md:px-4">
          <div className="rounded-2xl border border-zinc-800/80 bg-gradient-to-br from-zinc-900 to-zinc-950 p-7 md:p-10 shadow-2xl shadow-black/30">
            <NarrativeText className="my-0 px-0 max-w-none text-xl md:text-2xl leading-loose text-zinc-200">

              With the change in <span className="font-bold text-orange-300">Field Goal Attempts (FGA)</span> composition, we do anticipate a change in Free Throw Attempts (FTA) composition.
              The number of 2-point FGA and 3-point FGA are likely changing over seasons.
              Also, how about the <span className="font-bold text-orange-300">Shooting Foul Drawing (SFD) Rate </span>  for 2-pointers and 3-pointers?
            </NarrativeText>
          </div>
        </div>
      </section>

      <section className="bg-zinc-950 py-48 relative z-10 border-t border-zinc-900 min-h-screen flex items-center justify-center">
        <h2 className="font-serif italic text-3xl md:text-5xl text-white text-center max-w-[72rem] leading-snug px-3 md:px-4">
          {/* However... is it <span className="text-orange-500 font-bold not-italic">true</span> that the NBA is becoming a free throw game? */}
          Is the SFD Rate Increasing? Is it <span className="font-bold text-orange-500">easier</span> to draw fouls for 2-pointers or 3-pointers?      
          </h2>
      </section>


      {
    /* Visual Component 3: FgaSfdLineChart */
  }
      <FgaSfdLineChart />

      <section className="bg-zinc-950 py-32 relative z-10 border-t border-zinc-900 min-h-screen flex items-center">
        <div className="w-full max-w-[76rem] mx-auto px-3 md:px-4">
          <div className="rounded-2xl border border-zinc-800/80 bg-gradient-to-br from-zinc-900 to-zinc-950 p-7 md:p-10 shadow-2xl shadow-black/30">
            <NarrativeText className="my-0 px-0 max-w-none text-xl md:text-2xl leading-loose text-zinc-200">
              In terms of the SFD Rate, it's <span className="font-bold text-orange-300"> easier</span> to draw fouls in modern NBA than before, especially for 2-pointers. 
              
              Factoring in the fact that there are more 3-point FGA and less 2-point FGA, 
  
              the trend coincides with Moreyball's strategy that emphasizes shooting 3-pointers and driving to the rim for 2-pointers that has higher SFD Rate.

              From this perspective, the NBA is <span className="font-bold text-orange-300">indeed</span> becoming a free throw contest.
             
            </NarrativeText>
          </div>
        </div>
      </section>

      <section className="bg-zinc-950 py-48 relative z-10 border-t border-zinc-900 min-h-screen flex items-center justify-center">
        <h2 className="font-serif italic text-3xl md:text-5xl text-white text-center max-w-[72rem] leading-snug px-3 md:px-4">
          {/* However... is it <span className="text-orange-500 font-bold not-italic">true</span> that the NBA is becoming a free throw game? */}
          The trend is clear, but what about <span className="font-bold text-orange-500">specific players</span>?  
        </h2>
      </section>


      {
    /* Visual Component 4: Scatter Panel (Interactive) */
  }
      <ScatterPanel />



      {
    /* Footer / Conclusion */
    }
      <footer className="bg-zinc-950 py-32 text-center relative z-10 border-t border-zinc-900 flex flex-col items-center justify-center">
        <Dribbble className="w-8 h-8 text-zinc-800 mb-6" />
  
        <div className="font-serif text-zinc-500 max-w-prose mx-auto space-y-3">
          <p>End of the story.</p>
          <p>Designed with Figma Design Agent, and built with support from GPT-5.3 Codex.</p>
          <p>
            Data source:{" "}
            <a
              href="https://www.pbpstats.com/totals/nba/player?Season=2023-24&SeasonType=Regular+Season"
              target="_blank"
              rel="noreferrer"
              className="text-zinc-400 hover:text-zinc-200 underline underline-offset-2"
            >
              pbpstats player totals
            </a>
          </p>
          <p>
            Data Source API docs:{" "}
            <a
              href="https://api.pbpstats.com/docs#/"
              target="_blank"
              rel="noreferrer"
              className="text-zinc-400 hover:text-zinc-200 underline underline-offset-2"
            >
              api.pbpstats.com/docs
            </a>
          </p>
          <p>
            GitHub repo:{" "}
            <a
              href="https://github.com/jxrzhao/NBA-Data-Storytelling.git"
              target="_blank"
              rel="noreferrer"
              className="text-zinc-400 hover:text-zinc-200 underline underline-offset-2"
            >
              xxx.com/xxx/xxx
            </a>
          </p>
        </div>
      </footer>
    </main>;
}
export {
  App as default
};
