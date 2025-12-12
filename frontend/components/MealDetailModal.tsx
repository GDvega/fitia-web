import React from 'react';
import { Meal } from '../types';
import { X, Clock, Flame } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface MealDetailModalProps {
    meal: Meal | null;
    onClose: () => void;
}

const MealDetailModal: React.FC<MealDetailModalProps> = ({ meal, onClose }) => {
    const { t } = useTranslation();

    if (!meal) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] animate-in slide-in-from-bottom-5 duration-300">

                {/* Image Header */}
                <div className="relative h-56 w-full">
                    <img src={meal.image} alt={meal.name} className="w-full h-full object-cover" />
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full backdrop-blur-md transition-colors"
                    >
                        <X size={20} />
                    </button>
                    <div className="absolute bottom-4 left-4">
                        <span className="bg-fitia-green text-white px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                            {t(`enums.${meal.type}`)}
                        </span>
                    </div>
                </div>

                <div className="p-6 overflow-y-auto">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">{meal.name}</h2>

                    <div className="flex items-center space-x-6 mb-6 text-sm text-gray-600 dark:text-gray-300">
                        <div className="flex items-center">
                            <Flame size={18} className="text-fitia-orange mr-1.5" />
                            <span className="font-semibold">{meal.calories}</span> <span className="ml-1">kcal</span>
                        </div>
                        <div className="flex items-center">
                            <Clock size={18} className="text-fitia-green mr-1.5" />
                            <span className="font-semibold">{meal.prepTime || 15}</span> <span className="ml-1">{t('dashboard.mins')}</span>
                        </div>
                    </div>

                    {/* Macros */}
                    <div className="grid grid-cols-3 gap-3 mb-6">
                        <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl text-center border border-gray-100 dark:border-gray-700">
                            <span className="block text-fitia-green font-bold text-lg">{meal.protein}g</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">Protein</span>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl text-center border border-gray-100 dark:border-gray-700">
                            <span className="block text-blue-500 font-bold text-lg">{meal.carbs}g</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">Carbs</span>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl text-center border border-gray-100 dark:border-gray-700">
                            <span className="block text-yellow-500 font-bold text-lg">{meal.fats}g</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">Fats</span>
                        </div>
                    </div>

                    {/* Ingredients */}
                    <div className="mb-6">
                        <h3 className="font-bold text-gray-800 dark:text-white mb-3 flex items-center">
                            {t('dashboard.ingredients')}
                        </h3>
                        <ul className="space-y-2">
                            {(meal.ingredients || ["Ingredient 1", "Ingredient 2", "Healthy Oil", "Spices"]).map((ing, i) => (
                                <li key={i} className="flex items-start text-sm text-gray-600 dark:text-gray-300">
                                    <span className="w-1.5 h-1.5 bg-fitia-green rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                                    {ing}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                    <button
                        onClick={onClose}
                        className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-3 rounded-xl font-bold hover:opacity-90 transition-opacity"
                    >
                        {t('common.close')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MealDetailModal;