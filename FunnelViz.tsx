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
            fontWeight: 700,
            color: "#1F2937",
            fontSize: "14px",
          }}
        >
          {item.name}
        </p>
        <p style={{ margin: "4px 0 0", color: "#4B5563", fontSize: "12px" }}>
          Volume:{" "}
          <strong>{item.formattedValue || item.value.toLocaleString()}</strong>
        </p>
        <p style={{ margin: "2px 0 0", color: "#6B7280", fontSize: "12px" }}>
          Proporção: <strong>{item.pctOfTop}</strong>
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

  const isLeft = config.labelPosition === "left";
  const isRight = config.labelPosition === "right";
  const showLabels = config.labelPosition !== "none";

  // Formata o que vai aparecer na coluna lateral (Porcentagem + Valor)
  const getSideText = (item: FunnelItem) => {
    const pct =
      config.percentType === "previous" ? item.pctOfPrev : item.pctOfTop;
    return {
      percentage: pct,
      rawValue: item.formattedValue || item.value.toLocaleString(),
    };
  };

  // Coluna lateral que agora mostra a PORCENTAGEM em evidência e o valor bruto
  const LabelsColumn = (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-around",
        height: "100%",
        minWidth: "180px",
        maxWidth: "240px",
        padding: "16px 12px",
        boxSizing: "border-box",
        textAlign: isLeft ? "right" : "left",
      }}
    >
      {data.map((item, idx) => {
        const { percentage, rawValue } = getSideText(item);
        return (
          <div
            key={idx}
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            {/* Porcentagem em evidência */}
            <span
              style={{
                color: config.textColor || "#1F2937",
                fontSize: "16px",
                fontWeight: 700,
                fontFamily:
                  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
              }}
            >
              {percentage}
            </span>
            {/* Valor numérico bruto menor abaixo da porcentagem */}
            <span
              style={{
                fontSize: "11px",
                color: "#6B7280",
                marginTop: "2px",
                fontFamily:
                  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
              }}
            >
              {rawValue} ocorrências
            </span>
          </div>
        );
      })}
    </div>
  );

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        minHeight: "480px",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "stretch",
        boxSizing: "border-box",
        padding: "10px 20px",
      }}
    >
      {/* Coluna de Porcentagem à Esquerda */}
      {showLabels && isLeft && LabelsColumn}

      {/* Funil Central com o NOME DA ETAPA em evidência dentro da fatia */}
      <div
        style={{
          flex: 1,
          maxWidth: "750px",
          height: "100%",
          minHeight: "480px",
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <FunnelChart margin={{ top: 20, right: 10, bottom: 20, left: 10 }}>
            <Tooltip content={<CustomTooltip />} />
            <Funnel dataKey="value" data={data} isAnimationActive={false}>
              {/* O NOME DA ETAPA (ex: Clicked, Sent, Read) fica em evidência no centro da fatia */}
              <LabelList
                position="center"
                fill="#FFFFFF"
                stroke="none"
                dataKey="name"
                style={{
                  fontSize: "14px",
                  fontWeight: 700,
                  letterSpacing: "0.5px",
                  textShadow: "0 1px 2px rgba(0,0,0,0.4)",
                  fontFamily:
                    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                }}
              />
            </Funnel>
          </FunnelChart>
        </ResponsiveContainer>
      </div>

      {/* Coluna de Porcentagem à Direita */}
      {showLabels && isRight && LabelsColumn}
    </div>
  );
};

export default FunnelViz;
