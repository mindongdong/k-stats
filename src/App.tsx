import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import FilterPanel from './components/FilterPanel';
import StatsTable from './components/StatsTable';
import { loadPlayerData, getUniqueLeagues, getUniquePositions } from './utils/csvParser';
import { sortData, filterData, validatePlayer } from './utils/dataHelpers';
import type { Player, SortConfig } from './types';
import './styles/App.css';

function App(): JSX.Element {
  // State Management
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filter State
  const [selectedLeagues, setSelectedLeagues] = useState<string[]>([]);
  const [selectedPosition, setSelectedPosition] = useState<string>('');
  const [injuredOnly, setInjuredOnly] = useState<boolean>(false);

  // Sort State
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: 'asc' });

  // Derived State - Unique Leagues & Positions
  const leagues = useMemo(() => {
    return players.length > 0 ? getUniqueLeagues(players) : [];
  }, [players]);

  const positions = useMemo(() => {
    return players.length > 0 ? getUniquePositions(players) : [];
  }, [players]);

  // Load CSV Data on Mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await loadPlayerData('/example.csv');

        // 데이터 검증
        const validPlayers = data.filter(validatePlayer);

        setPlayers(validPlayers);
        setLoading(false);
      } catch (err) {
        setError('데이터를 불러올 수 없습니다. 잠시 후 다시 시도해주세요.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filtered and Sorted Players
  const displayedPlayers = useMemo(() => {
    // 1. Apply Filters
    const filtered = filterData(players, {
      leagues: selectedLeagues,
      position: selectedPosition,
      injuredOnly
    });

    // 2. Apply Sorting
    const sorted = sortData(filtered, sortConfig.key, sortConfig.direction);

    return sorted;
  }, [players, selectedLeagues, selectedPosition, injuredOnly, sortConfig]);

  // Sort Handler
  const handleSort = (columnKey: string) => {
    setSortConfig(prevConfig => {
      if (prevConfig.key === columnKey) {
        // Toggle direction
        return {
          key: columnKey,
          direction: prevConfig.direction === 'asc' ? 'desc' : 'asc'
        };
      } else {
        // New column, default to ascending
        return { key: columnKey, direction: 'asc' };
      }
    });
  };

  // Reset Filters Handler
  const handleResetFilters = () => {
    setSelectedLeagues([]);
    setSelectedPosition('');
    setInjuredOnly(false);
  };

  // Loading State
  if (loading) {
    return (
      <div className="app-container">
        <div className="container">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>데이터를 불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="app-container">
        <div className="container">
          <div className="error-state">
            <h2>오류 발생</h2>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Header />

      <main className="main-content">
        <div className="container">
          <FilterPanel
            leagues={leagues}
            positions={positions}
            selectedLeagues={selectedLeagues}
            selectedPosition={selectedPosition}
            injuredOnly={injuredOnly}
            onLeagueChange={setSelectedLeagues}
            onPositionChange={setSelectedPosition}
            onInjuredToggle={setInjuredOnly}
            onResetFilters={handleResetFilters}
          />

          <StatsTable
            players={displayedPlayers}
            sortConfig={sortConfig}
            onSort={handleSort}
          />
        </div>
      </main>

      <footer className="app-footer fade-in" style={{ animationDelay: '1s' }}>
        <div className="container">
          <p>
            K-Stats | 해외파 한국 선수 스탯 아카이브 | 데이터 출처:{' '}
            <a href="https://www.fotmob.com" target="_blank" rel="noopener noreferrer">
              FotMob
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
