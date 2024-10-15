import { cn } from "#lib/utils";
import { useId, type ComponentProps } from "react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";

export interface SparklineProps extends ComponentProps<"div"> {
  data: { value: number }[];
}
export function Sparkline(props: SparklineProps) {
  const { className, id: customId, data, ...rest } = props;

  const id = useId();

  return (
    <div
      className={cn("w-full h-8", className)}
      id={customId ?? `sparkline-${id.slice(1, -1)}`}
      {...rest}
    >
      <ResponsiveContainer>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="area-color" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="currentcolor" stopOpacity={0.8} />
              <stop offset="95%" stopColor="currentcolor" stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="value"
            stroke="currentcolor"
            strokeWidth={2}
            fill="url(#area-color)"
            baseLine={0}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
