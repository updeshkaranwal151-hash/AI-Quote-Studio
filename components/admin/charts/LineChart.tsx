import React, { useState } from 'react';

interface ChartData {
  label: string;
  value: number;
}

interface LineChartProps {
  data: ChartData[];
}

const LineChart: React.FC<LineChartProps> = ({ data }) => {
  const [tooltip, setTooltip] = useState<{ x: number; y: number; label: string; value: number } | null>(null);
  
  if (!data || data.length === 0) {
    return <div className="flex items-center justify-center h-full text-slate-500">No data available</div>;
  }

  const padding = 40;
  const width = 500;
  const height = 288; // h-72 from parent
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  const maxValue = Math.max(...data.map(d => d.value), 1);
  const xStep = chartWidth / (data.length - 1 || 1);

  const points = data.map((d, i) => {
    const x = padding + i * xStep;
    const y = padding + chartHeight - (d.value / maxValue) * chartHeight;
    return { x, y, value: d.value, label: d.label };
  });

  const path = points.map((p, i) => (i === 0 ? 'M' : 'L') + `${p.x} ${p.y}`).join(' ');

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const x = e.clientX - rect.left;

    let closestPoint = points[0];
    let minDistance = Math.abs(x - closestPoint.x);

    points.forEach(p => {
      const distance = Math.abs(x - p.x);
      if (distance < minDistance) {
        minDistance = distance;
        closestPoint = p;
      }
    });
    
    if (minDistance < 20) {
        setTooltip({ x: closestPoint.x, y: closestPoint.y, label: closestPoint.label, value: closestPoint.value });
    } else {
        setTooltip(null);
    }
  };

  return (
    <svg 
      viewBox={`0 0 ${width} ${height}`} 
      className="w-full h-full"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setTooltip(null)}
    >
      {/* Y-axis grid lines */}
      {[0.25, 0.5, 0.75, 1].map(tick => (
        <line
          key={tick}
          x1={padding}
          y1={padding + chartHeight - (tick * chartHeight)}
          x2={width - padding}
          y2={padding + chartHeight - (tick * chartHeight)}
          stroke="#475569"
          strokeWidth="1"
          strokeDasharray="2,2"
        />
      ))}
      {/* Y-axis labels */}
      {[0, 0.5, 1].map(tick => (
        <text 
          key={tick}
          x={padding - 8}
          y={padding + chartHeight - (tick * chartHeight) + 4}
          textAnchor="end"
          className="text-xs fill-slate-400"
        >
          {Math.round(tick * maxValue)}
        </text>
      ))}

      {/* X-axis labels */}
      {data.map((d, i) => (
        <text
          key={i}
          x={padding + i * xStep}
          y={height - padding + 15}
          textAnchor="middle"
          className="text-xs fill-slate-400"
        >
          {d.label}
        </text>
      ))}

      {/* Gradient */}
      <defs>
        <linearGradient id="line-chart-gradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#22c55e" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
        </linearGradient>
      </defs>
      
      {/* Area under the line */}
      <path 
        d={`${path} V ${height - padding} H ${padding} Z`}
        fill="url(#line-chart-gradient)"
      />

      {/* The line */}
      <path d={path} fill="none" stroke="#22c55e" strokeWidth="2" />
      
      {/* Data points and hover indicator line */}
      {tooltip && (
        <>
            <line 
                x1={tooltip.x} y1={padding} 
                x2={tooltip.x} y2={height - padding} 
                stroke="#64748b"
                strokeWidth="1"
            />
            <circle cx={tooltip.x} cy={tooltip.y} r="4" fill="#22c55e" stroke="#1e293b" strokeWidth="2" />
            <foreignObject x={tooltip.x > width / 2 ? tooltip.x - 90 : tooltip.x + 10} y={tooltip.y - 50} width="80" height="40">
                <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-600 rounded-md p-2 text-center text-white text-xs shadow-lg">
                    <div className="font-bold">{tooltip.value}</div>
                    <div className="text-slate-400">{tooltip.label}</div>
                </div>
            </foreignObject>
        </>
      )}

    </svg>
  );
};

export default LineChart;