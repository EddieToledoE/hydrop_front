import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import estilos from "@/styles/Grafica.css";

const Grafica3 = ({ data }) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const ctx = chartRef.current.getContext("2d");

    const labels = data.map((d) => new Date(d.timestamp).toLocaleString());
    const values = data.map((d) => d.value);

    chartInstanceRef.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Conductividad Eléctrica (EC)",
            data: values,
            backgroundColor: "rgba(54, 162, 235, 0.2)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1,
            borderRadius: 10,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }, [data]);

  return (
    <div className="Grafica">
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default Grafica3;
