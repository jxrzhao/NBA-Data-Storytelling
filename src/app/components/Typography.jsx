import { cn } from "./ScrollyStep";
function NarrativeText({ children, className }) {
  return <p className={cn(
    "font-serif text-lg md:text-xl leading-relaxed text-zinc-300 max-w-[72rem] mx-auto my-12 px-3 md:px-4",
    className
  )}>
      {children}
    </p>;
}
function SectionTitle({ children, className }) {
  return <h2 className={cn(
    "font-sans font-bold text-3xl md:text-5xl uppercase tracking-wider text-white max-w-[72rem] mx-auto my-8 px-3 md:px-4",
    className
  )}>
      {children}
    </h2>;
}
function Caption({ children, className }) {
  return <div className={cn("text-xs md:text-sm text-zinc-500 font-sans mt-2", className)}>
      {children}
    </div>;
}
export {
  Caption,
  NarrativeText,
  SectionTitle
};
