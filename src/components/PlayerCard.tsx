import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import { formatRating, formatStat, formatMinutes } from '@/utils/dataHelpers';
import { translateTeam, translateLeague, translatePosition } from '@/utils/translations';
import type { Player } from '@/types';

interface PlayerCardProps {
  player: Player;
  index: number;
  onViewProfile: (player: Player) => void;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ player, index, onViewProfile }) => {
  return (
    <AccordionItem value={`player-${player.player_id}-${index}`} className="border rounded-lg mb-2">
      <AccordionTrigger className="px-4 py-3 hover:no-underline">
        <div className="flex items-center justify-between w-full text-left">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-base">{player.player_name_kr}</span>
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
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              {translateTeam(player.team)} • {translateLeague(player.league)}
            </div>
          </div>
          <div className="flex flex-col items-end gap-1 mr-2">
            <span className="text-sm font-medium">
              평점 {player.recent_match?.rating
                ? formatRating(parseFloat(player.recent_match.rating))
                : '-'}
            </span>
            <span className="text-xs text-muted-foreground">
              {player.recent_match?.goals !== undefined
                ? formatStat(player.recent_match.goals)
                : '-'}G / {player.recent_match?.assists !== undefined
                ? formatStat(player.recent_match.assists)
                : '-'}A
            </span>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-4 pb-4">
        <div className="space-y-4">
          {/* 최근 경기 스탯 */}
          <div>
            <h4 className="text-sm font-semibold mb-2 text-primary">최근 경기 기록</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">출전시간:</span>
                <span className="font-medium">
                  {player.recent_match?.minutes
                    ? formatMinutes(player.recent_match.minutes)
                    : '-'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">평점:</span>
                <span className="font-medium">
                  {player.recent_match?.rating
                    ? formatRating(parseFloat(player.recent_match.rating))
                    : '-'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">골:</span>
                <span className="font-medium">
                  {player.recent_match?.goals !== undefined
                    ? formatStat(player.recent_match.goals)
                    : '-'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">어시스트:</span>
                <span className="font-medium">
                  {player.recent_match?.assists !== undefined
                    ? formatStat(player.recent_match.assists)
                    : '-'}
                </span>
              </div>
            </div>
          </div>

          {/* 시즌 스탯 */}
          <div>
            <h4 className="text-sm font-semibold mb-2 text-secondary">시즌 누적</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">평점:</span>
                <span className="font-medium">{formatRating(player.season_avg_rating)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">포지션:</span>
                <span className="font-medium">{translatePosition(player.position)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">골:</span>
                <span className="font-medium">{formatStat(player.season_goals)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">어시스트:</span>
                <span className="font-medium">{formatStat(player.season_assists)}</span>
              </div>
            </div>
          </div>

          {/* 액션 버튼 */}
          <div className="flex gap-2">
            <Button
              variant="default"
              size="sm"
              className="flex-1"
              onClick={() => onViewProfile(player)}
            >
              프로필 보기
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              asChild
            >
              <a
                href={player.fotmob_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2"
              >
                FotMob
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default PlayerCard;
