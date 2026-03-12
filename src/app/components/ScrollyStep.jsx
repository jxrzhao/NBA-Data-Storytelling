import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
function ScrollyStep({ children, onStepEnter, className }) {
  const { ref, inView } = useInView({
    // Trigger when the step is halfway through the viewport
    threshold: 0.7
  });
  useEffect(() => {
    if (inView) {
      onStepEnter();
    }
  }, [inView, onStepEnter]);
  return <div ref={ref} className={cn("min-h-[100vh] flex items-center justify-center py-20", className)}>
      <div className={cn("transition-opacity duration-700", inView ? "opacity-100" : "opacity-30")}>
        {children}
      </div>
    </div>;
}
export {
  ScrollyStep,
  cn
};
