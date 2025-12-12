import React from 'react';
import { Meal } from '../types';
import { Flame, Info, Clock, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface MealCardProps {
  meal: Meal;
  onSwap?: () => void;
  onViewDetails?: (meal: Meal) => void;
}

const MealCard: React.FC<MealCardProps> = ({ meal, onSwap, onViewDetails }) => {
  const { t } = useTranslation();

  return (
    <div
      className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-xl hover:shadow-gray-200/50 dark:hover:shadow-black/30 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
      onClick={() => onViewDetails && onViewDetails(meal)}
    >
      <div className="relative h-48 w-full overflow-hidden cursor-pointer">
        <img
          src={meal.image}
          alt={meal.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex space-x-2">
          <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md text-gray-800 dark:text-gray-100 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide shadow-sm">
            {t(`enums.${meal.type}`)}
          </div>
        </div>

        {/* Bottom Info on Image */}
        <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
          {meal.prepTime && (
            <div className="flex items-center text-white/90 text-xs font-medium bg-black/30 backdrop-blur-sm px-2 py-1 rounded-lg border border-white/10">
              <Clock size={12} className="mr-1.5" /> {meal.prepTime} {t('dashboard.mins')}
            </div>
          )}
          <button className="bg-white/20 hover:bg-white/40 backdrop-blur-md text-white p-1.5 rounded-full transition-colors border border-white/20">
            <Info size={16} />
          </button>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <h3 className="font-bold text-gray-800 dark:text-gray-100 text-lg mb-2 leading-tight group-hover:text-fitia-green transition-colors">
          {meal.name}
        </h3>

        <div className="flex items-center mb-4">
          <div className="flex items-center text-fitia-orange font-bold text-base bg-orange-50 dark:bg-orange-900/20 px-2 py-0.5 rounded-md border border-orange-100 dark:border-orange-900/30">
            <Flame size={16} className="mr-1 fill-fitia-orange" />
            {meal.calories}
          </div>
          <span className="text-gray-400 text-xs ml-2 font-medium">kcal</span>
        </div>

        {/* Macros */}
        <div className="mt-auto grid grid-cols-3 gap-2">
          <div className="flex flex-col items-center bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2 border border-gray-100 dark:border-gray-700">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Prot</span>
            <span className="text-sm font-bold text-fitia-green">{meal.protein}g</span>
          </div>
          <div className="flex flex-col items-center bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2 border border-gray-100 dark:border-gray-700">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Carb</span>
            <span className="text-sm font-bold text-blue-500">{meal.carbs}g</span>
          </div>
          <div className="flex flex-col items-center bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2 border border-gray-100 dark:border-gray-700">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Fat</span>
            <span className="text-sm font-bold text-yellow-500">{meal.fats}g</span>
          </div>
        </div>

        {onSwap && (
          <button
            onClick={(e) => { e.stopPropagation(); onSwap(); }}
            className="w-full mt-4 flex items-center justify-center text-xs font-semibold text-gray-500 hover:text-fitia-green py-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-all border border-transparent hover:border-green-100 dark:hover:border-green-800"
          >
            {t('dashboard.swap')} <ArrowRight size={12} className="ml-1" />
          </button>
        )}
      </div>
    </div>
  );
};

export default MealCard;