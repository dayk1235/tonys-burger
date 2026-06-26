"use client";

interface ScenarioSliderProps {
  value: number;
  onChange: (value: number) => void;
}

export function ScenarioSlider({ value, onChange }: ScenarioSliderProps) {
  return (
    <div className="flex items-center justify-end gap-4 w-full">
      <input
        type="range"
        min={0}
        max={10}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1.5 w-full max-w-[140px] cursor-pointer appearance-none rounded-full bg-border accent-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
      />
      <span className="w-10 text-right text-[15px] font-medium text-text-primary">
        {value}%
      </span>
    </div>
  );
}
