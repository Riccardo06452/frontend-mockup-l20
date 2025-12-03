import { ResponsivePieCanvas } from "@nivo/pie";

function PieChartComponent({ data }) {
  // data must be in this format
  // [ { id: "java", label: "java", value: 55 }, { id: "python", label: "python", value: 75 } ]

  return (
    <div style={{ width: "100%", height: "250px" }}>
      <ResponsivePieCanvas /* or PieCanvas for fixed dimensions */
        data={data}
        defaultWidth={200}
        defaultHeight={200}
        margin={{ top: 40, bottom: 40, left: 40, right: 40 }}
        innerRadius={0.25}
        padAngle={1}
        activeOuterRadiusOffset={8}
        colors={{ scheme: "reds" }}
        borderColor={{ from: "color", modifiers: [["darker", 1.1]] }}
        arcLinkLabelsTextOffset={9}
        arcLinkLabelsTextColor="#333333"
        arcLinkLabelsOffset={-6}
        arcLink
        arcLinkLabelsDiagonalLength={13}
        arcLinkLabelsStraightLength={16}
        arcLinkLabelsThickness={0}
        arcLinkLabel={"label"}
        arcLinkLabelsColor={{ from: "color" }}
        enableArcLabels={false}
      />
    </div>
  );
}

export default PieChartComponent;
