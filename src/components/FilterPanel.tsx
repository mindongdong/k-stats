import React from 'react';
import '../styles/components/FilterPanel.css';

interface FilterPanelProps {
  leagues: string[];
  positions: string[];
  selectedLeagues: string[];
  selectedPosition: string;
  injuredOnly: boolean;
  onLeagueChange: (leagues: string[]) => void;
  onPositionChange: (position: string) => void;
  onInjuredToggle: (checked: boolean) => void;
  onResetFilters: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  leagues,
  positions,
  selectedLeagues,
  selectedPosition,
  injuredOnly,
  onLeagueChange,
  onPositionChange,
  onInjuredToggle,
  onResetFilters
}) => {
  const handleLeagueChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const options = e.target.options;
    const selected: string[] = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selected.push(options[i].value);
      }
    }
    onLeagueChange(selected);
  };

  const hasActiveFilters = selectedLeagues.length > 0 || selectedPosition !== '' || injuredOnly;

  return (
    <div className="filter-panel fade-in" style={{ animationDelay: '0.2s' }}>
      <div className="container">
        <div className="filter-content">
          <div className="filter-header">
            <h2 className="filter-title">필터</h2>
            {hasActiveFilters && (
              <button
                className="reset-filters-btn"
                onClick={onResetFilters}
                aria-label="필터 초기화"
              >
                🔄 초기화
              </button>
            )}
          </div>

          <div className="filter-grid">
            {/* 리그 필터 */}
            <div className="filter-group">
              <label htmlFor="league-filter" className="filter-label">
                리그
              </label>
              <select
                id="league-filter"
                className="filter-select"
                multiple
                value={selectedLeagues}
                onChange={handleLeagueChange}
                size={4}
              >
                {leagues.map(league => (
                  <option key={league} value={league}>
                    {league}
                  </option>
                ))}
              </select>
              <p className="filter-hint">Ctrl/Cmd + 클릭으로 다중 선택</p>
            </div>

            {/* 포지션 필터 */}
            <div className="filter-group">
              <label htmlFor="position-filter" className="filter-label">
                포지션
              </label>
              <select
                id="position-filter"
                className="filter-select"
                value={selectedPosition}
                onChange={(e) => onPositionChange(e.target.value)}
              >
                <option value="">전체 포지션</option>
                {positions.map(position => (
                  <option key={position} value={position}>
                    {position}
                  </option>
                ))}
              </select>
            </div>

            {/* 부상 선수 필터 */}
            <div className="filter-group">
              <label className="filter-label checkbox-label">
                <input
                  type="checkbox"
                  className="filter-checkbox"
                  checked={injuredOnly}
                  onChange={(e) => onInjuredToggle(e.target.checked)}
                />
                <span className="checkbox-custom"></span>
                <span className="checkbox-text">부상 선수만 보기 🚑</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
