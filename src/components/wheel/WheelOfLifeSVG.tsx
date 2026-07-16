import { useMemo, useState } from "react";

export type WheelAxis = { key: string; label: string; color?: string };

interface Props {
  axes: WheelAxis[];
  values: Record<string, number>; // 0..10
  onChange?: (key: string, value: number) => void;
  size?: number;
  levels?: number;
  readOnly?: boolean;
}

const DEFAULT_COLORS = [
  "#ef4444", "#f97316", "#f59e0b", "#84cc16",
  "#10b981", "#06b6d4", "#3b82f6", "#8b5cf6",
  "#ec4899", "#f43f5e", "#14b8a6", "#a855f7",
];

export function WheelOfLifeSVG({
  axes,
  values,
  onChange,
  size = 520,
  levels = 10,
  readOnly = false,
}: Props) {
  const [hover, setHover] = useState<{ axis: string; level: number } | null>(null);
  const cx = size / 2;
  const cy = size / 2;
  const rMax = size / 2 - 60;
  const n = axes.length;
  const anglePer = (Math.PI * 2) / n;

  const segments = useMemo(() => {
    return axes.map((axis, i) => {
      const startAngle = -Math.PI / 2 + i * anglePer;
      const endAngle = startAngle + anglePer;
      const color = axis.color ?? DEFAULT_COLORS[i % DEFAULT_COLORS.length];
      const levelsArr = Array.from({ length: levels }, (_, l) => {
        const rInner = ((l) / levels) * rMax;
        const rOuter = ((l + 1) / levels) * rMax;
        const p1 = polar(cx, cy, rInner, startAngle);
        const p2 = polar(cx, cy, rOuter, startAngle);
        const p3 = polar(cx, cy, rOuter, endAngle);
        const p4 = polar(cx, cy, rInner, endAngle);
        const largeArc = anglePer > Math.PI ? 1 : 0;
        const d = [
          `M ${p1.x} ${p1.y}`,
          `L ${p2.x} ${p2.y}`,
          `A ${rOuter} ${rOuter} 0 ${largeArc} 1 ${p3.x} ${p3.y}`,
          `L ${p4.x} ${p4.y}`,
          `A ${rInner} ${rInner} 0 ${largeArc} 0 ${p1.x} ${p1.y}`,
          "Z",
        ].join(" ");
        return { d, level: l + 1 };
      });
      const midAngle = startAngle + anglePer / 2;
      const labelPos = polar(cx, cy, rMax + 30, midAngle);
      return { axis, color, levelsArr, midAngle, labelPos, startAngle, endAngle };
    });
  }, [axes, anglePer, cx, cy, rMax, levels, n]);

  return (
    <div className="w-full flex justify-center">
      <svg viewBox={`0 0 ${size} ${size}`} width="100%" style={{ maxWidth: size }} className="select-none">
        {/* grid rings */}
        {Array.from({ length: levels }).map((_, i) => (
          <circle key={i} cx={cx} cy={cy} r={((i + 1) / levels) * rMax}
            fill="none" stroke="var(--border)" strokeWidth={0.5} opacity={0.4} />
        ))}

        {/* segments */}
        {segments.map(({ axis, color, levelsArr }) => {
          const currentVal = values[axis.key] ?? 0;
          return (
            <g key={axis.key}>
              {levelsArr.map(({ d, level }) => {
                const filled = level <= currentVal;
                const isHover = hover?.axis === axis.key && level <= hover.level;
                return (
                  <path
                    key={level}
                    d={d}
                    fill={filled || isHover ? color : "transparent"}
                    fillOpacity={filled ? 0.85 : isHover ? 0.35 : 0}
                    stroke={color}
                    strokeOpacity={0.5}
                    strokeWidth={0.5}
                    style={{ cursor: readOnly ? "default" : "pointer", transition: "fill-opacity 120ms" }}
                    onMouseEnter={() => !readOnly && setHover({ axis: axis.key, level })}
                    onMouseLeave={() => !readOnly && setHover(null)}
                    onClick={() => !readOnly && onChange?.(axis.key, level === currentVal ? level - 1 : level)}
                  />
                );
              })}
            </g>
          );
        })}

        {/* axis lines */}
        {segments.map(({ axis, startAngle }) => {
          const end = polar(cx, cy, rMax, startAngle);
          return <line key={`l-${axis.key}`} x1={cx} y1={cy} x2={end.x} y2={end.y}
            stroke="var(--border)" strokeWidth={0.8} opacity={0.6} />;
        })}

        {/* labels */}
        {segments.map(({ axis, labelPos, midAngle, color }) => {
          const val = values[axis.key] ?? 0;
          const anchor =
            Math.abs(Math.cos(midAngle)) < 0.2 ? "middle" :
            Math.cos(midAngle) > 0 ? "start" : "end";
          return (
            <g key={`t-${axis.key}`}>
              <text x={labelPos.x} y={labelPos.y} textAnchor={anchor} dominantBaseline="middle"
                fontSize={13} fontWeight={600} fill="var(--foreground)">
                {axis.label}
              </text>
              <text x={labelPos.x} y={labelPos.y + 14} textAnchor={anchor} dominantBaseline="middle"
                fontSize={11} fill={color} fontWeight={700}>
                {val}/10
              </text>
            </g>
          );
        })}

        {/* center */}
        <circle cx={cx} cy={cy} r={4} fill="var(--foreground)" />
      </svg>
    </div>
  );
}

function polar(cx: number, cy: number, r: number, angle: number) {
  return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
}
