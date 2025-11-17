import React from 'react';
import { formatRating, formatStat, formatMinutes } from '../utils/dataHelpers';
import type { Player } from '../types';

interface PlayerRowProps {
  player: Player;
  index: number;
}

const PlayerRow: React.FC<PlayerRowProps> = ({ player, index }) => {
  const animationDelay = index < 10 ? `${0.4 + index * 0.03}s` : '0s';

  return (
    <tr
      className="player-row"
      style={{
        animationDelay,
        animation: index < 10 ? 'slideUp 0.5s ease-out forwards' : 'none',
        opacity: index < 10 ? undefined : 1
      }}
    >
      {/* 선수명 + 부상 아이콘 + Fotmob 링크 */}
      <td className="player-name-cell">
        <a
          href={player.fotmob_url}
          target="_blank"
          rel="noopener noreferrer"
          className="player-name-link"
        >
          {player.player_name_kr}
          {player.is_injured === 'Yes' && (
            <span
              className="injury-icon"
              title={`부상 상태: ${player.injury_status || '확인 필요'}`}
            >
              🚑
            </span>
          )}
        </a>
      </td>

      {/* 소속팀 */}
      <td>{player.team || '-'}</td>

      {/* 리그 */}
      <td className="league-cell">{player.league || '-'}</td>

      {/* 포지션 */}
      <td>{player.position || '-'}</td>

      {/* 주간 평점 */}
      <td className="rating-cell">
        {formatRating(player.weekly_avg_rating)}
      </td>

      {/* 주간 출전시간 */}
      <td>{formatMinutes(player.weekly_minutes)}</td>

      {/* 주간 골 */}
      <td className="stat-cell">{formatStat(player.weekly_goals)}</td>

      {/* 주간 어시스트 */}
      <td className="stat-cell">{formatStat(player.weekly_assists)}</td>

      {/* 시즌 평점 */}
      <td className="rating-cell">
        {formatRating(player.season_avg_rating)}
      </td>

      {/* 시즌 골 */}
      <td className="stat-cell">{formatStat(player.season_goals)}</td>

      {/* 시즌 어시스트 */}
      <td className="stat-cell">{formatStat(player.season_assists)}</td>
    </tr>
  );
};

export default PlayerRow;
