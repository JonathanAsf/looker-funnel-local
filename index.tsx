import React from 'react';
import ReactDOM from 'react-dom/client';
import { FunnelViz } from './FunnelViz';

declare const looker: any;
declare const LookerCharts: any;

const defaultColors = ['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#a4de6c', '#6366f1'];

looker.plugins.visualizations.add({
  id: "recharts_custom_funnel",
  label: "Funil Recharts",

  options: {
    labelPosition: {
      type: "string",
      label: "Posição dos Rótulos",
      section: "Rotulos",
      order: 1,
      display: "select",
      values: [
        { "Direita": "right" },
        { "Esquerda": "left" },
        { "Ocultar": "none" }
      ],
      default: "right"
    },
    percentType: {
      type: "string",
      label: "Cálculo de Porcentagem",
      section: "Rotulos",
      order: 2,
      display: "select",
      values: [
        { "Nenhum": "none" },
        { "Em relação ao Topo (100%)": "top" },
        { "Conversão da Etapa Anterior": "previous" }
      ],
      default: "top"
    },
    showInnerValues: {
      type: "boolean",
      label: "Exibir Números Dentro do Funil",
      section: "Valores",
      order: 1,
      default: true
    },
    textColor: {
      type: "string",
      label: "Cor das Legendas",
      section: "Rotulos",
      order: 3,
      display: "color",
      default: "#1F2937"
    }
  },

  create: function (element: HTMLElement) {
    element.innerHTML = '<div id="recharts-root" style="width: 100%; height: 100%;"></div>';
  },

  updateAsync: function (data: any[], element: HTMLElement, config: any, queryResponse: any, details: any, done: () => void) {
    // restante do seu updateAsync permanece idêntico...

    if (!queryResponse || !queryResponse.fields || !queryResponse.fields.dimensions.length || !queryResponse.fields.measures.length) {
      if (typeof this.addError === 'function') {
        this.addError({
          title: "Campos Obrigatórios",
          message: "Selecione 1 dimensão (Etapa) e 1 métrica (Volume)."
        });
      }
      return;
    }

    const dimName = queryResponse.fields.dimensions[0].name;
    const measureName = queryResponse.fields.measures[0].name;

    const topValue = data.length > 0 ? (Number(data[0][measureName]?.value) || 0) : 0;

    // Constrói os dados calculando os percentuais dinamicamente
    const chartData = data.map((row, index) => {
      const name = LookerCharts?.Utils?.textForCell(row[dimName]) || row[dimName]?.value || 'Sem rótulo';
      const value = Number(row[measureName]?.value) || 0;
      const formattedValue = LookerCharts?.Utils?.textForCell(row[measureName]) || value.toLocaleString();

      // % em relação ao topo
      const pctOfTop = topValue > 0 ? ((value / topValue) * 100).toFixed(1) + '%' : '0%';

      // % em relação à etapa anterior
      let pctOfPrev = '100%';
      if (index > 0) {
        const prevValue = Number(data[index - 1][measureName]?.value) || 0;
        pctOfPrev = prevValue > 0 ? ((value / prevValue) * 100).toFixed(1) + '%' : '0%';
      }

      return {
        name,
        value,
        formattedValue,
        pctOfTop,
        pctOfPrev,
        fill: defaultColors[index % defaultColors.length]
      };
    });

    const rootContainer = element.querySelector('#recharts-root')!;

    if (!this._reactRoot) {
      this._reactRoot = ReactDOM.createRoot(rootContainer);
    }

    this._reactRoot.render(
      <FunnelViz
        data={chartData}
        config={{
          labelPosition: config.labelPosition || 'right',
          percentType: config.percentType || 'top',
          showInnerValues: config.showInnerValues !== false,
          textColor: config.textColor || '#1F2937'
        }}
      />
    );

    done();
  }
});