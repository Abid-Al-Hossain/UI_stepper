"use client";

import { SectionCard } from "@/components/shared/layout/SectionCard";
import Input from "@/components/shared/input/Input";
import Select from "@/components/shared/input/Select";
import type { StepperState } from "../types";

type Props = { state: StepperState; update: <K extends keyof StepperState>(key: K, value: StepperState[K]) => void };

export default function MetadataSection({ state, update }: Props) {
  return <SectionCard title="Metadata" subtitle="Metadata controls for native stepper generation."><Input label="id" value={state.id} onChange={(value) => update("id", value)} />
<Input label="aria-label" value={state.ariaLabel} onChange={(value) => update("ariaLabel", value)} />
<Select label="Native wrapper" value={state.role} options={[
  "list",
  "navigation"
]} onChange={(value) => update("role", value)} /></SectionCard>;
}
