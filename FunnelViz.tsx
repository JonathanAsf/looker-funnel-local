import React from 'react';
import {
  FunnelChart,
  Funnel,
  Tooltip,
  LabelList,
  ResponsiveContainer,
  TooltipProps
} from 'recharts';

export interface FunnelItem {
  name: string;
  value: number;
  fill: string;
  formattedValue?: string;
}

interface FunnelVizProps {
  data: FunnelItem[];
  isAnimationActive?: boolean;
}

// Tooltip customizado para exibir o valor e a proporção face ao topo
const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    const item = payload[0].payload as FunnelItem;
    return (
      <div
        style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E5E7EB',
          borderRadius: '6px',
          padding: '8px 12px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}
      >
        <p style={{ margin: 0, fontWeight: 600, color: '#1F2937', fontSize: '13px' }}>
          {item.name}
        </p>
        <p style={{ margin: '4px 0 0', color: '#4B5563', fontSize: '12px' }}>
          Total: <strong>{item.formattedValue || item.value.toLocaleString()}</strong>
        </p>
      </div>
    );
  }
  return null;
};

export const FunnelViz: React.FC<FunnelVizProps> = ({
  data,
  isAnimationActive = true
}) => {
  if (!data || data.length === 0) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          color: '#6B7280',
          fontFamily: 'sans-serif'
        }}
      >
        Sem dados para apresentar.
      </div>
    );
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        minHeight: '420px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxSizing: 'border-box'
      }}
    >
      <ResponsiveContainer width="100%" height="100%" minHeight={400}>
        <FunnelChart
          margin={{
            top: 20,
            right: 120,
            bottom: 20,
            left: 20
          }}
        >
          <Tooltip content={<CustomTooltip />} />
          <Funnel
            dataKey="value"
            data={data}
            isAnimationActive={isAnimationActive}
          >
            {/* Rótulo com o nome da etapa à direita do trapézio */}
            <LabelList
              position="right"
              fill="#1F2937"
              stroke="none"
              dataKey="name"
              style={{
                fontSize: '13px',
                fontWeight: 600,
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
              }}
            />
            {/* Rótulo com o valor formatado impresso dentro de cada secção */}
            <LabelList
              position="center"
              fill="#FFFFFF"
              stroke="none"
              dataKey="value"
              formatter={(val: number) => val.toLocaleString()}
              style={{
                fontSize: '12px',
                fontWeight: 700,
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
              }}
            />
          </Funnel>
        </FunnelChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FunnelViz;