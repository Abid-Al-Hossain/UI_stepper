"use client";

import { SectionCard } from "@/components/shared/layout/SectionCard";
import Slider from "@/components/shared/input/Slider";
import Switch from "@/components/shared/input/Switch";
import Input from "@/components/shared/input/Input";
import type { StepperState } from "../types";

type Props = { state: StepperState; update: <K extends keyof StepperState>(key: K, value: StepperState[K]) => void };

export default function ItemsSection({ state, update }: Props) {
  return (
    <div className="space-y-4">
      <SectionCard title="Items" subtitle="Items controls for native stepper generation.">
        <Slider label="Item count" value={state.itemCount} min={1} max={14} step={1} onChange={(value) => update("itemCount", value)} />
      </SectionCard>
      <SectionCard title="Marker & connector geometry" subtitle="Marker and connector sizing.">
      <div className="space-y-4">
        <Slider label="Marker size" value={state.markerSize} min={24} max={56} step={1} onChange={(value) => update("markerSize", value)} />
        <Slider label="Marker border width" value={state.markerBorderWidth} min={0} max={6} step={1} onChange={(value) => update("markerBorderWidth", value)} />
        <Slider label="Connector width" value={state.connectorWidth} min={1} max={8} step={1} onChange={(value) => update("connectorWidth", value)} />
        <Slider label="Connector gap" value={state.connectorGap} min={0} max={24} step={1} onChange={(value) => update("connectorGap", value)} />
        <Slider label="Step gap" value={state.stepGap} min={0} max={48} step={1} onChange={(value) => update("stepGap", value)} />
        <Slider label="Max width" value={state.stepperMaxWidth} min={320} max={1000} step={10} onChange={(value) => update("stepperMaxWidth", value)} />
        <Switch label="Numbered markers" checked={state.numberedMarkers} onChange={(value) => update("numberedMarkers", value)} />
        <Input label="Optional label text" value={state.optionalLabelText} onChange={(value: string) => update("optionalLabelText", value)} placeholder="Optional" />
      </div>
    </SectionCard>
    </div>
  );
}
