"use client";

import { SectionCard } from "@/components/shared/layout/SectionCard";
import Select from "@/components/shared/input/Select";
import type { StepperState } from "../types";

type Props = { state: StepperState; update: <K extends keyof StepperState>(key: K, value: StepperState[K]) => void };

export default function LayoutSection({ state, update }: Props) {
  return <SectionCard title="Layout" subtitle="Layout controls for native stepper generation."><Select label="Orientation" value={state.orientation} options={[
  "horizontal",
  "vertical"
]} onChange={(value) => update("orientation", value)} /></SectionCard>;
}
