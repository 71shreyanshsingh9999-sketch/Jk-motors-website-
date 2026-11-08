import React from 'react';
import { Instagram, Users } from 'lucide-react';
import { HAPPY_DELIVERIES } from '../data/defaultCars';
import { ShowroomConfig } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { getAssetUrl } from '../utils/helpers';

interface CustomerStoriesProps {
  config: ShowroomConfig;
}

export const CustomerStories: React.FC<CustomerStoriesProps> = ({ config }) => {
  const { t } = useLanguage();

  return (
    <section className="py-8 sm:py-12 px-4 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FFC727] bg-[#0B2447] px-2.5 py-1 rounded-md mb-2">
            <Users className="w-3.5 h-3.5" />
            <span>{t('hero.statHappy')}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 dark:text-white">
            {t('stories.title')}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-1">
            {t('stories.subtitle')}
          </p>
        </div>

        {/* Instagram Follow link */}
        <a
          href={config.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:opacity-95 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all self-start sm:self-auto shrink-0"
        >
          <Instagram className="w-4 h-4" />
          <span>{t('stories.watchReels')} (@jk_motors_nashik)</span>
        </a>
      </div>

      {/* Customer delivery photos grid / horizontal scroll on mobile */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {HAPPY_DELIVERIES.map((item, index) => (
          <div
            key={index}
            className="group relative bg-white dark:bg-slate-900 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all"
          >
            <div className="aspect-[4/5] overflow-hidden bg-slate-100 dark:bg-slate-800">
              <img
                src={getAssetUrl(item.image)}
                alt={item.car}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
            </div>

            <div className="absolute bottom-0 inset-x-0 p-2.5 text-white">
              <span className="text-[10px] bg-[#FFC727] text-[#0B2447] font-bold px-1.5 py-0.5 rounded uppercase font-mono">
                {item.reg}
              </span>
              <p className="text-xs font-bold font-heading truncate mt-1">
                {item.car}
              </p>
              <p className="text-[11px] text-slate-300 truncate">
                {item.customer}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
