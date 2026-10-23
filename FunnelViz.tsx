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
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        }}
      >
        <p
          style={{
            margin: 0,
            fontWeight: 600,
            color: "#1F2937",
            fontSize: "13px",
          }}
        >
          {item.name}
        </p>
        <p style={{ margin: "4px 0 0", color: "#4B5563", fontSize: "12px" }}>
          Total:{" "}
          <strong>{item.formattedValue || item.value.toLocaleString()}</strong>
        </p>
        <p style={{ margin: "2px 0 0", color: "#6B7280", fontSize: "11px" }}>
          Do topo: <strong>{item.pctOfTop}</strong> | Da anterior:{" "}
          <strong>{item.pctOfPrev}</strong>
        </p>
      </div>
    );
  }
  return null;
};

export const FunnelViz: React.FC<FunnelVizProps> = ({ data, config }) => {
  if (!data || data.length === 0) {
    return (
      <div style={{ padding: 20, textAlign: "center", color: "#888" }}>
        Sem dados
      </div>
    );
  }

  const formatText = (item: FunnelItem) => {
    if (config.percentType === "top") {
      return `${item.name} (${item.pctOfTop})`;
    }
    if (config.percentType === "previous") {
      return `${item.name} (${item.pctOfPrev})`;
    }
    return item.name;
  };

  const isLeft = config.labelPosition === "left";
  const isRight = config.labelPosition === "right";
  const showLabels = config.labelPosition !== "none";

  // Componente SVG customizado para calcular a posição lateral garantida
  const renderCustomOuterLabel = (props: any) => {
    const { x, y, width, height, index } = props;
    const item = data[index];
    if (!item || !showLabels) return null;

    const labelText = formatText(item);
    const midY = y + height / 2;

    // Se for na esquerda, posiciona antes da borda esquerda do trapézio; se for na direita, após a borda direita
    const targetX = isLeft ? x - 15 : x + width + 15;
    const textAnchor = isLeft ? "end" : "start";

    return (
      <text
        x={targetX}
        y={midY}
        fill={config.textColor || "#1F2937"}
        fontSize="12"
        fontWeight="600"
        textAnchor={textAnchor}
        dominantBaseline="middle"
        style={{
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        }}
      >
        {labelText}
      </text>
    );
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        minHeight: "450px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        boxSizing: "border-box",
        padding: "10px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "950px",
          height: "100%",
          minHeight: "450px",
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <FunnelChart
            margin={{
              top: 20,
              right: isRight ? 220 : 40,
              bottom: 20,
              left: isLeft ? 220 : 40,
            }}
          >
            <Tooltip content={<CustomTooltip />} />
            <Funnel dataKey="value" data={data} isAnimationActive={false}>
              {/* Valores numéricos centrais */}
              {config.showInnerValues && (
                <LabelList
                  position="center"
                  fill="#FFFFFF"
                  stroke="none"
                  dataKey="formattedValue"
                  style={{
                    fontSize: "13px",
                    fontWeight: 700,
                    fontFamily: "sans-serif",
                  }}
                />
              )}

              {/* Rótulo lateral (esquerda ou direita) */}
              {showLabels && <LabelList content={renderCustomOuterLabel} />}
            </Funnel>
          </FunnelChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default FunnelViz;
