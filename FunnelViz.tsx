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

  // Coluna de legendas calculada dinamicamente
  const LabelsColumn = (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-around",
        height: "100%",
        minWidth: "220px",
        maxWidth: "320px",
        padding: "16px 12px",
        boxSizing: "border-box",
        textAlign: isLeft ? "right" : "left",
      }}
    >
      {data.map((item, idx) => (
        <div
          key={idx}
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
          }}
        >
          <span
            style={{
              color: config.textColor || "#1F2937",
              fontSize: "13px",
              fontWeight: 600,
              fontFamily:
                "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            }}
            title={item.name}
          >
            {formatText(item)}
          </span>
          {config.percentType !== "none" && (
            <span
              style={{
                fontSize: "11px",
                color: "#6B7280",
                marginTop: "2px",
                fontFamily:
                  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
              }}
            >
              {config.percentType === "top"
                ? `${item.pctOfTop} do início`
                : `${item.pctOfPrev} da etapa anterior`}
            </span>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        minHeight: "450px",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "stretch",
        boxSizing: "border-box",
        padding: "10px 20px",
      }}
    >
      {/* Se for Esquerda, a coluna de textos entra antes do gráfico */}
      {showLabels && isLeft && LabelsColumn}

      {/* Área central com o funil Recharts */}
      <div
        style={{
          flex: 1,
          maxWidth: "750px",
          height: "100%",
          minHeight: "450px",
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <FunnelChart margin={{ top: 20, right: 10, bottom: 20, left: 10 }}>
            <Tooltip content={<CustomTooltip />} />
            <Funnel dataKey="value" data={data} isAnimationActive={false}>
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
            </Funnel>
          </FunnelChart>
        </ResponsiveContainer>
      </div>

      {/* Se for Direita, a coluna de textos entra depois do gráfico */}
      {showLabels && isRight && LabelsColumn}
    </div>
  );
};

export default FunnelViz;
