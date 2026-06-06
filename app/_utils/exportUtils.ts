import type { StepperState } from "../types";

export type ExportPayload = { fileName: string; mimeType: "text/plain;charset=utf-8"; content: string };

export function buildExportPayload(state: StepperState, fileName = "stepper"): ExportPayload {
  return { fileName: `${fileName || "stepper"}.jsx`, mimeType: "text/plain;charset=utf-8", content: buildReactCode(state) };
}

export function buildReactCode(state: StepperState) {
  return `import * as React from "react";

const state = ${JSON.stringify(state, null, 2)};

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export default function StepperComponent() {
  const count = clamp(state.itemCount, 1, 14);
  const activeIndex = clamp(state.activeIndex, 0, count - 1);
  const errorIndex = state.errorStep > 0 ? clamp(state.errorStep - 1, 0, count - 1) : -1;
  const optionalIndex = state.optionalSteps > 0 ? clamp(count - state.optionalSteps, 0, count - 1) : -1;
  const isVertical = state.orientation === "vertical";
  const steps = Array.from({ length: count }, (_, index) => index);
  const list = (
    <ol style={{ display: "grid", gap: 16, gridTemplateColumns: isVertical ? undefined : "repeat(" + count + ", minmax(0, 1fr))", margin: 0, padding: 0, listStyle: "none" }}>
      {steps.map((step, index) => {
        const isActive = index === activeIndex;
        const isComplete = index < activeIndex;
        const isError = index === errorIndex || (state.previewState === "error" && isActive);
        const isDisabled = state.disabled || index > activeIndex + 1;
        const markerBg = isError ? "#ef4444" : isActive ? state.accent : isComplete ? "#22c55e" : "transparent";
        const markerColor = isActive || isComplete || isError ? "#020617" : state.foreground;
        return (
          <li key={step} style={{ display: "grid", gridTemplateColumns: isVertical ? "auto 1fr" : undefined, gap: 12 }}>
            <div style={{ display: isVertical ? "grid" : "flex", justifyItems: "center", alignItems: "center", gap: 8 }}>
              <span style={{ display: "grid", placeItems: "center", width: 36, height: 36, borderRadius: 999, border: "1px solid " + (isActive ? state.accent : state.border), background: markerBg, color: markerColor, fontWeight: 900 }}>
                {isComplete ? "OK" : index + 1}
              </span>
              {index < count - 1 && (
                <span aria-hidden="true" style={{ display: "block", width: isVertical ? 1 : "100%", height: isVertical ? 40 : 1, flex: 1, background: isComplete ? state.accent : state.border, borderTop: !isVertical && state.connectorStyle === "dashed" ? "1px dashed " + state.border : undefined }} />
              )}
            </div>
            <div aria-current={isActive ? "step" : undefined} aria-disabled={isDisabled || undefined} style={{ padding: 12, border: "1px solid " + (isError ? "#ef4444" : isActive ? state.accent : state.border), borderRadius: 16, color: isDisabled ? state.muted : state.foreground }}>
              <p style={{ margin: 0, fontWeight: 800 }}>{state.label} {index + 1}</p>
              <p style={{ margin: "4px 0 0", color: state.muted, fontSize: 12 }}>
                {isError ? "Error" : isComplete ? "Complete" : isActive ? "Current step" : isDisabled ? "Disabled" : "Upcoming"}{index === optionalIndex ? " / Optional" : ""}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );

  const wrapperStyle = {
    width: state.width,
    minHeight: state.height,
    padding: state.padding,
    borderRadius: state.radius,
    border: state.borderWidth + "px solid " + state.border,
    boxShadow: "0 " + Math.round(state.shadow / 3) + "px " + state.shadow + "px rgba(0,0,0,.28)",
    background: state.background,
    color: state.foreground,
    fontFamily: state.fontFamily,
    opacity: state.disabled ? 0.55 : 1,
  };

  return state.role === "navigation" ? (
    <nav id={state.id} aria-label={state.ariaLabel} style={wrapperStyle}>{list}</nav>
  ) : (
    <section id={state.id} aria-label={state.ariaLabel} style={wrapperStyle}>{list}</section>
  );
}
`;
}
