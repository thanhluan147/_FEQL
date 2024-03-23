import { ResponsiveLine } from "@nivo/line";
import { useTheme } from "@mui/material";
import { tokens } from "../theme";
import { mockLineData as data } from "../data/mockData";
import { useEffect, useState } from "react";
import i18n from "../i18n/i18n";
import { useTranslation } from "react-i18next";

const LineChart = ({
  isCustomLineColors = false,
  isDashboard = false,
  stateDoanhthu,
  minD,
  maxD,
}) => {
  useTranslation();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [stateDataMoc, setstateDataMoc] = useState([]);

  const handleMockdata = () => {
    const transformedData = stateDoanhthu.map((item) => {
      let temp =
        item.thoidiem.split(" ")[0].split("-")[1] +
        "-" +
        item.thoidiem.split(" ")[0].split("-")[2];
      return {
        ...item,
        x: temp,
        y: item.sotienThucte,
      };
    });

    const mockdata = [];
    transformedData.forEach((obj) => {
      const datatemp = {
        id: "obj".storeID,
        x: obj.x,
        y: obj.y,
      };

      mockdata.push(datatemp);
    });

    setstateDataMoc(mockdata);
  };

  useEffect(() => {
    // Tìm giá trị lớn nhất

    if (stateDoanhthu.length !== 0) {
      handleMockdata();
    }
  }, [stateDoanhthu]); // [arrayObjects] là một mảng dependency, useEffect sẽ được gọi lại khi giá trị của mảng này thay đổi

  const mockLineData = [
    {
      id: i18n.t("SOTIEN_NP"),
      color: tokens("dark").greenAccent[500],
      data: stateDataMoc,
    },
  ];
  useEffect(() => {
    // console.log("Child State has changed:", stateDoanhthu);
    // console.log("xem max " + maxD);
    // console.log("xem min " + minD);
  }, [stateDoanhthu]);
  return (
    <>
      {stateDoanhthu.length !== 0 ? (
        <ResponsiveLine
          data={mockLineData}
          theme={{
            axis: {
              domain: {
                line: {
                  stroke: colors.greenAccent[100],
                },
              },
              legend: {
                text: {
                  fill: colors.greenAccent[100],
                },
              },
              ticks: {
                line: {
                  stroke: colors.greenAccent[100],
                  strokeWidth: 1,
                },
                text: {
                  fill: colors.greenAccent[100],
                },
              },
            },
            legends: {
              text: {
                fill: colors.greenAccent[100],
              },
            },
            tooltip: {
              container: {
                color: colors.redAccent[500],
              },
            },
          }}
          colors={isDashboard ? { datum: "color" } : { scheme: "nivo" }} // added
          margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
          xScale={{
            type: "point",
            min: "auto", // Có thể sử dụng 'auto' hoặc giá trị tối thiểu cụ thể
            max: "auto", // Có thể sử dụng 'auto' hoặc giá trị tối đa cụ thể
          }}
          yScale={{
            type: "linear",
            min: minD, // Có thể sử dụng 'auto' hoặc giá trị tối thiểu cụ thể
            max: maxD, // Có thể sử dụng 'auto' hoặc giá trị tối đa cụ thể
          }}
          yFormat=" >-.2f"
          curve="catmullRom"
          axisTop={null}
          axisRight={null}
          axisBottom={{
            orient: "bottom",
            tickSize: 0,
            tickPadding: 5,
            tickRotation: 0,
            legend: isDashboard ? undefined : "transportation", // added
            legendOffset: 36,
            legendPosition: "middle",
          }}
          axisLeft={{
            orient: "left",
            tickValues: 5, // added
            tickSize: 3,
            tickPadding: 5,
            tickRotation: 0,
            legend: isDashboard ? undefined : "count", // added
            legendOffset: -40,
            legendPosition: "middle",
          }}
          enableGridX={false}
          enableGridY={false}
          pointSize={10}
          pointColor={{ theme: "background" }}
          pointBorderWidth={2}
          pointBorderColor={{ from: "serieColor" }}
          pointLabelYOffset={-12}
          useMesh={true}
          legends={[
            {
              anchor: "bottom-right",
              direction: "column",
              justify: false,
              translateX: 100,
              translateY: 0,
              itemsSpacing: 0,
              itemDirection: "left-to-right",
              itemWidth: 80,
              itemHeight: 20,
              itemOpacity: 0.75,
              symbolSize: 12,
              symbolShape: "circle",
              symbolBorderColor: "rgba(0, 0, 0, .5)",
              effects: [
                {
                  on: "hover",
                  style: {
                    itemBackground: "rgba(0, 0, 0, .03)",
                    itemOpacity: 1,
                  },
                },
              ],
            },
          ]}
        />
      ) : (
        " "
      )}
    </>
  );
};

export default LineChart;
