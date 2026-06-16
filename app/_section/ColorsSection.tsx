"use client";
import { SectionCard } from "@/components/shared/layout/SectionCard";
import ColorControl from "@/components/shared/color/ColorControl";
import type { StepperState } from "../types";

type Props = { state: StepperState; update: <K extends keyof StepperState>(key: K, value: StepperState[K]) => void };

export default function ColorsSection({ state, update }: Props) {
  return (
    <div className="space-y-4">
      <SectionCard title="Shell" subtitle="Outer container colors.">
      <div className="space-y-4">
        <ColorControl label="Background" value={state.background} onChange={(v) => update("background", v)} />
        <ColorControl label="Foreground" value={state.foreground} onChange={(v) => update("foreground", v)} />
        <ColorControl label="Accent" value={state.accent} onChange={(v) => update("accent", v)} />
        <ColorControl label="Muted" value={state.muted} onChange={(v) => update("muted", v)} />
        <ColorControl label="Border" value={state.border} onChange={(v) => update("border", v)} />
      </div>
    </SectionCard>
      <SectionCard title="Step Markers" subtitle="Circular step indicator colors.">
      <div className="space-y-4">
        <ColorControl label="Active background" value={state.activeBg} onChange={(v) => update("activeBg", v)} />
        <ColorControl label="Active text" value={state.activeText} onChange={(v) => update("activeText", v)} />
        <ColorControl label="Completed background" value={state.completedBg} onChange={(v) => update("completedBg", v)} />
        <ColorControl label="Completed text" value={state.completedText} onChange={(v) => update("completedText", v)} />
        <ColorControl label="Error background" value={state.errorBg} onChange={(v) => update("errorBg", v)} />
        <ColorControl label="Error text" value={state.errorText} onChange={(v) => update("errorText", v)} />
      </div>
    </SectionCard>
      <SectionCard title="Connector" subtitle="Line between step markers.">
      <div className="space-y-4">
        <ColorControl label="Active connector" value={state.connectorActiveColor} onChange={(v) => update("connectorActiveColor", v)} />
        <ColorControl label="Connector" value={state.connectorColor} onChange={(v) => update("connectorColor", v)} />
        <ColorControl label="Completed connector" value={state.connectorCompletedColor} onChange={(v) => update("connectorCompletedColor", v)} />
      </div>
    </SectionCard>
      <SectionCard title="Pending & hover" subtitle="Upcoming step marker and clickable hover.">
      <div className="space-y-4">
        <ColorControl label="Pending background" value={state.pendingBg} onChange={(v) => update("pendingBg", v)} />
        <ColorControl label="Pending text" value={state.pendingText} onChange={(v) => update("pendingText", v)} />
        <ColorControl label="Pending border" value={state.pendingBorder} onChange={(v) => update("pendingBorder", v)} />
        <ColorControl label="Hover background" value={state.hoverBg} onChange={(v) => update("hoverBg", v)} />
        <ColorControl label="Hover text" value={state.hoverText} onChange={(v) => update("hoverText", v)} />
      </div>
    </SectionCard>
      <SectionCard title="Text & icons" subtitle="Step text, optional label, and marker icons.">
      <div className="space-y-4">
        <ColorControl label="Step title" value={state.stepTitleColor} onChange={(v) => update("stepTitleColor", v)} />
        <ColorControl label="Step description" value={state.stepDescriptionColor} onChange={(v) => update("stepDescriptionColor", v)} />
        <ColorControl label="Optional label" value={state.optionalLabelColor} onChange={(v) => update("optionalLabelColor", v)} />
        <ColorControl label="Error icon" value={state.errorIconColor} onChange={(v) => update("errorIconColor", v)} />
        <ColorControl label="Completed icon" value={state.completedIconColor} onChange={(v) => update("completedIconColor", v)} />
      </div>
    </SectionCard>
    </div>
  );
}
