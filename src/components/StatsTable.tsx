import React from 'react';
import PlayerRow from './PlayerRow';
import type { Player, SortConfig } from '../types';
import '../styles/components/StatsTable.css';

interface StatsTableProps {
  players: Player[];
  sortConfig: SortConfig;
  onSort: (key: keyof Player) => void;
}

interface Column {
  key: keyof Player;
  label: string;
  sortable: boolean;
}

const StatsTable: React.FC<StatsTableProps> = ({ players, sortConfig, onSort }) => {
  const getSortIcon = (columnKey: keyof Player): JSX.Element => {
    if (sortConfig.key !== columnKey) {
      return <span className="sort-icon neutral">⇅</span>;
    }
    return sortConfig.direction === 'asc' ? (
      <span className="sort-icon asc">▲</span>
    ) : (
      <span className="sort-icon desc">▼</span>
    );
  };

  const handleHeaderClick = (columnKey: keyof Player) => {
    onSort(columnKey);
  };

  const columns: Column[] = [
    { key: 'player_name_kr', label: '선수명', sortable: true },
    { key: 'team', label: '소속팀', sortable: true },
    { key: 'league', label: '리그', sortable: true },
    { key: 'position', label: '포지션', sortable: true },
    { key: 'weekly_avg_rating', label: '주간 평점', sortable: true },
    { key: 'weekly_minutes', label: '주간 출전', sortable: true },
    { key: 'weekly_goals', label: '주간 골', sortable: true },
    { key: 'weekly_assists', label: '주간 AS', sortable: true },
    { key: 'season_avg_rating', label: '시즌 평점', sortable: true },
    { key: 'season_goals', label: '시즌 골', sortable: true },
    { key: 'season_assists', label: '시즌 AS', sortable: true }
  ];

  return (
    <div className="table-container">
      <div className="table-wrapper">
        <table className="stats-table">
          <thead>
            <tr>
              {columns.map(col => (
                <th
                  key={col.key}
                  className={`table-header ${col.sortable ? 'sortable' : ''}`}
                  onClick={col.sortable ? () => handleHeaderClick(col.key) : undefined}
                >
                  <span className="header-content">
                    {col.label}
                    {col.sortable && getSortIcon(col.key)}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {players.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="no-data">
                  필터 조건에 맞는 선수가 없습니다
                </td>
              </tr>
            ) : (
              players.map((player, index) => (
                <PlayerRow
                  key={`${player.player_id}-${index}`}
                  player={player}
                  index={index}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="table-footer">
        <p className="player-count">
          총 <strong>{players.length}</strong>명의 선수
        </p>
      </div>
    </div>
  );
};

export default StatsTable;
