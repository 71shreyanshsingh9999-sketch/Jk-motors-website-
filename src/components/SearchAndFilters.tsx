import React from 'react';
import { Search, X, ArrowDownUp, Filter } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface SearchAndFiltersProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedFuel: string;
  onSelectFuel: (fuel: string) => void;
  selectedBodyType: string;
  onSelectBodyType: (body: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  showOnlyAvailable: boolean;
  onToggleOnlyAvailable: () => void;
  totalCount: number;
  filteredCount: number;
}

export const SearchAndFilters: React.FC<SearchAndFiltersProps> = ({
  searchQuery,
  onSearchChange,
  selectedFuel,
  onSelectFuel,
  selectedBodyType,
  onSelectBodyType,
  sortBy,
  onSortChange,
  showOnlyAvailable,
  onToggleOnlyAvailable,
  totalCount,
  filteredCount,
}) => {
  const { t } = useLanguage();

  const fuelOptions = [
    { key: 'ALL', label: t('filter.fuelAll') },
    { key: 'Diesel', label: t('filter.diesel') },
    { key: 'Petrol', label: t('filter.petrol') },
    { key: 'CNG', label: t('filter.cng') },
  ];

  const bodyOptions = [
    { key: 'ALL', label: t('filter.bodyAll') },
    { key: 'SUV', label: t('filter.suv') },
    { key: 'Sedan', label: t('filter.sedan') },
    { key: 'Hatchback', label: t('filter.hatchback') },
    { key: 'MUV', label: t('filter.muv') },
    { key: 'Van', label: t('filter.van') },
  ];

  return (
    <div id="inventory-section" className="scroll-mt-20 max-w-7xl mx-auto px-4 pt-6 pb-2">
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        {/* Top row: Search bar & Sort dropdown */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={t('filter.searchPlaceholder')}
              className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0B2447] dark:focus:ring-[#FFC727] transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Price Sort Dropdown */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="relative flex-1 sm:flex-none">
              <select
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value)}
                className="w-full sm:w-auto appearance-none pl-9 pr-8 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0B2447] cursor-pointer"
              >
                <option value="featured">{t('filter.sortFeatured')}</option>
                <option value="price-asc">{t('filter.sortPriceLow')}</option>
                <option value="price-desc">{t('filter.sortPriceHigh')}</option>
                <option value="year-desc">{t('filter.sortYearNew')}</option>
                <option value="km-asc">{t('filter.sortKmLow')}</option>
              </select>
              <ArrowDownUp className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Availability Toggle */}
            <button
              onClick={onToggleOnlyAvailable}
              className={`px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                showOnlyAvailable
                  ? 'bg-[#0B2447] text-[#FFC727] border-[#0B2447]'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${showOnlyAvailable ? 'bg-[#FFC727]' : 'bg-emerald-500'}`} />
              <span>{showOnlyAvailable ? t('filter.availableOnly') : t('filter.allStock')}</span>
            </button>
          </div>
        </div>

        {/* Fuel filter chips - horizontal scroller */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 shrink-0 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            Fuel:
          </span>
          {fuelOptions.map((fuel) => {
            const isSelected = selectedFuel === fuel.key;
            return (
              <button
                key={fuel.key}
                onClick={() => onSelectFuel(fuel.key)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#FFC727] text-[#0B2447] shadow-sm font-bold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {fuel.label}
              </button>
            );
          })}

          <div className="h-4 w-[1px] bg-slate-300 dark:bg-slate-700 mx-2 shrink-0" />

          {/* Body type chips */}
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 shrink-0 mr-1">
            Type:
          </span>
          {bodyOptions.map((bType) => {
            const isSelected = selectedBodyType === bType.key;
            return (
              <button
                key={bType.key}
                onClick={() => onSelectBodyType(bType.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#0B2447] text-white font-semibold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {bType.label}
              </button>
            );
          })}
        </div>

        {/* Counter and Active Filter Tags */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800/80">
          <span>
            {t('filter.showingCount', { count: filteredCount, total: totalCount })}
          </span>

          {(selectedFuel !== 'ALL' || selectedBodyType !== 'ALL' || searchQuery) && (
            <button
              onClick={() => {
                onSearchChange('');
                onSelectFuel('ALL');
                onSelectBodyType('ALL');
              }}
              className="text-[#0B2447] dark:text-[#FFC727] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              {t('empty.resetBtn')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
