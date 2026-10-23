import React from "react";
import {
  FunnelChart,
  Funnel,
  Tooltip,
  LabelList,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";

export interface FunnelItem {
  name: string;
  value: number;
  fill: string;
  formattedValue?: string;
  pctOfTop: string;
  pctOfPrev: string;
}

interface VizConfig {
  labelPosition: "right" | "left" | "none";
  percentType: "top" | "previous" | "none";
  showInnerValues: boolean;
  textColor: string;
}

interface FunnelVizProps {
  data: FunnelItem[];
  config: VizConfig;
}

const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    const item = payload[0].payload as FunnelItem;
    return (
      <div
        style={{
          backgroundColor: "#FFFFFF",
          border: "1px solid #E5E7EB",
          borderRadius: "6px",
          padding: "8px 12px",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        }}
      >
        <p style={{ margin: 0, fontWeight: 600, color: "#1F2937", fontSize: "13px" }}>
          {item.name}
        </p>
        <p style={{ margin: "4px 0 0", color: "#4B5563", fontSize: "12px" }}>
          Total: <strong>{item.formattedValue || item.value.toLocaleString()}</strong>
        </p>
        <p style={{ margin: "2px 0 0", color: "#6B7280", fontSize: "11px" }}>
          Do topo: <strong>{item.pctOfTop}</strong> | Da anterior: <strong>{item.pctOfPrev}</strong>
        </p>
      </div>
    );
  }
  return null;
};

export const FunnelViz: React.FC<FunnelVizProps> = ({ data, config }) => {
  if (!data || data.length === 0) {
    return <div style={{ padding: 20, textAlign: "center", color: "#888" }}>Sem dados</div>;
  }

  const formatOuterLabel = (item: FunnelItem) => {
    if (config.percentType === "top") {
      return `${item.name} (${item.pctOfTop})`;
    }
    if (config.percentType === "previous") {
      return `${item.name} (${item.pctOfPrev})`;
    }
    return item.name;
  };

  const hasLeftLabel = config.labelPosition === "left";
  const hasRightLabel = config.labelPosition === "right";

  return (
    <div style={{ width: "100%", height: "100%", minHeight: "450px" }}>
      <ResponsiveContainer width="100%" height="100%">
        <FunnelChart
          margin={{
            top: 20,
            right: hasRightLabel ? 160 : 30,
            bottom: 20,
            left: hasLeftLabel ? 160 : 30,
          }}
        >
          <Tooltip content={<CustomTooltip />} />
          <Funnel dataKey="value" data={data} isAnimationActive={true}>
            {/* Números dentro da fatia */}
            {config.showInnerValues && (
              <LabelList
                position="center"
                fill="#FFFFFF"
                stroke="none"
                dataKey="formattedValue"
                style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  fontFamily: "sans-serif",
                }}
              />
            )}

            {/* Nomes das etapas e porcentagem do lado de fora */}
            {config.labelPosition !== "none" && (
              <LabelList
                position={config.labelPosition}
                fill={config.textColor}
                stroke="none"
                content={({ x, y, ...rest }: any) => {
                  const item = rest.payload as FunnelItem;
                  if (!item) return null;
                  const text = formatOuterLabel(item);
                  return (
                    <text
                      x={x}
                      y={y}
                      fill={config.textColor}
                      fontSize="12"
                      fontWeight="600"
                      dominantBaseline="middle"
                      textAnchor={config.labelPosition === "left" ? "end" : "start"}
                    >
                      {text}
                    </text>
                  );
                }}
              />
            )}
          </Funnel>
        </FunnelChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FunnelViz;