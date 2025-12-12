import React, { useState, useEffect } from 'react';
import { UserProfile, DayPlan, Meal, Goal } from '../types';
import MealCard from './MealCard';
import ProgressChart from './ProgressChart';
import { RefreshCw, Calendar as CalendarIcon, Languages, Moon, Sun, Edit2, PieChart, Activity, LogOut } from 'lucide-react';
import ChatWidget from './ChatWidget';
import EditProfileModal from './EditProfileModal';
import MealDetailModal from './MealDetailModal';
import { useTranslation } from 'react-i18next';
import { useUserStore } from '../store/userStore';
import { PieChart as RePieChart, Pie, Cell } from 'recharts';


// MOCK DATA GENERATOR
const generateMockPlan = (goal: Goal): DayPlan[] => {
  const isLoss = goal === Goal.LoseWeight;
  const baseCal = isLoss ? 400 : 600;

  const meals: Meal[] = [
    {
      id: '1',
      name: 'Tostada de Aguacate y Huevo',
      calories: baseCal,
      protein: 20,
      carbs: 30,
      fats: 15,
      type: 'Breakfast',
      image: 'https://images.unsplash.com/photo-1525351484163-7529414395d8?auto=format&fit=crop&q=80&w=800',
      prepTime: '10',
      ingredients: ['2 Huevos', '1 Rebanada Pan Integral', '1/2 Aguacate', 'Sal y Pimienta', 'Hojuelas de Chile']
    },
    {
      id: '2',
      name: 'Ensalada de Pollo a la Parrilla',
      calories: baseCal + 100,
      protein: 45,
      carbs: 15,
      fats: 20,
      type: 'Lunch',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800',
      prepTime: '20',
      ingredients: ['150g Pechuga de Pollo', 'Lechuga Mixta', 'Tomates Cherry', 'Pepino', 'Aderezo de Aceite de Oliva']
    },
    {
      id: '3',
      name: 'Salmón con Quinoa',
      calories: baseCal + 150,
      protein: 40,
      carbs: 45,
      fats: 25,
      type: 'Dinner',
      image: 'https://images.unsplash.com/photo-1467003909585-2f8a7270028d?auto=format&fit=crop&q=80&w=800',
      prepTime: '30',
      ingredients: ['180g Filete de Salmón', '1/2 Taza Quinoa', 'Espárragos al Vapor', 'Rodaja de Limón', 'Eneldo']
    },
    {
      id: '4',
      name: 'Yogur Griego con Moras',
      calories: 200,
      protein: 15,
      carbs: 20,
      fats: 5,
      type: 'Snack',
      image: 'https://images.unsplash.com/photo-1488477181946-6428a029177b?auto=format&fit=crop&q=80&w=800',
      prepTime: '5',
      ingredients: ['1 Taza Yogur Griego', 'Manojo de Arándanos', '1 cdta Miel', 'Semillas de Chía']
    },
  ];

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days.map(day => ({
    day,
    meals: meals.map(m => ({
      ...m,
      id: `${day}-${m.id}`,
      calories: Math.floor(m.calories * (0.9 + Math.random() * 0.2))
    })),
    totalCalories: 0,
    targetCalories: isLoss ? 1800 : 2500
  })).map(day => ({
    ...day,
    totalCalories: day.meals.reduce((sum, m) => sum + m.calories, 0)
  }));
};

// Mini Component for Macro Donut
const MacroRing = ({ value, total, color, label }: { value: number, total: number, color: string, label: string }) => {
  const data = [
    { name: 'val', value: value },
    { name: 'rest', value: total - value }
  ];
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative w-16 h-16">
        <RePieChart width={64} height={64}>
          <Pie
            data={data}
            innerRadius={22}
            outerRadius={28}
            paddingAngle={5}
            dataKey="value"
            startAngle={90}
            endAngle={-270}
            stroke="none"
            cornerRadius={10}
            isAnimationActive={false}
          >
            <Cell fill={color} />
            <Cell fill="#E5E7EB" opacity={0.3} />
          </Pie>
        </RePieChart>
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          <span className="text-[10px] font-bold text-gray-700 dark:text-gray-300">{value}g</span>
        </div>
      </div>
      <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wide mt-1">{label}</span>
    </div>
  );
};


const Dashboard: React.FC = () => {
  const { userProfile, setUserProfile, clearUserProfile, fetchUser, userId, updateUserProfile } = useUserStore();
  const onUpdateProfile = updateUserProfile;
  const onLogout = clearUserProfile;

  // Sync with backend on mount
  // Sync with backend on mount ONLY if profile is missing or incomplete
  useEffect(() => {
    if (userId && !userProfile) {
      fetchUser(userId);
    }
  }, [userId, userProfile, fetchUser]);

  // Guard clause in case userProfile is null (though App.tsx handles this)
  if (!userProfile) return null;
  const { t, i18n } = useTranslation();
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const [weeklyPlan, setWeeklyPlan] = useState<DayPlan[]>([]); // Start empty
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Modals state
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);

  const currentDay = weeklyPlan[currentDayIndex];

  // Calculate daily macros (Handle empty plan)
  const dailyMacros = currentDay ? currentDay.meals.reduce((acc, meal) => ({
    p: acc.p + meal.protein,
    c: acc.c + meal.carbs,
    f: acc.f + meal.fats
  }), { p: 0, c: 0, f: 0 }) : { p: 0, c: 0, f: 0 };

  // Recalculate plan if goal changes significantly (simplified)
  useEffect(() => {
    setWeeklyPlan(generateMockPlan(userProfile.goal));
  }, [userProfile.goal]);

  const handleRegenerate = async () => {
    if (!userId) return;
    setIsRegenerating(true);
    try {
      const { generatePlan } = await import('../services/api');
      const newPlan = await generatePlan(userId);
      setWeeklyPlan(newPlan);
    } catch (error) {
      console.error("Failed to generate plan:", error);
      alert("Error generating plan. Please try again.");
    } finally {
      setIsRegenerating(false);
    }
  };

  // Initial load of current plan
  useEffect(() => {
    const loadPlan = async () => {
      if (userId) {
        try {
          const { fetchCurrentPlan } = await import('../services/api');
          const plan = await fetchCurrentPlan(userId);
          if (plan && plan.length > 0) {
            setWeeklyPlan(plan);
          }
        } catch (error) {
          console.error("Failed to load current plan:", error);
          // Fallback to generating one or keeping mock default
        }
      }
    };
    loadPlan();
  }, [userId]);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'es' : 'en';
    i18n.changeLanguage(newLang);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const chartData = weeklyPlan.map(d => ({
    name: d.day,
    calories: d.totalCalories
  }));

  const SkeletonCard = () => (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 h-80 animate-pulse flex flex-col">
      <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl w-full mb-4"></div>
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
      <div className="mt-auto h-8 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900 pb-20 transition-colors duration-500 overflow-x-hidden relative">

      {/* Background Blobs */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-fitia-green/5 to-transparent -z-10 pointer-events-none"></div>
      <div className="absolute top-20 right-0 w-96 h-96 bg-fitia-orange/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>
      <div className="absolute bottom-0 left-20 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      {/* Top Navigation */}
      <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-100 dark:border-gray-800 sticky top-0 z-40 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              <div className="bg-fitia-green/10 p-2 rounded-xl mr-3">
                <Activity className="text-fitia-green" size={24} />
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">fitia</span>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button
                onClick={toggleDarkMode}
                className="text-gray-500 dark:text-gray-400 hover:text-fitia-green p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button
                onClick={toggleLanguage}
                className="text-gray-500 dark:text-gray-400 hover:text-fitia-green transition-colors p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <Languages size={20} />
              </button>

              <div className="flex items-center space-x-3 border-l border-gray-200 dark:border-gray-700 pl-4 ml-2">
                <button
                  onClick={() => setIsEditProfileOpen(true)}
                  className="flex items-center space-x-3 group hover:bg-gray-50 dark:hover:bg-gray-800 rounded-full pr-4 pl-1 py-1 transition-all"
                >
                  <div className="relative h-10 w-10">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-fitia-green to-teal-400 p-[2px]">
                      <div className="h-full w-full rounded-full bg-white dark:bg-gray-900 flex items-center justify-center overflow-hidden">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userProfile.name}`} alt="avatar" />
                      </div>
                    </div>
                    <div className="absolute -bottom-1 -right-1 bg-white dark:bg-gray-800 p-1 rounded-full shadow-sm text-gray-500 group-hover:text-fitia-green transition-colors ring-2 ring-white dark:ring-gray-900">
                      <Edit2 size={10} />
                    </div>
                  </div>
                  <div className="hidden sm:flex flex-col items-start">
                    <span className="text-sm font-bold text-gray-800 dark:text-gray-100 group-hover:text-fitia-green transition-colors">{userProfile.name}</span>
                    <span className="text-[10px] uppercase tracking-wide font-medium text-gray-400">{t(`enums.${userProfile.goal}`)}</span>
                  </div>
                </button>

                <button
                  onClick={onLogout}
                  className="ml-2 text-gray-400 hover:text-red-500 transition-colors p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20"
                  title={t('common.logout')}
                >
                  <LogOut size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-4 border-b border-gray-200/60 dark:border-gray-800">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">{t('dashboard.weeklyPlan')}</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">{t('dashboard.subtitle')}</p>
          </div>
          <button
            onClick={handleRegenerate}
            disabled={isRegenerating}
            className={`group flex items-center justify-center px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl font-bold shadow-xl shadow-gray-200 dark:shadow-none hover:shadow-2xl hover:-translate-y-0.5 transition-all ${isRegenerating ? 'opacity-75 cursor-not-allowed' : ''}`}
          >
            <RefreshCw size={20} className={`mr-2 group-hover:rotate-180 transition-transform duration-500 ${isRegenerating ? 'animate-spin' : ''}`} />
            {isRegenerating ? t('dashboard.optimizing') : t('dashboard.regenerate')}
          </button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* Left Column: Calendar & Stats (4 cols) */}
          <div className="xl:col-span-4 space-y-8">
            {/* Day Selector - Modern Segmented Look */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
              {/* ... (Calendar Header kept same, simplified for brevity in logic) ... */}
              {weeklyPlan.length > 0 ? (
                <>
                  <h2 className="font-bold text-xl text-gray-800 dark:text-white flex items-center mb-6">
                    <CalendarIcon size={24} className="mr-3 text-fitia-green p-1 bg-green-100 dark:bg-green-900/30 rounded-lg" />
                    {t('dashboard.schedule')}
                  </h2>
                  <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-900 p-1.5 rounded-2xl">
                    {weeklyPlan.map((d, idx) => (
                      <button
                        key={d.day}
                        onClick={() => setCurrentDayIndex(idx)}
                        className={`
                                        relative flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-300
                                        ${idx === currentDayIndex
                            ? 'bg-white dark:bg-gray-700 text-fitia-green shadow-md scale-100'
                            : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                          }
                                    `}
                      >
                        {d.day.charAt(0)}
                        {idx === currentDayIndex && (
                          <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-fitia-green rounded-full"></span>
                        )}
                      </button>
                    ))}
                  </div>
                  <div className="mt-8 flex flex-col items-center justify-center p-6 bg-gradient-to-br from-fitia-green/5 to-transparent rounded-2xl border border-fitia-green/10">
                    <span className="text-4xl font-black text-gray-800 dark:text-white mb-1">{currentDay.day}</span>
                    <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                      <span>{t('common.target')}:</span>
                      <span className="font-bold text-gray-700 dark:text-gray-200">{currentDay.targetCalories} kcal</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="animate-pulse space-y-4">
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                  <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                  <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                </div>
              )}
            </div>

            {/* Macro Summary Ring Chart */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
              {weeklyPlan.length > 0 ? (
                <>
                  <h2 className="font-bold text-lg text-gray-800 dark:text-white mb-6 flex items-center">
                    <PieChart size={20} className="mr-2 text-fitia-orange" />
                    {t('dashboard.dailyMacros')}
                  </h2>
                  <div className="flex justify-around items-center">
                    <MacroRing value={dailyMacros.p} total={200} color="#10B981" label={t('dashboard.protein')} />
                    <MacroRing value={dailyMacros.c} total={250} color="#3B82F6" label={t('dashboard.carbs')} />
                    <MacroRing value={dailyMacros.f} total={80} color="#EAB308" label={t('dashboard.fats')} />
                  </div>
                </>
              ) : (
                <div className="animate-pulse flex justify-around">
                  <div className="h-16 w-16 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                  <div className="h-16 w-16 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                  <div className="h-16 w-16 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                </div>
              )}
            </div>

            {/* Progress Chart */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 h-[400px]">
              {weeklyPlan.length > 0 ? (
                <ProgressChart
                  data={chartData}
                  target={currentDay.targetCalories}
                  activeIndex={currentDayIndex}
                  onBarClick={setCurrentDayIndex}
                />
              ) : (
                <div className="h-full w-full bg-gray-200 dark:bg-gray-700 animate-pulse rounded-xl"></div>
              )}
            </div>
          </div>

          {/* Right Column: Meals Grid (8 cols) */}
          <div className="xl:col-span-8">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                {weeklyPlan.length > 0 ? `${t('dashboard.mealsFor')} ${currentDay.day}` : t('common.loading')}
              </h3>
              {weeklyPlan.length > 0 && (
                <span className="text-sm font-medium text-gray-500 bg-white dark:bg-gray-800 px-3 py-1 rounded-full shadow-sm border border-gray-100 dark:border-gray-700">
                  {currentDay.totalCalories} / {currentDay.targetCalories} kcal
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 auto-rows-fr">
              {weeklyPlan.length === 0 || isRegenerating ? (
                <>
                  <SkeletonCard />
                  <SkeletonCard />
                  <SkeletonCard />
                  <SkeletonCard />
                </>
              ) : (
                currentDay.meals.map((meal) => (
                  <div key={meal.id} className="h-full">
                    <MealCard
                      meal={meal}
                      onSwap={() => { }}
                      onViewDetails={setSelectedMeal}
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </main>

      {/* Components */}
      <ChatWidget onPlanUpdated={() => {
        const loadPlan = async () => {
          if (userId) {
            try {
              const { fetchCurrentPlan } = await import('../services/api');
              const plan = await fetchCurrentPlan(userId);
              if (plan && plan.length > 0) {
                setWeeklyPlan(plan);
              }
            } catch (error) {
              console.error("Failed to refresh plan after chat update:", error);
            }
          }
        };
        loadPlan();
      }} />

      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        userProfile={userProfile}
        onSave={onUpdateProfile}
      />

      <MealDetailModal
        meal={selectedMeal}
        onClose={() => setSelectedMeal(null)}
      />

    </div>
  );
};

export default Dashboard;