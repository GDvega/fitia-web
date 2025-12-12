import React from 'react';
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
  Area,
  CartesianGrid
} from 'recharts';
import { useTranslation } from 'react-i18next';

interface ProgressChartProps {
  data: { name: string; calories: number }[];
  target: number;
  activeIndex: number;
  onBarClick: (index: number) => void;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    // Find the bar payload
    const barData = payload.find((p: any) => p.dataKey === 'calories');
    if (!barData) return null;

    return (
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md p-4 border border-white/20 dark:border-gray-700 shadow-xl rounded-2xl ring-1 ring-black/5">
        <p className="font-bold text-gray-800 dark:text-gray-100 text-lg mb-1">{label}</p>
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-fitia-green"></span>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
            {barData.value} <span className="text-xs text-gray-400">kcal</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

const ProgressChart: React.FC<ProgressChartProps> = ({ data, target, activeIndex, onBarClick }) => {
  const { t } = useTranslation();
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="w-full flex flex-col h-full select-none">
      <div className="flex items-center justify-between mb-2 px-2">
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('dashboard.caloriesTitle')}</h3>
        <span className="text-xs font-medium bg-fitia-orange/10 text-fitia-orange px-2 py-1 rounded-full">
          Target: {target}
        </span>
      </div>

      <div className="w-full relative" style={{ height: 300, minWidth: 0 }}>
        {isMounted ? (
          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
            <ComposedChart
              data={data}
              margin={{ top: 20, right: 0, left: 0, bottom: 0 }}
              onClick={(data) => {
                if (data && data.activeTooltipIndex !== undefined) {
                  onBarClick(Number(data.activeTooltipIndex));
                }
              }}
            >
              <defs>
                <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.3} />
                </linearGradient>
                <linearGradient id="colorBarActive" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity={1} />
                  <stop offset="95%" stopColor="#059669" stopOpacity={0.8} />
                </linearGradient>
                <linearGradient id="colorOver" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F87171" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0.4} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" opacity={0.3} />

              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 13, fill: '#9CA3AF', fontWeight: 500 }}
                dy={15}
              />
              <YAxis hide />

              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: 'rgba(0,0,0,0.03)', radius: 8 }}
              />

              <ReferenceLine
                y={target}
                stroke="#F59E0B"
                strokeDasharray="4 4"
                strokeWidth={2}
                opacity={0.6}
              />

              {/* Subtle area background to show volume/trend */}
              <Area
                type="monotone"
                dataKey="calories"
                fill="url(#colorBar)"
                stroke="none"
                opacity={0.1}
              />

              <Bar
                dataKey="calories"
                radius={[12, 12, 12, 12]}
                barSize={32}
                animationDuration={1500}
                className="cursor-pointer transition-all duration-300"
              >
                {data.map((entry, index) => {
                  const isSelected = index === activeIndex;
                  const isOver = entry.calories > target;

                  // Logic: Active gets strong gradient, Over gets red gradient, Default gets soft green gradient
                  let fillId = 'url(#colorBar)';
                  let opacity = 0.4;

                  if (isOver) {
                    fillId = 'url(#colorOver)';
                    opacity = isSelected ? 1 : 0.6;
                  } else if (isSelected) {
                    fillId = 'url(#colorBarActive)';
                    opacity = 1;
                  }

                  return (
                    <Cell
                      key={`cell-${index}`}
                      fill={fillId}
                      fillOpacity={opacity}
                      style={{ filter: isSelected ? 'drop-shadow(0px 4px 6px rgba(16, 185, 129, 0.2))' : 'none' }}
                    />
                  );
                })}
              </Bar>
            </ComposedChart>
          </ResponsiveContainer>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            Loading Chart...
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex justify-center items-center mt-6 space-x-6 text-xs font-medium text-gray-500 dark:text-gray-400">
        <div className="flex items-center bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded-lg border border-green-100 dark:border-green-900/30">
          <span className="w-2 h-2 rounded-full bg-fitia-green mr-2 shadow-sm"></span> {t('common.onTrack')}
        </div>
        <div className="flex items-center bg-red-50 dark:bg-red-900/20 px-3 py-1.5 rounded-lg border border-red-100 dark:border-red-900/30">
          <span className="w-2 h-2 rounded-full bg-red-500 mr-2 shadow-sm"></span> {t('common.overLimit')}
        </div>
      </div>
    </div>
  );
};

export default ProgressChart;