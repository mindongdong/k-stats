import React, { useRef } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Accordion } from '@/components/ui/accordion';
import { ArrowUpDown, ArrowUp, ArrowDown, ExternalLink } from 'lucide-react';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useScrollShadow } from '@/hooks/useScrollShadow';
import { formatRating, formatStat, formatMinutes } from '@/utils/dataHelpers';
import { translateTeam, translateLeague, translatePosition } from '@/utils/translations';
import type { Player, SortConfig } from '@/types';
import PlayerCard from './PlayerCard';
import { cn } from '@/lib/utils';

interface StatsTableProps {
  players: Player[];
  sortConfig: SortConfig;
  onSort: (key: string) => void;
  onPlayerClick: (player: Player) => void;
}

interface Column {
  key: string;
  label: string;
  sortable: boolean;
  className?: string;
}

const StatsTable: React.FC<StatsTableProps> = ({ players, sortConfig, onSort, onPlayerClick }) => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const tableWrapperRef = useRef<HTMLDivElement>(null);
  const { scrolled, scrolledEnd } = useScrollShadow(tableWrapperRef);

  const getSortIcon = (columnKey: string) => {
    if (sortConfig.key !== columnKey) {
      return <ArrowUpDown className="ml-2 h-4 w-4" />;
    }
    return sortConfig.direction === 'asc' ? (
      <ArrowUp className="ml-2 h-4 w-4" />
    ) : (
      <ArrowDown className="ml-2 h-4 w-4" />
    );
  };

  const columns: Column[] = [
    { key: 'player_name_kr', label: '선수명', sortable: true, className: 'min-w-[180px] sticky left-0 bg-background z-10' },
    { key: 'team', label: '소속팀', sortable: true },
    { key: 'league', label: '리그', sortable: true },
    { key: 'position', label: '포지션', sortable: true },
    { key: 'recent_rating', label: '최근 평점', sortable: true },
    { key: 'recent_minutes', label: '최근 출전', sortable: true },
    { key: 'recent_goals', label: '최근 골', sortable: true },
    { key: 'recent_assists', label: '최근 AS', sortable: true },
    { key: 'season_avg_rating', label: '시즌 평점', sortable: true },
    { key: 'season_goals', label: '시즌 골', sortable: true },
    { key: 'season_assists', label: '시즌 AS', sortable: true },
  ];

  // Mobile View (아코디언 카드)
  if (isMobile) {
    return (
      <div className="w-full px-4 py-6">
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            총 <span className="font-semibold text-foreground">{players.length}</span>명의 선수
          </p>
        </div>
        {players.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            필터 조건에 맞는 선수가 없습니다
          </div>
        ) : (
          <Accordion type="multiple" className="w-full">
            {players.map((player, index) => (
              <PlayerCard
                key={`${player.player_id}-${index}`}
                player={player}
                index={index}
                onViewProfile={onPlayerClick}
              />
            ))}
          </Accordion>
        )}
      </div>
    );
  }

  // Desktop View (테이블)
  return (
    <div className="w-full">
      <div
        ref={tableWrapperRef}
        className={cn(
          'relative w-full overflow-x-auto',
          'before:absolute before:left-0 before:top-0 before:bottom-0 before:w-10 before:bg-gradient-to-r before:from-background before:to-transparent before:pointer-events-none before:z-20 before:opacity-0 before:transition-opacity',
          'after:absolute after:right-0 after:top-0 after:bottom-0 after:w-10 after:bg-gradient-to-l after:from-background after:to-transparent after:pointer-events-none after:z-20 after:opacity-0 after:transition-opacity',
          scrolled && 'before:opacity-100',
          !scrolledEnd && 'after:opacity-100'
        )}
      >
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead
                  key={col.key}
                  className={cn(
                    col.sortable && 'cursor-pointer select-none hover:bg-muted/50',
                    col.className
                  )}
                  onClick={col.sortable ? () => onSort(col.key) : undefined}
                >
                  <div className="flex items-center">
                    {col.label}
                    {col.sortable && getSortIcon(col.key)}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {players.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  필터 조건에 맞는 선수가 없습니다
                </TableCell>
              </TableRow>
            ) : (
              players.map((player, index) => (
                <TableRow
                  key={`${player.player_id}-${index}`}
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => onPlayerClick(player)}
                >
                  {/* 선수명 (Sticky) */}
                  <TableCell className="font-medium sticky left-0 bg-background z-10">
                    <div className="flex items-center gap-2">
                      <span className="text-primary">{player.player_name_kr}</span>
                      {player.is_injured === 'Yes' && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          className="h-4 w-4 text-destructive"
                          fill="currentColor"
                          title={`부상 상태: ${player.injury_status || '확인 필요'}`}
                        >
                          <rect x="10" y="3" width="4" height="18" rx="0.5" />
                          <rect x="3" y="10" width="18" height="4" rx="0.5" />
                        </svg>
                      )}
                      <a
                        href={player.fotmob_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="opacity-50 hover:opacity-100 transition-opacity"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </TableCell>

                  {/* 소속팀 */}
                  <TableCell>{translateTeam(player.team) || '-'}</TableCell>

                  {/* 리그 */}
                  <TableCell>{translateLeague(player.league) || '-'}</TableCell>

                  {/* 포지션 */}
                  <TableCell>{translatePosition(player.position) || '-'}</TableCell>

                  {/* 최근 평점 */}
                  <TableCell className="font-semibold">
                    {player.recent_match?.rating
                      ? formatRating(parseFloat(player.recent_match.rating))
                      : '-'}
                  </TableCell>

                  {/* 최근 출전시간 */}
                  <TableCell>
                    {player.recent_match?.minutes
                      ? formatMinutes(player.recent_match.minutes)
                      : '-'}
                  </TableCell>

                  {/* 최근 골 */}
                  <TableCell className="text-center">
                    {player.recent_match?.goals !== undefined
                      ? formatStat(player.recent_match.goals)
                      : '-'}
                  </TableCell>

                  {/* 최근 어시스트 */}
                  <TableCell className="text-center">
                    {player.recent_match?.assists !== undefined
                      ? formatStat(player.recent_match.assists)
                      : '-'}
                  </TableCell>

                  {/* 시즌 평점 */}
                  <TableCell className="font-medium">
                    {formatRating(player.season_avg_rating)}
                  </TableCell>

                  {/* 시즌 골 */}
                  <TableCell className="text-center">
                    {formatStat(player.season_goals)}
                  </TableCell>

                  {/* 시즌 어시스트 */}
                  <TableCell className="text-center">
                    {formatStat(player.season_assists)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4 px-4 pb-4">
        <p className="text-sm text-muted-foreground">
          총 <span className="font-semibold text-foreground">{players.length}</span>명의 선수
        </p>
      </div>
    </div>
  );
};

export default StatsTable;
