"use client";

import type { CSSProperties } from "react";
import type { StepperState } from "../types";

function shell(state: StepperState): CSSProperties {
  return {
    width: state.width,
    minHeight: state.height,
    padding: state.padding,
    borderRadius: state.radius,
    border: `${state.borderWidth}px solid ${state.border}`,
    boxShadow: `0 ${Math.round(state.shadow / 3)}px ${state.shadow}px rgba(0,0,0,.28)`,
    background: state.background,
    color: state.foreground,
    fontFamily: state.fontFamily,
    opacity: state.disabled ? 0.55 : 1,
  };
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export default function LivePreview({ state }: { state: StepperState }) {
  const count = clamp(state.itemCount, 1, 14);
  const activeIndex = clamp(state.activeIndex, 0, count - 1);
  const errorIndex = state.errorStep > 0 ? clamp(state.errorStep - 1, 0, count - 1) : -1;
  const optionalIndex = state.optionalSteps > 0 ? clamp(count - state.optionalSteps, 0, count - 1) : -1;
  const isVertical = state.orientation === "vertical";
  const steps = Array.from({ length: count }, (_, index) => index);
  const list = (
    <ol className={isVertical ? "grid gap-4" : "grid gap-4"} style={{ gridTemplateColumns: isVertical ? undefined : `repeat(${count}, minmax(0, 1fr))` }}>
      {steps.map((step, index) => {
        const isActive = index === activeIndex;
        const isComplete = index < activeIndex;
        const isError = index === errorIndex || (state.previewState === "error" && isActive);
        const isDisabled = state.disabled || index > activeIndex + 1;
        const markerBg = isError ? "#ef4444" : isActive ? state.accent : isComplete ? "#22c55e" : "transparent";
        const markerColor = isActive || isComplete || isError ? "#020617" : state.foreground;
        return (
          <li key={step} className={isVertical ? "grid grid-cols-[auto_1fr] gap-3" : "grid gap-3"}>
            <div className={isVertical ? "grid justify-items-center gap-2" : "flex items-center gap-2"}>
              <span className="grid size-9 place-items-center rounded-full border text-sm font-black" style={{ borderColor: isActive ? state.accent : state.border, background: markerBg, color: markerColor, transition: state.motion ? "background 0.2s ease, transform 0.2s ease, border-color 0.2s ease" : "none", transform: state.motion && isActive ? "scale(1.1)" : "scale(1)" }}>
                {isComplete ? "OK" : index + 1}
              </span>
              {index < count - 1 && (
                <span aria-hidden="true" className={isVertical ? "h-10 w-px" : "h-px flex-1"} style={{ background: isComplete ? state.accent : state.border, borderTop: state.connectorStyle === "dashed" ? `1px dashed ${state.border}` : undefined, transition: state.motion ? "background 0.2s ease" : "none" }} />
              )}
            </div>
            <div aria-current={isActive ? "step" : undefined} aria-disabled={isDisabled || undefined} className="rounded-2xl border p-3" style={{ borderColor: isError ? "#ef4444" : isActive ? state.accent : state.border, color: isDisabled ? state.muted : state.foreground }}>
              <p className="text-sm font-bold">{state.label} {index + 1}</p>
              <p className="text-xs" style={{ color: state.muted }}>
                {isError ? "Error" : isComplete ? "Complete" : isActive ? "Current step" : isDisabled ? "Disabled" : "Upcoming"}
                {index === optionalIndex ? " / Optional" : ""}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );

  return state.role === "navigation" ? (
    <nav id={state.id} aria-label={state.ariaLabel} style={shell(state)} className="grid content-center gap-4">
      {list}
      <p className="text-xs" style={{ color: state.muted }}>Process navigation with aria-current step, connectors, complete, error, disabled, and optional states.</p>
    </nav>
  ) : (
    <section id={state.id} aria-label={state.ariaLabel} style={shell(state)} className="grid content-center gap-4">
      {list}
      <p className="text-xs" style={{ color: state.muted }}>Ordered process list with aria-current step, connectors, complete, error, disabled, and optional states.</p>
    </section>
  );
}
