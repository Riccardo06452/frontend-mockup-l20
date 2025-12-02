import { ResponsiveBar } from "@nivo/bar";
import { ResponsiveLine } from "@nivo/line";

export default function ParetoChart({ data }) {
  // data must be: [{ label: "A", value: 100 }, { label: "B", value: 60 }, ... ]

  const sorted = [...data].sort((a, b) => b.value - a.value);
  const total = sorted.reduce((s, d) => s + d.value, 0);

  const cumulative = [];
  let sum = 0;

  sorted.forEach((d) => {
    sum += d.value;
    cumulative.push({
      x: d.label,
      y: Number(((sum / total) * 100).toFixed(1)),
    });
  });

  return (
    <div style={{ height: 400, position: "relative" }}>
      {/* BARS */}
      <ResponsiveBar
        data={sorted}
        keys={["value"]}
        indexBy="label"
        margin={{ top: 40, right: 80, bottom: 50, left: 50 }}
        axisLeft={{ legend: "Frequenza", legendPosition: "middle" }}
        axisBottom={{ legend: "Categorie", legendPosition: "middle" }}
        padding={0.3}
        enableLabel={false}
      />

      {/* LINE */}
      <div
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
      >
        <ResponsiveLine
          data={[
            {
              id: "Cumulative",
              data: cumulative,
            },
          ]}
          margin={{ top: 40, right: 80, bottom: 50, left: 50 }}
          yScale={{ type: "linear", min: 0, max: 100 }}
          axisLeft={null}
          axisBottom={null}
          enableGridX={false}
          enableGridY={false}
          axisRight={{
            legend: "% cumulativo",
            legendPosition: "middle",
          }}
          enablePoints={true}
          colors={["#ff4400"]}
        />
      </div>
    </div>
  );
}
