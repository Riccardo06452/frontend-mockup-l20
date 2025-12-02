import { ResponsiveBar } from "@nivo/bar";

export default function PNVolumeChart({ positive, negative }) {
  const data = [
    { label: "Positivi", value: positive },
    { label: "Negativi", value: negative },
  ];

  return (
    <div style={{ height: 300 }}>
      <ResponsiveBar
        data={data}
        keys={["value"]}
        indexBy="label"
        margin={{ top: 40, right: 40, bottom: 50, left: 50 }}
        padding={0.3}
        colors={{ scheme: "set1" }}
        axisBottom={{
          tickRotation: -30,
        }}
      />
    </div>
  );
}
