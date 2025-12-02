import { useState } from "react";
import ParetoChart from "../../../components/charts/ParetoChart";
import useAnalysisOverview from "../../../stores/useAnalysisOverview";
import PNVolumeChart from "../../../components/charts/PNVolumeChart";
import PieChartComponent from "../../../components/charts/PieChartComponent";

function OverviewDefaultCharts() {
  const { paretoCategoriesData, partNumberVolumes } = useAnalysisOverview();
  const [selectedChart, setSelectedChart] = useState(0);
  const availableCharts = [
    {
      label: "pareto chart",
      chart: <ParetoChart data={paretoCategoriesData} />,
    },
    {
      label: "P/N Volume Chart",
      chart: (
        <PNVolumeChart
          positive={partNumberVolumes.success}
          negative={partNumberVolumes.failures}
        />
      ),
    },
    {
      label: "Volumetria PNs",
      chart: (
        <PieChartComponent
          data={paretoCategoriesData.map((data) => ({
            label: data.label,
            value: data.value,
            id: data.label,
          }))}
        />
      ),
    },
  ];
  return (
    <>
      <div className="charts-buttons">
        {availableCharts.map((chart_data, index) => {
          return (
            <button
              onClick={() => setSelectedChart(index)}
              className={
                index === selectedChart
                  ? "primary no-wrap"
                  : "secondary no-wrap"
              }
            >
              {chart_data.label}
            </button>
          );
        })}
      </div>
      {availableCharts[selectedChart] != null &&
        availableCharts[selectedChart].chart}
    </>
  );
}

export default OverviewDefaultCharts;
