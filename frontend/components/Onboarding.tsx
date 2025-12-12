import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserProfile, Gender, Goal, ActivityLevel, DietType, VarietyLevel, PreparationStyle, PlanningMode, WeightLossSpeed } from '../types';
import { ArrowRight, Check, ChevronRight, ClipboardList, Scale, Sparkles, Drumstick, Citrus, Wheat, Utensils, Zap, ChefHat, Salad, Target, User, Ruler, Gauge, CheckCircle2, LogOut } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useUserStore } from '../store/userStore';


interface StepProps {
  formData: Partial<UserProfile>;
  updateData: (key: keyof UserProfile, value: any) => void;
  t: (key: string, options?: any) => string;
}

// Mock data for Food Selection Step
const FOOD_CATEGORIES = [
  {
    id: 'proteins',
    label: 'proteins',
    foods: ['Chicken', 'Beef', 'Fish', 'Tuna', 'Eggs', 'Turkey', 'Tofu', 'Pork']
  },
  {
    id: 'carbs',
    label: 'carbs',
    foods: ['Rice', 'Potato', 'Sweet Potato', 'Oats', 'Pasta', 'Bread', 'Quinoa', 'Beans']
  },
  {
    id: 'fats',
    label: 'fats',
    foods: ['Avocado', 'Nuts', 'Almonds', 'Olive Oil', 'Chia', 'Peanut Butter']
  },
  {
    id: 'fruits',
    label: 'fruits',
    foods: ['Banana', 'Apple', 'Berries', 'Orange', 'Pineapple', 'Grapes']
  }
];

// --- Extracted Step Components ---

const Step1_Method: React.FC<StepProps & { onNext: () => void }> = ({ formData, updateData, t, onNext }) => (
  <div className="space-y-4">
    <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">{t('onboarding.step1Title')}</h2>

    <button
      onClick={() => {
        updateData('planningMode', PlanningMode.Automatic);
        onNext();
      }}
      className={`w-full p-6 rounded-2xl flex items-center transition-all group border-2 ${formData.planningMode === PlanningMode.Automatic
        ? 'bg-[#EAE8DD] border-transparent ring-2 ring-fitia-orange ring-offset-2'
        : 'bg-[#EAE8DD] border-transparent hover:bg-[#E0DCCB]'
        }`}
    >
      <div className="bg-fitia-orange text-white p-3 rounded-xl mr-5 group-hover:scale-110 transition-transform">
        <ClipboardList size={28} />
      </div>
      <div className="text-left">
        <h3 className="font-bold text-lg text-gray-900">{t('onboarding.step1Option1')}</h3>
        <p className="text-gray-600 text-sm mt-1">{t('onboarding.step1Desc1')}</p>
      </div>
    </button>

    <button
      onClick={() => {
        updateData('planningMode', PlanningMode.Custom);
        onNext();
      }}
      className={`w-full p-6 rounded-2xl flex items-center transition-all group border-2 ${formData.planningMode === PlanningMode.Custom
        ? 'bg-[#EAE8DD] border-transparent ring-2 ring-fitia-orange ring-offset-2'
        : 'bg-[#EAE8DD] border-transparent hover:bg-[#E0DCCB]'
        }`}
    >
      <div className="bg-fitia-orange text-white p-3 rounded-xl mr-5 group-hover:scale-110 transition-transform">
        <Scale size={28} />
      </div>
      <div className="text-left">
        <h3 className="font-bold text-lg text-gray-900">{t('onboarding.step1Option2')}</h3>
        <p className="text-gray-600 text-sm mt-1">{t('onboarding.step1Desc2')}</p>
      </div>
    </button>

    <p className="text-center text-gray-400 text-sm mt-4">
      No te preocupes, luego lo puedes cambiar
    </p>
  </div>
);

const Step2_DietType: React.FC<StepProps> = ({ formData, updateData, t }) => (
  <div className="space-y-4">
    <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">{t('onboarding.step2Title')}</h2>
    <div className="space-y-3">
      {Object.values(DietType).map((diet) => (
        <button
          key={diet}
          onClick={() => updateData('dietType', diet)}
          className={`w-full p-4 rounded-2xl flex items-center text-left transition-all border-2 ${formData.dietType === diet
            ? 'bg-[#EAE8DD] border-transparent ring-2 ring-fitia-orange ring-offset-2'
            : 'bg-[#EAE8DD] border-transparent hover:bg-[#E0DCCB]'
            }`}
        >
          <div className="mr-4 text-fitia-orange">
            {diet === DietType.Balanced && <Sparkles size={24} />}
            {diet === DietType.HighProtein && <Drumstick size={24} />}
            {diet === DietType.LowCarb && <Citrus size={24} />}
            {diet === DietType.Keto && <div className="font-bold text-xl">🥑</div>}
            {diet === DietType.LowFat && <Wheat size={24} />}
            {diet === DietType.Vegan && <Salad size={24} />}
          </div>
          <div>
            <h3 className="font-bold text-gray-900">{t(`enums.${diet}`)}</h3>
            <p className="text-gray-600 text-xs mt-0.5">{t(`enums.${diet}_DESC`)}</p>
          </div>
        </button>
      ))}
    </div>
  </div>
);

const Step3_Stats: React.FC<StepProps> = ({ formData, updateData, t }) => {
  const [showSpeedModal, setShowSpeedModal] = useState(false);

  return (
    <div className="space-y-6 text-center relative">
      <div className="bg-fitia-orange/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
        <Target size={40} className="text-fitia-orange" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900">{t('onboarding.step3Title')}</h2>
      <p className="text-gray-600 mb-8">{t('onboarding.step3Subtitle')}</p>

      <div className="space-y-4">
        {/* Name */}
        <div className="bg-[#EAE8DD] p-4 rounded-xl flex items-center justify-between">
          <div className="flex items-center">
            <User size={20} className="text-fitia-orange mr-3" />
            <span className="font-bold text-gray-900">{t('onboarding.nameLabel')}</span>
          </div>
          <input
            type="text"
            value={formData.name || ''}
            onChange={(e) => updateData('name', e.target.value)}
            className="bg-transparent text-right font-bold text-gray-700 outline-none w-32 focus:border-b-2 border-fitia-orange"
            placeholder="Name"
          />
        </div>

        <div className="bg-[#EAE8DD] p-4 rounded-xl flex items-center justify-between">
          <div className="flex items-center">
            <Scale size={20} className="text-fitia-orange mr-3" />
            <span className="font-bold text-gray-900">{t('onboarding.currentWeight')}</span>
          </div>
          <div className="flex items-center">
            <input
              type="number"
              value={formData.weight}
              onChange={(e) => updateData('weight', Number(e.target.value))}
              className="bg-transparent text-right font-bold text-gray-700 outline-none w-16"
            />
            <span className="ml-1 text-gray-500 font-medium">kg</span>
            <ChevronRight size={16} className="ml-2 text-gray-400" />
          </div>
        </div>

        <div className="bg-[#EAE8DD] p-4 rounded-xl flex items-center justify-between">
          <div className="flex items-center">
            <Target size={20} className="text-fitia-orange mr-3" />
            <span className="font-bold text-gray-900">{t('onboarding.targetWeight')}</span>
          </div>
          <div className="flex items-center">
            <input
              type="number"
              value={formData.targetWeight}
              onChange={(e) => updateData('targetWeight', Number(e.target.value))}
              className="bg-transparent text-right font-bold text-gray-700 outline-none w-16"
            />
            <span className="ml-1 text-gray-500 font-medium">kg</span>
            <ChevronRight size={16} className="ml-2 text-gray-400" />
          </div>
        </div>

        <div className="bg-[#EAE8DD] p-4 rounded-xl flex items-center justify-between">
          <div className="flex items-center">
            <Ruler size={20} className="text-fitia-orange mr-3" />
            <span className="font-bold text-gray-900">{t('onboarding.heightLabel')}</span>
          </div>
          <div className="flex items-center">
            <input
              type="number"
              value={formData.height}
              onChange={(e) => updateData('height', Number(e.target.value))}
              className="bg-transparent text-right font-bold text-gray-700 outline-none w-16"
            />
            <span className="ml-1 text-gray-500 font-medium">cm</span>
            <ChevronRight size={16} className="ml-2 text-gray-400" />
          </div>
        </div>

        <div
          className="bg-[#EAE8DD] p-4 rounded-xl flex items-center justify-between cursor-pointer hover:bg-[#E0DCCB] transition-colors"
          onClick={() => setShowSpeedModal(true)}
        >
          <div className="flex items-center">
            <Zap size={20} className="text-fitia-orange mr-3" />
            <span className="font-bold text-gray-900">{t('onboarding.velocity')}</span>
          </div>
          <div className="flex items-center">
            <span className="text-gray-700 font-bold">
              {formData.weightLossSpeed === WeightLossSpeed.Recommended ? t('onboarding.recommended') :
                formData.weightLossSpeed === WeightLossSpeed.Fast ? t('onboarding.speedFast') : t('onboarding.speedSlow')}
            </span>
            <ChevronRight size={16} className="ml-2 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Speed Selection Modal */}
      {showSpeedModal && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-end sm:justify-center bg-[#FAF9F4] sm:bg-white/90 sm:backdrop-blur-sm animate-in fade-in duration-200 rounded-3xl">
          <div className="w-full h-full sm:h-auto bg-[#FAF9F4] p-6 sm:rounded-3xl sm:shadow-2xl sm:max-w-sm flex flex-col">
            <h3 className="text-xl font-bold text-center mb-6 text-gray-900">{t('onboarding.velocityTitle')}</h3>

            <div className="space-y-4 flex-1">
              {/* Recommended Option */}
              <button
                onClick={() => updateData('weightLossSpeed', WeightLossSpeed.Recommended)}
                className={`w-full text-left rounded-2xl overflow-hidden border-2 transition-all ${formData.weightLossSpeed === WeightLossSpeed.Recommended
                  ? 'bg-[#FFF9E5] border-fitia-orange'
                  : 'bg-[#EAE8DD] border-transparent'
                  }`}
              >
                <div className="p-4 flex items-center">
                  <Gauge size={24} className="text-fitia-orange mr-3" />
                  <span className="font-bold text-gray-900">{t('onboarding.recommended')}</span>
                </div>
                {formData.weightLossSpeed === WeightLossSpeed.Recommended && (
                  <div className="bg-[#FFF9E5] px-4 pb-4 space-y-2">
                    <div className="flex items-center text-xs text-gray-700 font-medium">
                      <CheckCircle2 size={14} className="text-fitia-green mr-2" />
                      {t('onboarding.speedRecDesc1')}
                    </div>
                    <div className="flex items-center text-xs text-gray-700 font-medium">
                      <CheckCircle2 size={14} className="text-fitia-green mr-2" />
                      {t('onboarding.speedRecDesc2')}
                    </div>
                    <div className="flex items-center text-xs text-gray-700 font-medium">
                      <CheckCircle2 size={14} className="text-fitia-green mr-2" />
                      {t('onboarding.speedRecDesc3')}
                    </div>
                  </div>
                )}
              </button>

              {/* Fast Option */}
              <button
                onClick={() => updateData('weightLossSpeed', WeightLossSpeed.Fast)}
                className={`w-full p-4 rounded-2xl flex items-center border-2 transition-all ${formData.weightLossSpeed === WeightLossSpeed.Fast
                  ? 'bg-[#FFF9E5] border-fitia-orange'
                  : 'bg-[#EAE8DD] border-transparent'
                  }`}
              >
                <Gauge size={24} className="text-fitia-orange mr-3" />
                <span className="font-bold text-gray-900">{t('onboarding.speedFast')}</span>
              </button>

              {/* Slow Option */}
              <button
                onClick={() => updateData('weightLossSpeed', WeightLossSpeed.Slow)}
                className={`w-full p-4 rounded-2xl flex items-center border-2 transition-all ${formData.weightLossSpeed === WeightLossSpeed.Slow
                  ? 'bg-[#FFF9E5] border-fitia-orange'
                  : 'bg-[#EAE8DD] border-transparent'
                  }`}
              >
                <Gauge size={24} className="text-fitia-orange mr-3" />
                <span className="font-bold text-gray-900">{t('onboarding.speedSlow')}</span>
              </button>
            </div>

            <button
              onClick={() => setShowSpeedModal(false)}
              className="w-full mt-6 bg-fitia-orange text-white py-4 rounded-xl font-bold hover:bg-orange-600 transition-colors"
            >
              {t('common.ok')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const Step4_Meals: React.FC<StepProps> = ({ formData, updateData, t }) => {
  const toggleMeal = (meal: string) => {
    const current = formData.mealsPerDay || [];
    if (current.includes(meal)) {
      updateData('mealsPerDay', current.filter(m => m !== meal));
    } else {
      updateData('mealsPerDay', [...current, meal]);
    }
  };

  const isSelected = (meal: string) => formData.mealsPerDay?.includes(meal);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-center mb-2 text-gray-900">{t('onboarding.step4Title')}</h2>
      <p className="text-center text-gray-500 mb-6">{t('onboarding.step4Subtitle')}</p>

      {['Breakfast', 'Lunch', 'Dinner'].map(meal => (
        <button
          key={meal}
          onClick={() => toggleMeal(meal)}
          className={`w-full p-4 rounded-xl flex items-center justify-between border-2 transition-all ${isSelected(meal)
            ? 'bg-[#EAE8DD] border-fitia-orange'
            : 'bg-[#EAE8DD] border-transparent opacity-60'
            }`}
        >
          <div className="flex items-center">
            <div className="mr-4 font-bold text-2xl text-gray-800">+</div>
            <span className="font-bold text-gray-800">{t(`enums.${meal}`)}</span>
          </div>
          <span className="text-xs font-semibold text-gray-500 uppercase">{t('onboarding.mainLabel')}</span>
        </button>
      ))}

      {['Snack1', 'Snack2'].map(meal => (
        <button
          key={meal}
          onClick={() => toggleMeal(meal)}
          className={`w-full p-4 rounded-xl flex items-center justify-between border-2 transition-all ${isSelected(meal)
            ? 'bg-[#EAE8DD] border-fitia-orange'
            : 'bg-[#EAE8DD] border-transparent opacity-60'
            }`}
        >
          <div className="flex items-center">
            <div className="mr-4 font-bold text-2xl text-gray-800">+</div>
            <span className="font-bold text-gray-800">{t(`enums.${meal}`)}</span>
          </div>
        </button>
      ))}
    </div>
  )
};

const Step5_PrepStyle: React.FC<StepProps> = ({ formData, updateData, t }) => (
  <div className="space-y-6">
    <div className="bg-fitia-orange/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
      <Sparkles size={40} className="text-fitia-orange" />
    </div>
    <h2 className="text-2xl font-bold text-center mb-8 text-gray-900 px-4">{t('onboarding.step5Title')}</h2>

    <div className="space-y-4">
      <div
        onClick={() => updateData('preparationStyle', PreparationStyle.Recipes)}
        className={`bg-[#EAE8DD] p-5 rounded-2xl cursor-pointer border-2 transition-all ${formData.preparationStyle === PreparationStyle.Recipes ? 'border-fitia-orange' : 'border-transparent'}`}
      >
        <h3 className="font-bold text-lg text-gray-900">{t('onboarding.recipes')}</h3>
        <p className="text-sm text-gray-600">{t('onboarding.recipesDesc')}</p>
        <hr className="border-gray-300 my-3" />
        <div className="flex items-center">
          <img src="https://images.unsplash.com/photo-1525351484163-7529414395d8?w=100&h=100&fit=crop" className="w-12 h-12 rounded-lg object-cover mr-3" alt="Recipe" />
          <span className="font-semibold text-sm text-gray-800">Avocado Chicken Sandwich</span>
        </div>
      </div>

      <div
        onClick={() => updateData('preparationStyle', PreparationStyle.Ingredients)}
        className={`bg-[#EAE8DD] p-5 rounded-2xl cursor-pointer border-2 transition-all ${formData.preparationStyle === PreparationStyle.Ingredients ? 'border-fitia-orange' : 'border-transparent'}`}
      >
        <h3 className="font-bold text-lg text-gray-900">{t('onboarding.ingredients')}</h3>
        <p className="text-sm text-gray-600">{t('onboarding.ingredientsDesc')}</p>
        <hr className="border-gray-300 my-3" />
        <ul className="space-y-2">
          <li className="flex justify-between text-sm">
            <span className="flex items-center"><Drumstick size={14} className="mr-2 text-fitia-orange" /> Pollo</span>
            <span className="text-gray-500">1 filete</span>
          </li>
          <li className="flex justify-between text-sm">
            <span className="flex items-center"><div className="w-3.5 h-3.5 rounded-full bg-blue-400 mr-2" /> Arroz</span>
            <span className="text-gray-500">1 taza</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
);

const Step6_Variety: React.FC<StepProps> = ({ formData, updateData, t }) => (
  <div className="space-y-6">
    <div className="bg-fitia-orange/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
      <div className="text-4xl text-fitia-orange font-bold">◎</div>
    </div>
    <h2 className="text-2xl font-bold text-center mb-8 text-gray-900">{t('onboarding.step6Title')}</h2>

    <div className="space-y-4">
      {Object.values(VarietyLevel).map(level => (
        <button
          key={level}
          onClick={() => updateData('varietyLevel', level)}
          className={`w-full bg-[#EAE8DD] p-5 rounded-2xl flex items-center text-left border-2 transition-all ${formData.varietyLevel === level ? 'border-fitia-orange ring-1 ring-fitia-orange' : 'border-transparent'
            }`}
        >
          <div className="text-fitia-orange text-2xl mr-4">
            {level === VarietyLevel.High && '◍'}
            {level === VarietyLevel.Medium && '◐'}
            {level === VarietyLevel.Low && '○'}
          </div>
          <div>
            <h3 className="font-bold text-gray-900">{t(`onboarding.variety${level}`.replace('HIGH', 'High').replace('MEDIUM', 'Med').replace('LOW', 'Low'))}</h3>
            <p className="text-xs text-gray-600 mt-1">{t(`onboarding.variety${level}Desc`.replace('HIGH', 'High').replace('MEDIUM', 'Med').replace('LOW', 'Low'))}</p>
          </div>
        </button>
      ))}
    </div>
  </div>
);

const Step7_FoodSelector: React.FC<StepProps> = ({ formData, updateData, t }) => {
  const toggleFood = (food: string) => {
    const current = formData.availableFoods || [];
    if (current.includes(food)) {
      updateData('availableFoods', current.filter(f => f !== food));
    } else {
      updateData('availableFoods', [...current, food]);
    }
  };

  const toggleCategory = (category: typeof FOOD_CATEGORIES[0]) => {
    const currentSelected = formData.availableFoods || [];
    const allCategoryFoods = category.foods;
    // Check if all items in this category are currently selected
    const isAllSelected = allCategoryFoods.every(f => currentSelected.includes(f));

    let newSelected;
    if (isAllSelected) {
      // Remove all from this category
      newSelected = currentSelected.filter(f => !allCategoryFoods.includes(f));
    } else {
      // Add missing ones
      const toAdd = allCategoryFoods.filter(f => !currentSelected.includes(f));
      newSelected = [...currentSelected, ...toAdd];
    }
    updateData('availableFoods', newSelected);
  };

  return (
    <div className="h-[60vh] flex flex-col">
      <h2 className="text-xl font-bold text-center text-gray-900">{t('onboarding.step7Title')}</h2>
      <p className="text-center text-gray-500 text-sm mb-4">{t('onboarding.step7Subtitle')}</p>

      <div className="flex-1 overflow-y-auto pr-2 space-y-6 scrollbar-hide">
        {FOOD_CATEGORIES.map(cat => (
          <div key={cat.id}>
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold text-gray-800">{t(`onboarding.${cat.label}`)}</h3>
              <button
                onClick={() => toggleCategory(cat)}
                className="text-xs font-bold text-gray-500 hover:text-fitia-green transition-colors"
              >
                {t('onboarding.selectAll')}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {cat.foods.map(food => {
                const isSelected = formData.availableFoods?.includes(food);
                return (
                  <button
                    key={food}
                    onClick={() => toggleFood(food)}
                    className={`p-3 rounded-lg flex items-center text-sm font-medium transition-colors ${isSelected
                      ? 'bg-[#EAE8DD] border border-gray-300 text-gray-900'
                      : 'bg-[#EAE8DD]/40 text-gray-500 hover:bg-[#EAE8DD]/70'
                      }`}
                  >
                    <span className="mr-2">
                      {/* Simple emojis for mock */}
                      {cat.id === 'proteins' && '🍖'}
                      {cat.id === 'carbs' && '🍚'}
                      {cat.id === 'fats' && '🥑'}
                      {cat.id === 'fruits' && '🍎'}
                    </span>
                    {t(`foods.${food.toLowerCase().replace(/ /g, '_')}`)}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Step 8 Removed

// --- Main Component ---

const Onboarding: React.FC = () => {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const totalSteps = 7;

  // Initial default state
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    name: '',
    age: 25,
    gender: Gender.Female,
    height: 165,
    weight: 70,
    targetWeight: 60,
    activityLevel: ActivityLevel.Moderate,
    goal: Goal.LoseWeight,
    dietType: DietType.Balanced,
    weightLossSpeed: WeightLossSpeed.Recommended,
    mealsPerDay: ['Breakfast', 'Lunch', 'Dinner'],
    preparationStyle: PreparationStyle.Recipes,
    varietyLevel: VarietyLevel.Medium,
    availableFoods: ['Chicken', 'Rice', 'Eggs', 'Avocado', 'Banana'],
    planningMode: PlanningMode.Custom
  });

  const handleNext = () => {
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
  };

  const updateUserProfile = useUserStore((state) => state.updateUserProfile);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  const handleFinish = async () => {
    if (isSaving) return;
    setIsSaving(true);
    // Basic validation
    let finalData = { ...formData };
    if (!finalData.name) {
      finalData.name = 'User';
    }

    try {
      const { generatePlan, fetchCurrentPlan, updateUser } = await import('../services/api');
      const store = useUserStore.getState();
      const userId = store.userId;

      if (userId) {
        // 1. Update Backend FIRST and wait
        const fullProfile = { ...store.userProfile, ...finalData, isOnboardingComplete: true } as UserProfile;

        // This is critical: We must await this to ensure backend has the flag
        await updateUser(userId, fullProfile);

        // 2. Update Local Store to trigger Navigation state in App.tsx
        store.setUserProfile(fullProfile);

        // 3. Force Navigation IMMEDIATELY
        // We do NOT await plan generation here. It happens in background.
        navigate('/dashboard', { replace: true });

        // 4. Trigger Plan Generation in background
        // We utilize the promise without awaiting it to block UI
        generatePlan(userId).then(() => {
          fetchCurrentPlan(userId).catch(console.error);
        }).catch(err => {
          console.error("Background plan generation failed:", err);
          // User is already on dashboard, they will see empty state or can retry there
        });
      }
    } catch (e) {
      console.error("Failed to finish onboarding:", e);
    }

    setIsSaving(false);
  };

  const updateData = (key: keyof UserProfile, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-[#FAF9F4] flex flex-col">
      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-gray-200">
        <div
          className="h-full bg-fitia-orange transition-all duration-500 ease-out"
          style={{ width: `${(step / totalSteps) * 100}%` }}
        ></div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center px-6 py-8 sm:mx-auto sm:w-full sm:max-w-md relative">
        <button
          onClick={() => useUserStore.getState().clearUserProfile()}
          className="absolute top-0 right-4 p-2 text-gray-400 hover:text-red-500 transition-colors z-50"
          title="cerrar sesión"
        >
          <LogOut size={20} />
        </button>

        <div className="flex-1 flex flex-col justify-center animate-in slide-in-from-right-8 duration-500 fade-in">
          {step === 1 && <Step1_Method formData={formData} updateData={updateData} t={t} onNext={handleNext} />}
          {step === 2 && <Step2_DietType formData={formData} updateData={updateData} t={t} />}
          {step === 3 && <Step3_Stats formData={formData} updateData={updateData} t={t} />}
          {step === 4 && <Step4_Meals formData={formData} updateData={updateData} t={t} />}
          {step === 5 && <Step5_PrepStyle formData={formData} updateData={updateData} t={t} />}
          {step === 6 && <Step6_Variety formData={formData} updateData={updateData} t={t} />}
          {step === 7 && <Step7_FoodSelector formData={formData} updateData={updateData} t={t} />}
        </div>

        {/* Footer Navigation */}
        <div className="mt-8 pt-4">
          {(step === totalSteps || (formData.planningMode === PlanningMode.Custom && step === 4)) ? (
            <button
              onClick={handleFinish}
              className="w-full bg-[#EAE8DD] hover:bg-[#DCD8C5] text-gray-800 py-4 rounded-xl font-bold text-lg shadow-sm transition-all transform hover:scale-[1.02]"
            >
              {isSaving ? (
                <span className="flex items-center justify-center">
                  <span className="animate-spin mr-2">⏳</span> {t('common.loading')}
                </span>
              ) : t('onboarding.generate')}
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="w-full bg-[#EAE8DD] hover:bg-[#DCD8C5] text-gray-800 py-4 rounded-xl font-bold text-lg shadow-sm transition-all transform hover:scale-[1.02]"
            >
              {t('common.next')}
            </button>
          )}

          {step > 1 && (
            <button
              onClick={handleBack}
              className="w-full mt-3 py-2 text-gray-400 font-medium hover:text-gray-600 transition-colors"
            >
              {t('common.back')}
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default Onboarding;