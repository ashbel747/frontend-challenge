interface BarChartProps {
  data: any[];
  onBarClick: (id: string) => void;
}

export default function BarChart({ data, onBarClick }: BarChartProps) {
  const maxVal = data.length > 0 ? Math.max(...data.map(d => d.total)) : 1;

  return (
    <div className="flex items-end justify-around p-12 border-b border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 min-h-75">
      {data.map((item) => {
        const heightPercent = (item.total / maxVal) * 100;
        return (
          <div key={item.id} className="group flex flex-col items-center gap-4 cursor-pointer" onClick={() => onBarClick(item.id)}>
            <div className="relative w-28 h-48 bg-zinc-50 dark:bg-zinc-800/30 rounded-t-xl flex items-end">
                {/* Visual Grid lines helper */}
                <div className="absolute inset-0 flex flex-col justify-between opacity-10 pointer-events-none">
                    {[1,2,3,4].map(i => <div key={i} className="border-t border-dashed border-zinc-500 w-full" />)}
                </div>
                
                <div 
                    className="w-full bg-emerald-400 group-hover:bg-emerald-500 rounded-t-lg transition-all duration-700 ease-in-out shadow-lg shadow-emerald-500/20"
                    style={{ height: `${heightPercent}%` }}
                />
            </div>
            <span className="text-sm font-bold text-zinc-500 group-hover:text-emerald-500 transition-colors">
                {item.name}
            </span>
          </div>
        );
      })}
    </div>
  );
}