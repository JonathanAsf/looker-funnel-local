import React from "react";
import {
  FunnelChart,
  Funnel,
  Tooltip,
  LabelList,
  ResponsiveContainer,
} from "recharts";

interface FunnelItem {
  name: string;
  value: number;
  fill: string;
}

interface Props {
  data: FunnelItem[];
  isAnimationActive?: boolean;
}

export const FunnelViz = ({ data, isAnimationActive = true }: Props) => {
  return (
    <ResponsiveContainer width="100%" height="100%" minHeight={400}>
      <FunnelChart margin={{ right: 80, top: 20, bottom: 20 }}>
        <Tooltip />
        <Funnel
          dataKey="value"
          data={data}
          isAnimationActive={isAnimationActive}
        >
          <LabelList
            position="right"
            fill="#1F2937"
            stroke="none"
            dataKey="name"
          />
        </Funnel>
      </FunnelChart>
    </ResponsiveContainer>
  );
};
