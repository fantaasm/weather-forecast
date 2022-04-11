import { ResponsiveLineCanvas } from "@nivo/line";
import { useState } from "react";
import { Index } from "../types";
import { convertTimeToHumanReadable } from "../services/dateUtils";

type Props = {
  data?: Index[];
  interval: number;
};

type GraphProperty = {
  name: string;
  propertyName: string;
  postFix: string;
};

const properties: GraphProperty[] = [
  { name: "Humidity", propertyName: "humidity", postFix: "%" },
  { name: "Pressure", propertyName: "pressure", postFix: "psi" },
  { name: "Temperature", propertyName: "temp", postFix: "C" },
  { name: "Visibility", propertyName: "visibility", postFix: "m" },
  { name: "Wind speed", propertyName: "wind_speed", postFix: "m\\s" },
];

const LineGraph = ({ data, interval }: Props): JSX.Element => {
  const [index, setIndex] = useState<number>(0);

  if (!data) return <h1>Please add a city to the list to display graphs</h1>;

  const graphData = data
    .filter((value, index) => index % interval == 0)
    .map((hourly) => ({
      x: convertTimeToHumanReadable(hourly.dt),
      //@ts-ignore
      y: hourly[properties[index].propertyName],
    }));

  return (
    <div className="overflow-hidden h-full w-full">
      <div className={"flex justify-center items-center gap-x-4 h-1/5"}>
        <button
          className={"basis-1/3 text-right"}
          onClick={() => setIndex(index - 1)}
          disabled={index <= 0}
        >
          {"<"}
        </button>
        <h3
          className={"tracking-wide font-semibold inline basis-1/3 text-center"}
        >{`${properties[index].name} over time`}</h3>
        <button
          className={"basis-1/3 text-left"}
          onClick={() => setIndex(index + 1)}
          disabled={index >= properties.length - 1}
        >
          {">"}
        </button>
      </div>
      <div className={"h-4/5"}>
        <ResponsiveLineCanvas
          margin={{
            top: 20,
            bottom: 20,
            left: 15,
            right: 15,
          }}
          theme={{
            textColor: "white",
            grid: {
              line: {
                stroke: "#d6d6d6",
                strokeWidth: 0.5,
              },
            },
          }}
          data={[
            {
              id: properties[index].name,
              data: graphData,
            },
          ]}
          xScale={{ type: "point" }}
          yScale={{
            type: "linear",
            min: "auto",
            max: "auto",
            stacked: true,
            reverse: false,
          }}
          axisLeft={null}
          curve="monotoneX"
          enableGridY={false}
          pointSize={10}
          pointColor={{ theme: "grid.line.stroke" }}
          pointBorderWidth={2}
          pointBorderColor={{ from: "serieColor" }}
          enableArea={true}
          tooltip={({ point }) => {
            return (
              <div className={"bg-slate-900 p-2 border border-gray-600"}>
                <div>{`${properties[index].name}: ${
                  Math.floor(point.data.y as number) + " " + properties[index].postFix
                }`}</div>
              </div>
            );
          }}
        />
      </div>
    </div>
  );
};

export default LineGraph;
