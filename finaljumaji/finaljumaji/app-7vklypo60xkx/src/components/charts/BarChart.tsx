interface BarChartProps {
  data: { label: string; value: number }[];
  title?: string;
  maxValue?: number;
}

export default function BarChart({ data, title, maxValue }: BarChartProps) {
  const max = maxValue || Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="space-y-4">
      {title && <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>}
      <div className="flex items-end gap-2 h-32">
        {data.map((item, index) => {
          const height = (item.value / max) * 100;
          const isStriped = index % 2 === 1;

          return (
            <div key={index} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full flex items-end justify-center h-24">
                <div
                  className={`w-full rounded-t transition-all ${
                    isStriped
                      ? 'bg-gradient-to-b from-foreground/20 to-foreground/10'
                      : 'bg-foreground'
                  }`}
                  style={{ height: `${height}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground">{item.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
