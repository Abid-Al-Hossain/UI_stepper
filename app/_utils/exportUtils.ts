import type { StepperState } from "../types";

export type ExportPayload = { fileName: string; mimeType: "text/plain;charset=utf-8"; content: string };

export function buildExportPayload(state: StepperState, fileName = "stepper"): ExportPayload {
  return { fileName: `${fileName || "stepper"}.jsx`, mimeType: "text/plain;charset=utf-8", content: buildReactCode(state) };
}

export function buildReactCode(state: StepperState) {
  return `import * as React from "react";

const state = ${JSON.stringify(state, null, 2)};
function resolveFont(s) { return s.fontBucket === "google" ? '"' + s.googleFontFamily + '", sans-serif' : "inherit"; }
function buildShadow(s) { if (!s.shadowEnabled) return "none"; var hex = Math.round(s.shadowOpacity * 255).toString(16).padStart(2, "0"); return s.shadowX + "px " + s.shadowY + "px " + s.shadowBlur + "px " + s.shadowSpread + "px " + s.shadowColor + hex; }


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
  const [hoverIndex, setHoverIndex] = React.useState(-1);
  const list = (
    <ol style={{ display: "grid", gap: state.stepGap, maxWidth: state.stepperMaxWidth, gridTemplateColumns: isVertical ? undefined : "repeat(" + count + ", minmax(0, 1fr))", margin: 0, padding: 0, listStyle: "none" }}>
      {steps.map((step, index) => {
        const isActive = index === activeIndex;
        const isComplete = index < activeIndex;
        const isError = index === errorIndex || (state.previewState === "error" && isActive);
        const isDisabled = state.disabled || index > activeIndex + 1;
        const isHover = state.clickable && hoverIndex === index && !isDisabled && !isActive;
        const markerBg = isError ? state.errorBg : isActive ? state.activeBg : isComplete ? state.completedBg : state.pendingBg;
        const markerColor = isError ? state.errorIconColor : isActive ? state.activeText : isComplete ? state.completedIconColor : state.pendingText;
        const markerBorder = isError ? state.errorBg : isActive ? state.accent : isComplete ? state.completedBg : state.pendingBorder;
        return (
          <li key={step} style={{ display: "grid", gridTemplateColumns: isVertical ? "auto 1fr" : undefined, gap: 12 }}>
            <div style={{ display: isVertical ? "grid" : "flex", justifyItems: "center", alignItems: "center", gap: state.connectorGap }}>
              <span style={{ display: "grid", placeItems: "center", width: state.markerSize, height: state.markerSize, fontSize: Math.round(state.markerSize * 0.36), borderRadius: 999, border: state.markerBorderWidth + "px solid " + markerBorder, background: markerBg, color: markerColor, fontWeight: 900, transition: ${state.transitionDuration > 0 ? '"background 0.2s ease, transform 0.2s ease, border-color 0.2s ease"' : '"none"'}, transform: isActive && ${state.transitionDuration > 0} ? "scale(1.1)" : "scale(1)" }}>
                {isComplete && !state.numberedMarkers ? "OK" : index + 1}
              </span>
              {index < count - 1 && (
                <span aria-hidden="true" style={{ display: "block", width: isVertical ? state.connectorWidth : "100%", height: isVertical ? 40 : state.connectorWidth, flex: 1, background: state.connectorStyle === "dashed" ? undefined : (isComplete ? state.connectorCompletedColor : state.connectorColor), borderTop: !isVertical && state.connectorStyle === "dashed" ? state.connectorWidth + "px dashed " + (isComplete ? state.connectorCompletedColor : state.connectorColor) : undefined, borderLeft: isVertical && state.connectorStyle === "dashed" ? state.connectorWidth + "px dashed " + (isComplete ? state.connectorCompletedColor : state.connectorColor) : undefined, transition: ${state.transitionDuration > 0 ? '"background 0.2s ease"' : '"none"'} }} />
              )}
            </div>
            <div aria-current={isActive ? "step" : undefined} aria-disabled={isDisabled || undefined} onMouseEnter={() => setHoverIndex(index)} onMouseLeave={() => setHoverIndex(-1)} style={{ padding: 12, border: "1px solid " + (isError ? state.errorBg : isActive ? state.activeBg : state.border), borderRadius: 16, background: isHover ? state.hoverBg : "transparent", color: isDisabled ? state.muted : isHover ? state.hoverText : state.stepTitleColor, cursor: state.clickable && !isDisabled ? "pointer" : undefined }}>
              <p style={{ margin: 0, fontWeight: 800 }}>{state.label} {index + 1}</p>
              <p style={{ margin: "4px 0 0", color: state.stepDescriptionColor, fontSize: 12 }}>
                {isError ? "Error" : isComplete ? "Complete" : isActive ? "Current step" : isDisabled ? "Disabled" : "Upcoming"}{index === optionalIndex ? <span style={{ color: state.optionalLabelColor }}> / {state.optionalLabelText}</span> : ""}
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
    border: state.borderWidth + "px " + state.borderStyle + " " + (state.disabled && state.disabledUseCustomColors ? state.disabledBorder : state.border),
    boxShadow: buildShadow(state),
    background: state.background,
    color: state.foreground,
    fontFamily: resolveFont(state),
    opacity: state.disabled ? (state.disabledOpacity ?? 0.5) : 1,
cursor: state.disabled ? state.disabledCursor : undefined,
  };

  return state.role === "navigation" ? (
    <nav id={state.id} aria-label={state.ariaLabel} style={wrapperStyle}>{list}</nav>
  ) : (
    <section id={state.id} aria-label={state.ariaLabel} style={wrapperStyle}>{list}</section>
  );
}
`;
}
