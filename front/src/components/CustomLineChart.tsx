import { LineChart } from "@mui/x-charts/LineChart";

type Props = {
  xData: number[];
  chartData: number[];
  xLabel?: string;
  yLabel?: string;
  width?: number;
  height?: number;
  title?: string;
};

export default function CustomLineChart({
  xData,
  chartData,
  xLabel = "月",
  yLabel = "円",
  width = 400,
  height = 300,
  title = "貯金残高推移予測",
}: Props) {
  return (
    <LineChart
      xAxis={[
        {
          data: xData,
          label: xLabel,
          min: 1,
          tickInterval: xData,
        },
      ]}
      yAxis={[
        {
          label: yLabel,
          labelFontSize: 14,
          tickNumber: 6,
          labelStyle: {
            transform: "translateX(-50px)",
          },
        },
      ]}
      series={[
        {
          data: chartData,
          label: title,
        },
      ]}
      width={width}
      height={height}
      margin={{
        left: 100,
      }}
      grid={{ vertical: true, horizontal: true }}
    />
  );
}
