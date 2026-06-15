"use client";

import { useState, type CSSProperties } from "react";
import type { StepperState } from "../types";
import { SYSTEM_FONTS } from "@/components/shared/typography/fontConstants";

function resolveFont(state: { fontBucket: "system" | "google"; googleFontFamily: string; systemFontIdx: number }): string {
  return state.fontBucket === "google"
    ? `"${state.googleFontFamily}", sans-serif`
    : (SYSTEM_FONTS[state.systemFontIdx]?.css ?? "inherit");
}

function buildShadow(state: { shadowEnabled: boolean; shadowX: number; shadowY: number; shadowBlur: number; shadowSpread: number; shadowColor: string; shadowOpacity: number }): string {
  if (!state.shadowEnabled) return "none";
  const hex = Math.round(state.shadowOpacity * 255).toString(16).padStart(2, "0");
  return `${state.shadowX}px ${state.shadowY}px ${state.shadowBlur}px ${state.shadowSpread}px ${state.shadowColor}${hex}`;
}

function buildRadius(state: { radiusLinked: boolean; radius: number; radiusTL: number; radiusTR: number; radiusBR: number; radiusBL: number }): string {
  return state.radiusLinked
    ? `${state.radius}px`
    : `${state.radiusTL}px ${state.radiusTR}px ${state.radiusBR}px ${state.radiusBL}px`;
}

function shell(state: StepperState): CSSProperties {
  return {
    width: state.width,
    minHeight: state.height,
    padding: state.padding,
    borderRadius: buildRadius(state),
    border: `${state.borderWidth}px ${state.borderStyle} ${state.disabled && state.disabledUseCustomColors ? state.disabledBorder : state.border}`,
    boxShadow: buildShadow(state),
    background: state.disabled && state.disabledUseCustomColors ? state.disabledBg : state.background,
    color: state.foreground,
    fontFamily: resolveFont(state),
    fontStyle: state.fontStyle,
    textTransform: state.textTransform,
    textDecoration: state.textDecoration,
    letterSpacing: `${state.letterSpacing}${state.letterSpacingUnit}`,
    lineHeight: state.lineHeight,
    opacity: state.disabled ? state.disabledOpacity : 1,
    cursor: state.disabled ? state.disabledCursor : undefined,
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
  const [hoverIndex, setHoverIndex] = useState(-1);
  const list = (
    <ol className="grid" style={{ gap: state.stepGap, maxWidth: state.stepperMaxWidth, gridTemplateColumns: isVertical ? undefined : `repeat(${count}, minmax(0, 1fr))` }}>
      {steps.map((step, index) => {
        const isActive = index === activeIndex;
        const isComplete = index < activeIndex;
        const isError = index === errorIndex || (state.previewState === "error" && isActive);
        const isDisabled = state.disabled || index > activeIndex + 1;
        const isHover = state.clickable && hoverIndex === index && !isDisabled && !isActive;
        const markerBg = isError ? state.errorBg : isActive ? state.activeBg : isComplete ? state.completedBg : state.pendingBg;
        const markerColor = isError ? state.errorIconColor : isActive ? state.activeText : isComplete ? state.completedIconColor : state.pendingText;
        const markerBorder = isError ? state.errorBg : isActive ? state.accent : isComplete ? state.completedBg : state.pendingBorder;
        const cardBg = isHover ? state.hoverBg : "transparent";
        const cardColor = isDisabled ? state.muted : isHover ? state.hoverText : state.stepTitleColor;
        return (
          <li key={step} className={isVertical ? "grid grid-cols-[auto_1fr] gap-3" : "grid gap-3"}>
            <div className={isVertical ? "grid justify-items-center" : "flex items-center"} style={{ gap: state.connectorGap }}>
              <span className="grid place-items-center rounded-full font-black" style={{ width: state.markerSize, height: state.markerSize, fontSize: Math.round(state.markerSize * 0.36), border: `${state.markerBorderWidth}px solid ${markerBorder}`, background: markerBg, color: markerColor, transition: state.transitionDuration > 0 ? "background 0.2s ease, transform 0.2s ease, border-color 0.2s ease" : "none", transform: state.transitionDuration > 0 && isActive ? "scale(1.1)" : "scale(1)" }}>
                {isComplete && !state.numberedMarkers ? "OK" : index + 1}
              </span>
              {index < count - 1 && (
                <span aria-hidden="true" className={isVertical ? "w-px flex-1" : "flex-1"} style={{ height: isVertical ? undefined : state.connectorWidth, width: isVertical ? state.connectorWidth : undefined, minHeight: isVertical ? 24 : undefined, background: state.connectorStyle === "dashed" ? undefined : isComplete ? state.connectorCompletedColor : state.connectorColor, borderTop: !isVertical && state.connectorStyle === "dashed" ? `${state.connectorWidth}px dashed ${isComplete ? state.connectorCompletedColor : state.connectorColor}` : undefined, borderLeft: isVertical && state.connectorStyle === "dashed" ? `${state.connectorWidth}px dashed ${isComplete ? state.connectorCompletedColor : state.connectorColor}` : undefined, transition: state.transitionDuration > 0 ? "background 0.2s ease" : "none" }} />
              )}
            </div>
            <div
              aria-current={isActive ? "step" : undefined}
              aria-disabled={isDisabled || undefined}
              onMouseEnter={() => setHoverIndex(index)}
              onMouseLeave={() => setHoverIndex(-1)}
              className="rounded-2xl border p-3"
              style={{ borderColor: isError ? state.errorBg : isActive ? state.activeBg : state.border, background: cardBg, color: cardColor, cursor: state.clickable && !isDisabled ? "pointer" : undefined }}
            >
              <p className="text-sm font-bold">{state.label} {index + 1}</p>
              <p className="text-xs" style={{ color: state.stepDescriptionColor }}>
                {isError ? "Error" : isComplete ? "Complete" : isActive ? "Current step" : isDisabled ? "Disabled" : "Upcoming"}
                {index === optionalIndex ? <span style={{ color: state.optionalLabelColor }}> / {state.optionalLabelText}</span> : ""}
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
