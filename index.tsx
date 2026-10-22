import React from "react";
import ReactDOM from "react-dom/client";
import { FunnelViz } from "./recharPuro";

declare const looker: any;
declare const LookerCharts: any;

const defaultColors = ["#8884d8", "#83a6ed", "#8dd1e1", "#82ca9d", "#a4de6c"];

looker.plugins.visualizations.add({
  id: "recharts_custom_funnel",
  label: "Funil Recharts",
  options: {},

  create: function (element: HTMLElement) {
    element.innerHTML =
      '<div id="recharts-root" style="width: 100%; height: 100%;"></div>';
  },

  updateAsync: function (
    data: any[],
    element: HTMLElement,
    config: any,
    queryResponse: any,
    details: any,
    done: () => void,
  ) {
    if (typeof this.clearErrors === "function") this.clearErrors();

    if (
      !queryResponse ||
      !queryResponse.fields ||
      !queryResponse.fields.dimensions.length ||
      !queryResponse.fields.measures.length
    ) {
      if (typeof this.addError === "function") {
        this.addError({
          title: "Campos Obrigatórios",
          message: "Selecione 1 dimensão (Etapa) e 1 medida (Volume).",
        });
      }
      return;
    }

    const dimName = queryResponse.fields.dimensions[0].name;
    const measureName = queryResponse.fields.measures[0].name;

    // Transforma a resposta do Looker no formato do Recharts
    const chartData = data.map((row, index) => {
      const name =
        LookerCharts?.Utils?.textForCell(row[dimName]) ||
        row[dimName]?.value ||
        "";
      const value = Number(row[measureName]?.value) || 0;
      return {
        name,
        value,
        fill: defaultColors[index % defaultColors.length],
      };
    });

    const rootContainer = element.querySelector("#recharts-root")!;

    if (!this._reactRoot) {
      this._reactRoot = ReactDOM.createRoot(rootContainer);
    }

    this._reactRoot.render(
      <FunnelViz data={chartData} isAnimationActive={true} />,
    );

    done();
  },
});
