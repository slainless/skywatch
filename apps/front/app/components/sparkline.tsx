import { cn } from "#lib/utils";
import { useId, type ComponentProps } from "react";
import { Area, AreaChart, ResponsiveContainer, YAxis } from "recharts";
import type { AxisDomain } from "recharts/types/util/types";

export interface SparklineProps extends ComponentProps<"div"> {
  data: { value: number }[];
  domainY?: AxisDomain;
}
export function Sparkline(props: SparklineProps) {
  const { className, id: customId, data, domainY, ...rest } = props;

  const id = useId();

  return (
    <div
      className={cn("w-full h-12", className)}
      id={customId ?? `sparkline-${id.slice(1, -1)}`}
      {...rest}
    >
      <ResponsiveContainer>
        <AreaChart
          data={data}
          margin={{ top: 0, bottom: 0, left: 0, right: 0 }}
        >
          <defs>
            <linearGradient id={`${id}-area-color`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="currentcolor" stopOpacity={0.8} />
              <stop offset="95%" stopColor="currentcolor" stopOpacity={0} />
            </linearGradient>
          </defs>
          <YAxis hide={true} domain={domainY} />
          <Area
            type="monotone"
            dataKey="value"
            stroke="currentcolor"
            strokeWidth={2}
            fill={`url(#${id}-area-color)`}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
