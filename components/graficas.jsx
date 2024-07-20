import React, { useEffect } from "react";
import ReactEcharts from "echarts-for-react";

export default function LineChart({ height, data = [], title }) {
  useEffect(() => {
    console.log("Data updated:", data);
  }, [data]);

  const option = {
    title: {
      text: title + " en tiempo real",
      left: "center",
    },
    grid: { top: "10%", bottom: "10%", left: "5%", right: "5%" },
    xAxis: {
      type: "category",
      data: Array.isArray(data) ? data.map((_, index) => index) : [],
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        fontSize: 14,
        fontFamily: "roboto",
        color: "#666",
      },
    },
    yAxis: {
      type: "value",
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: {
        lineStyle: { color: "#ccc", opacity: 0.15 },
      },
      axisLabel: {
        color: "#666",
        fontSize: 13,
        fontFamily: "roboto",
      },
    },
    series: [
      {
        data: Array.isArray(data) ? data : [],
        type: "line",
        name: title,
        smooth: true,
        symbolSize: 4,
        lineStyle: { width: 4 },
      },
    ],
  };

  return <ReactEcharts style={{ height: height }} option={option} />;
}
