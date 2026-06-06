"use client";

import { SectionCard } from "@/components/shared/layout/SectionCard";
import Slider from "@/components/shared/input/Slider";
import Select from "@/components/shared/input/Select";
import type { StepperState } from "../types";

type Props = { state: StepperState; update: <K extends keyof StepperState>(key: K, value: StepperState[K]) => void };

export default function StatesSection({ state, update }: Props) {
  return <SectionCard title="State Preview" subtitle="State Preview controls for native stepper generation."><Select label="Preview state" value={state.previewState} options={[
  "default",
  "hover",
  "focus",
  "active",
  "open",
  "closed",
  "selected",
  "loading",
  "empty",
  "error",
  "success"
]} onChange={(value) => update("previewState", value)} />
<Slider label="Active index" value={state.activeIndex} min={0} max={12} step={1} onChange={(value) => update("activeIndex", value)} />
<Slider label="Optional trailing steps" value={state.optionalSteps} min={0} max={6} step={1} onChange={(value) => update("optionalSteps", value)} />
<Slider label="Error step (0 is none)" value={state.errorStep} min={0} max={14} step={1} onChange={(value) => update("errorStep", value)} /></SectionCard>;
}
