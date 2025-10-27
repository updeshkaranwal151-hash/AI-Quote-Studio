import React, { useState } from 'react';

interface ChartData {
  label: string;
  value: number;
}

interface BarChartProps {
  data: ChartData[];
}

const BarChart: React.FC<BarChartProps> = ({ data }) => {
  const [tooltip, setTooltip] = useState<{ x: number; y: number; label: string; value: number } | null>(null);
  
  if (!data || data.length === 0) {
    return <div className="flex items-center justify-center h-full text-slate-500">No data available</div>;
  }
  
  const padding = { top: 20, bottom: 40, left: 10, right: 10 };
  const width = 500;
  const height = 288;
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  
  const maxValue = Math.max(...data.map(d => d.value), 1);
  const barWidth = chartWidth / data.length * 0.6;
  const barSpacing = chartWidth / data.length * 0.4;

  const handleMouseOver = (d: ChartData, i: number) => {
    const barHeight = (d.value / maxValue) * chartHeight;
    const x = padding.left + i * (barWidth + barSpacing) + barWidth / 2;
    const y = padding.top + chartHeight - barHeight;
    setTooltip({ x, y, label: d.label, value: d.value });
  };
  
  return (
    <div className="w-full h-full relative">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
        {data.map((d, i) => {
          const barHeight = (d.value / maxValue) * chartHeight;
          const x = padding.left + i * (barWidth + barSpacing);
          const y = padding.top + chartHeight - barHeight;
          return (
            <g key={i}>
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                className="fill-sky-500 hover:fill-sky-400 transition-colors"
                onMouseOver={() => handleMouseOver(d, i)}
                onMouseLeave={() => setTooltip(null)}
              />
              <text
                x={x + barWidth / 2}
                y={height - padding.bottom + 15}
                textAnchor="middle"
                className="text-xs fill-slate-400"
              >
                {d.label.length > 5 ? `${d.label.substring(0, 4)}..` : d.label}
              </text>
            </g>
          );
        })}
      </svg>
      {tooltip && (
        <div 
            className="absolute bg-slate-900/80 backdrop-blur-sm border border-slate-600 rounded-md p-2 text-center text-white text-xs shadow-lg pointer-events-none"
            style={{
                top: tooltip.y - 50,
                left: `calc(${tooltip.x / width * 100}%)`,
                transform: 'translateX(-50%)',
                transition: 'top 0.2s, left 0.2s',
            }}
        >
            <div className="font-bold">{tooltip.value}</div>
            <div className="text-slate-400">{tooltip.label}</div>
        </div>
      )}
    </div>
  );
};

export default BarChart;