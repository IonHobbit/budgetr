import { COLORS } from "@/constants/constants";
import { ChartOptions } from "chart.js";
import React, { useRef } from "react";
import { Pie, getElementAtEvent } from "react-chartjs-2";

interface Dataset {
  label: string;
  data: number[];
  fill?: boolean;
  backgroundColor?: string;
  borderColor?: string;
}

interface PieChartProps {
  labels: string[];
  data: Dataset[];
  options?: {
    position?: "top" | "left" | "right" | "bottom";
    title?: string;
  };
  onClick?: (value: number) => void;
}

const PieChart = ({ labels, data, options, onClick }: PieChartProps) => {
  const chartRef = useRef();
  const chartData = {
    labels: labels,
    datasets: [
      ...data.map((dataset) => ({
        ...dataset,
        fill: dataset.fill ?? false,
        backgroundColor: dataset.backgroundColor || COLORS.primary,
        borderColor: dataset.borderColor,
      })),
    ],
  };
  
  const chartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: options?.position,
      },
      title: {
        display: !!options?.title,
        text: options?.title,
      },
    },
    ...options,
  };

  const extractValue = (event: any) => {
    const activePoint = chartRef.current
      ? getElementAtEvent(chartRef.current, event)
      : [];
    const element = activePoint[0].element as any;
    if (activePoint.length > 0 && element.$context.raw) {
      const rawElement = element.$context.raw;
      if (onClick) onClick(rawElement);
    }
  };

  return (
    <div className="w-full h-full">
      <Pie
        ref={chartRef}
        data={chartData}
        options={chartOptions}
        onClick={extractValue}
      />
    </div>
  );
};

export default PieChart;
