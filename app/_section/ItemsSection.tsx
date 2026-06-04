"use client";

import { SectionCard } from "@/components/shared/layout/SectionCard";
import Slider from "@/components/shared/input/Slider";
import type { StepperState } from "../types";

type Props = { state: StepperState; update: <K extends keyof StepperState>(key: K, value: StepperState[K]) => void };

export default function ItemsSection({ state, update }: Props) {
  return <SectionCard title="Items" subtitle="Items controls for native stepper generation."><Slider label="Item count" value={state.itemCount} min={1} max={14} step={1} onChange={(value) => update("itemCount", value)} /></SectionCard>;
}
