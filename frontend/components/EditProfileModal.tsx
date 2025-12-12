import React, { useState } from 'react';
import { UserProfile, Goal, ActivityLevel } from '../types';
import { X, Save } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface EditProfileModalProps {
  userProfile: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedProfile: UserProfile) => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ userProfile, isOpen, onClose, onSave }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<UserProfile>(userProfile);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-4 border-b border-gray-100 dark:border-gray-700">
          <h3 className="font-bold text-lg text-gray-800 dark:text-white">{t('dashboard.editProfile')}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('onboarding.nameLabel')}</label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-fitia-green outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('onboarding.weightLabel')}</label>
              <input
                type="number"
                value={formData.weight}
                onChange={e => setFormData({ ...formData, weight: Number(e.target.value) })}
                className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-fitia-green outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('onboarding.heightLabel')}</label>
              <input
                type="number"
                value={formData.height}
                onChange={e => setFormData({ ...formData, height: Number(e.target.value) })}
                className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-fitia-green outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('onboarding.goalTitle')}</label>
            <select
              value={formData.goal}
              onChange={e => setFormData({ ...formData, goal: e.target.value as Goal })}
              className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-fitia-green outline-none"
            >
              {Object.values(Goal).map(g => <option key={g} value={g}>{t(`enums.${g}`)}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('onboarding.activityTitle')}</label>
            <select
              value={formData.activityLevel}
              onChange={e => setFormData({ ...formData, activityLevel: e.target.value as ActivityLevel })}
              className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-fitia-green outline-none"
            >
              {Object.values(ActivityLevel).map(a => <option key={a} value={a}>{t(`enums.${a}`)}</option>)}
            </select>
          </div>
        </div>

        <div className="p-4 border-t border-gray-100 dark:border-gray-700 flex justify-end space-x-3 bg-gray-50 dark:bg-gray-800/50">
          <button onClick={onClose} className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-sm font-medium">
            {t('common.cancel')}
          </button>
          <button onClick={handleSave} className="px-4 py-2 bg-fitia-green text-white rounded-lg text-sm font-medium hover:bg-green-600 flex items-center shadow-lg shadow-green-200 dark:shadow-none">
            <Save size={16} className="mr-2" />
            {t('common.save')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;