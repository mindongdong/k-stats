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
        console.log('🔄 CSV 데이터 로딩 시작...');

        const data = await loadPlayerData('/example.csv');
        console.log('📥 로드된 전체 데이터 개수:', data.length);

        // 데이터 검증
        const validPlayers = data.filter(validatePlayer);
        const invalidCount = data.length - validPlayers.length;

        if (invalidCount > 0) {
          console.warn(`⚠️ ${invalidCount}개의 유효하지 않은 데이터 제외됨`);
        }

        console.log('✅ 유효한 선수 데이터:', validPlayers.length, '명');
        console.log('👥 샘플 선수:', validPlayers.slice(0, 3).map(p => p.player_name_kr));

        setPlayers(validPlayers);
        setLoading(false);
      } catch (err) {
        console.error('❌ 데이터 로딩 실패:', err);
        setError('데이터를 불러올 수 없습니다. 잠시 후 다시 시도해주세요.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filtered and Sorted Players
  const displayedPlayers = useMemo(() => {
    console.log('🔍 필터링 시작:', {
      전체선수: players.length,
      선택리그: selectedLeagues.length > 0 ? selectedLeagues : '전체',
      선택포지션: selectedPosition || '전체',
      부상선수만: injuredOnly
    });

    // 1. Apply Filters
    const filtered = filterData(players, {
      leagues: selectedLeagues,
      position: selectedPosition,
      injuredOnly
    });

    console.log('✅ 필터 적용 후:', filtered.length, '명');

    // 2. Apply Sorting
    const sorted = sortData(filtered, sortConfig.key, sortConfig.direction);

    if (sortConfig.key) {
      console.log('📊 정렬 적용:', sortConfig.key, sortConfig.direction);
    }

    return sorted;
  }, [players, selectedLeagues, selectedPosition, injuredOnly, sortConfig]);

  // Sort Handler
  const handleSort = (columnKey: keyof Player) => {
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
    console.log('🔄 필터 초기화 완료');
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
