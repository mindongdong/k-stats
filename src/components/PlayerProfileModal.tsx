import { useEffect, useState } from 'react'
import { ExternalLink, Award, Medal, Trophy } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Tooltip } from '@/components/ui/tooltip'
import { PlayerProfile } from '@/types/playerProfile'
import { loadPlayerProfile, formatPercentile, formatDecimal, formatSuccessRate } from '@/utils/profileParser'
import { translateTeam, translateLeague, translatePosition, translatePreferredFoot } from '@/utils/translations'
import { formatStat } from '@/utils/dataHelpers'

interface PlayerProfileModalProps {
  playerId: string | null
  playerName: string
  onClose: () => void
}

type TabType = 'overview' | 'attack' | 'passing' | 'defense'

export function PlayerProfileModal({ playerId, playerName, onClose }: PlayerProfileModalProps) {
  const [profile, setProfile] = useState<PlayerProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<TabType>('overview')
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    if (!playerId) return

    setLoading(true)
    setImageError(false) // Reset image error state on new player
    loadPlayerProfile(playerId)
      .then((data) => {
        setProfile(data)
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }, [playerId])

  if (!playerId) return null

  const tabs: { id: TabType; label: string }[] = [
    { id: 'overview', label: '개요' },
    { id: 'attack', label: '공격' },
    { id: 'passing', label: '패스' },
    { id: 'defense', label: '수비' },
  ]

  const getPercentileIcon = (percentile: number) => {
    if (percentile >= 90) return <Trophy className="w-3 h-3" />
    if (percentile >= 70) return <Medal className="w-3 h-3" />
    return <Award className="w-3 h-3" />
  }

  const getPercentileRank = (percentile: number) => {
    const rank = 100 - percentile
    if (rank < 1) return '상위 1%'
    if (rank < 5) return `상위 ${Math.ceil(rank)}%`
    if (rank < 10) return `상위 ${Math.round(rank)}%`
    return `상위 ${Math.round(rank / 5) * 5}%`
  }

  const renderStatWithPercentile = (
    label: string,
    value: number | null,
    percentile?: number | null,
    unit: string = ''
  ) => {
    const percentileValue = percentile ?? 0
    const isHigh = percentileValue >= 70
    const isMid = percentileValue >= 40 && percentileValue < 70

    const tooltipContent = profile
      ? `${translateLeague(profile.league)} ${translatePosition(profile.position)} 선수 중 ${getPercentileRank(percentileValue)}`
      : ''

    return (
      <div className="stat-item">
        <div className="stat-label">{label}</div>
        <div className="stat-value-row">
          <span className="stat-value">{formatStat(value)}{unit}</span>
          {percentile !== null && percentile !== undefined && (
            <Tooltip content={tooltipContent}>
              <span className={`stat-percentile ${isHigh ? 'high' : isMid ? 'mid' : 'low'}`}>
                {getPercentileIcon(percentileValue)}
                <span className="percentile-rank">{getPercentileRank(percentileValue)}</span>
              </span>
            </Tooltip>
          )}
        </div>
      </div>
    )
  }

  const renderStat = (label: string, value: number | string | null, unit: string = '') => {
    return (
      <div className="stat-item">
        <div className="stat-label">{label}</div>
        <div className="stat-value">{formatStat(value)}{unit}</div>
      </div>
    )
  }

  return (
    <Dialog open={!!playerId} onOpenChange={onClose}>
      <DialogContent className="player-modal">
        <DialogHeader>
          <DialogTitle className="sr-only">{playerName} 프로필</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="modal-loading">
            <div className="loading-spinner"></div>
            <p>선수 정보를 불러오는 중...</p>
          </div>
        ) : !profile ? (
          <div className="modal-error">
            <p>선수 정보를 찾을 수 없습니다.</p>
          </div>
        ) : (
          <div className="modal-body">
            {/* Header Section */}
            <div className="modal-header-section">
              <div className="player-avatar">
                {!imageError ? (
                  <img
                    src={`https://images.fotmob.com/image_resources/playerimages/${playerId}.png`}
                    alt={profile.player_name_kr || profile.player_name}
                    className="avatar-image"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="avatar-placeholder">
                    {profile.player_name_kr?.charAt(0) || profile.player_name?.charAt(0)}
                  </div>
                )}
              </div>
              <div className="player-info">
                <h2 className="player-name">{profile.player_name_kr || profile.player_name}</h2>
                <div className="player-meta">
                  <span className="team-badge">{translateTeam(profile.team)}</span>
                  <span className="league-badge">{translateLeague(profile.league)}</span>
                  {profile.is_injured === 'Yes' && (
                    <span className="injury-badge">부상</span>
                  )}
                </div>
              </div>
              {profile.fotmob_url && (
                <a
                  href={profile.fotmob_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="fotmob-link"
                >
                  FotMob <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>

            {/* Player Details */}
            <div className="player-details">
              <div className="detail-item">
                <span className="detail-label">포지션</span>
                <span className="detail-value">{translatePosition(profile.position)}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">나이</span>
                <span className="detail-value">{profile.age}세</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">키</span>
                <span className="detail-value">{profile.height || '-'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">주발</span>
                <span className="detail-value">{translatePreferredFoot(profile.preferred_foot)}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">시장가치</span>
                <span className="detail-value">{profile.market_value}</span>
              </div>
            </div>

            {/* Tabs */}
            <div className="tabs-container">
              <div className="tabs-list">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="tab-content">
                {activeTab === 'overview' && (
                  <div className="stats-grid">
                    <div className="stat-section">
                      <h3 className="section-title">시즌 기록</h3>
                      <div className="stat-group">
                        {renderStatWithPercentile('경기 수', profile.matches, profile.matches_percentile)}
                        {renderStatWithPercentile('선발 출전', profile.started, profile.started_percentile)}
                        {renderStatWithPercentile('출전 시간', profile.minutes_played, profile.minutes_played_percentile, '분')}
                        {renderStatWithPercentile('평점', profile.rating, profile.rating_percentile)}
                      </div>
                    </div>

                    <div className="stat-section">
                      <h3 className="section-title">공격 포인트</h3>
                      <div className="stat-group">
                        {renderStatWithPercentile('골', profile.goals, profile.goals_percentile)}
                        {renderStatWithPercentile('도움', profile.assists, profile.assists_percentile)}
                        {renderStat('골 (90분당)', formatDecimal(profile.goals_per90))}
                        {renderStat('도움 (90분당)', formatDecimal(profile.assists_per90))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'attack' && (
                  <div className="stats-grid">
                    <div className="stat-section">
                      <h3 className="section-title">득점 & 기대 골</h3>
                      <div className="stat-group">
                        {renderStat('골', profile.attack_goals)}
                        {renderStat('기대 골 (xG)', formatDecimal(profile.attack_expected_goals))}
                        {renderStat('논페널티 xG', formatDecimal(profile.attack_non_penalty_xg))}
                      </div>
                    </div>

                    <div className="stat-section">
                      <h3 className="section-title">슈팅 통계</h3>
                      <div className="stat-group">
                        {renderStat('총 슈팅', profile.shot_total_shots)}
                        {renderStat('유효 슈팅', profile.shot_on_target)}
                        {renderStat('골 전환율', formatSuccessRate(profile.attack_conversion_rate))}
                      </div>
                    </div>

                    <div className="stat-section">
                      <h3 className="section-title">슈팅 상세</h3>
                      <div className="stat-group">
                        {renderStat('왼발 슈팅', profile.shot_left_foot)}
                        {renderStat('오른발 슈팅', profile.shot_right_foot)}
                        {renderStat('헤딩 슈팅', profile.shot_headed)}
                        {renderStat('주발 비율', formatSuccessRate(profile.shot_preferred_foot_ratio))}
                        {renderStat('오픈 플레이', profile.shot_open_play)}
                        {renderStat('프리킥', profile.shot_free_kick)}
                        {renderStat('페널티킥', profile.shot_penalty)}
                      </div>
                    </div>

                    <div className="stat-section">
                      <h3 className="section-title">드리블 & 터치</h3>
                      <div className="stat-group">
                        {renderStat('성공한 드리블', profile.attack_dribbles_succeeded)}
                        {renderStat('드리블 성공률', formatSuccessRate(profile.attack_dribble_success_rate))}
                        {renderStat('박스 내 터치', profile.attack_touches_in_box)}
                        {renderStat('얻어낸 페널티', profile.possession_penalty_won)}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'passing' && (
                  <div className="stats-grid">
                    <div className="stat-section">
                      <h3 className="section-title">어시스트</h3>
                      <div className="stat-group">
                        {renderStat('도움', profile.passing_assists)}
                        {renderStat('기대 도움 (xA)', formatDecimal(profile.passing_expected_assists))}
                        {renderStat('찬스 창출', profile.passing_chances_created)}
                      </div>
                    </div>

                    <div className="stat-section">
                      <h3 className="section-title">패스 정확도</h3>
                      <div className="stat-group">
                        {renderStat('성공한 패스', profile.passing_successful_passes)}
                        {renderStat('패스 성공률', formatSuccessRate(profile.passing_pass_accuracy))}
                        {renderStat('롱볼 성공', profile.passing_long_balls_accurate)}
                        {renderStat('롱볼 성공률', formatSuccessRate(profile.passing_long_ball_accuracy))}
                      </div>
                    </div>

                    <div className="stat-section">
                      <h3 className="section-title">크로스</h3>
                      <div className="stat-group">
                        {renderStat('성공한 크로스', profile.passing_crosses_accurate)}
                        {renderStat('크로스 성공률', formatSuccessRate(profile.passing_cross_accuracy))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'defense' && (
                  <div className="stats-grid">
                    <div className="stat-section">
                      <h3 className="section-title">태클 & 인터셉트</h3>
                      <div className="stat-group">
                        {renderStat('태클', profile.defense_tackles)}
                        {renderStat('인터셉트', profile.defense_interceptions)}
                        {renderStat('슈팅 차단', profile.defense_blocked_shots)}
                      </div>
                    </div>

                    <div className="stat-section">
                      <h3 className="section-title">경합</h3>
                      <div className="stat-group">
                        {renderStat('승리한 경합', profile.defense_duels_won)}
                        {renderStat('경합 승률', formatSuccessRate(profile.defense_duel_success_rate))}
                        {renderStat('공중볼 승', profile.defense_aerials_won)}
                        {renderStat('공중볼 승률', formatSuccessRate(profile.defense_aerial_success_rate))}
                      </div>
                    </div>

                    <div className="stat-section">
                      <h3 className="section-title">기타</h3>
                      <div className="stat-group">
                        {renderStat('볼 리커버리', profile.defense_recoveries)}
                        {renderStat('드리블 허용', profile.defense_dribbled_past)}
                        {renderStat('볼 소유권 상실', profile.possession_dispossessed)}
                      </div>
                    </div>

                    <div className="stat-section">
                      <h3 className="section-title">반칙</h3>
                      <div className="stat-group">
                        {renderStat('옐로카드', profile.discipline_yellow_cards)}
                        {renderStat('레드카드', profile.discipline_red_cards)}
                        {renderStat('범한 파울', profile.discipline_fouls_committed)}
                        {renderStat('얻어낸 파울', profile.discipline_fouls_won)}
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        )}

        <style>{`
          .player-modal {
            padding: 0 !important;
          }

          .modal-body {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
            padding: 1.5rem;
            max-height: calc(90vh - 3rem);
            overflow-y: auto;
          }

          .modal-loading,
          .modal-error {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 3rem;
            gap: 1rem;
            color: #666;
          }

          .loading-spinner {
            width: 40px;
            height: 40px;
            border: 3px solid rgba(198, 40, 40, 0.1);
            border-top-color: #c62828;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
          }

          @keyframes spin {
            to { transform: rotate(360deg); }
          }

          /* Header Section */
          .modal-header-section {
            display: flex;
            align-items: center;
            gap: 1.25rem;
            padding-bottom: 1.5rem;
            border-bottom: 1px solid rgba(0, 0, 0, 0.08);
          }

          @media (prefers-color-scheme: dark) {
            .modal-header-section {
              border-bottom-color: rgba(255, 255, 255, 0.08);
            }
          }

          .player-avatar {
            flex-shrink: 0;
            width: 80px;
            height: 80px;
          }

          .avatar-image {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            object-fit: cover;
            background-color: rgba(0, 0, 0, 0.02);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          }

          @media (prefers-color-scheme: dark) {
            .avatar-image {
              background-color: rgba(255, 255, 255, 0.02);
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            }
          }

          .avatar-placeholder {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            background: linear-gradient(135deg, #c62828 0%, #0d47a1 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 2rem;
            font-weight: 700;
            box-shadow: 0 4px 12px rgba(198, 40, 40, 0.2);
          }

          .player-info {
            flex: 1;
            min-width: 0;
          }

          .player-name {
            font-size: 1.75rem;
            font-weight: 700;
            color: #000;
            margin-bottom: 0.5rem;
            line-height: 1.2;
          }

          @media (prefers-color-scheme: dark) {
            .player-name {
              color: #e8e8e8;
            }
          }

          .player-meta {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
          }

          .team-badge,
          .league-badge,
          .injury-badge {
            padding: 0.25rem 0.75rem;
            border-radius: 0.5rem;
            font-size: 0.875rem;
            font-weight: 600;
          }

          .team-badge {
            background-color: rgba(13, 71, 161, 0.1);
            color: #0d47a1;
          }

          @media (prefers-color-scheme: dark) {
            .team-badge {
              background-color: rgba(13, 71, 161, 0.2);
              color: #5b9bff;
            }
          }

          .league-badge {
            background-color: rgba(0, 0, 0, 0.05);
            color: #666;
          }

          @media (prefers-color-scheme: dark) {
            .league-badge {
              background-color: rgba(255, 255, 255, 0.08);
              color: #a0a0a0;
            }
          }

          .injury-badge {
            background-color: rgba(198, 40, 40, 0.1);
            color: #c62828;
          }

          @media (prefers-color-scheme: dark) {
            .injury-badge {
              background-color: rgba(198, 40, 40, 0.2);
              color: #ff6b6b;
            }
          }

          .fotmob-link {
            display: inline-flex;
            align-items: center;
            gap: 0.375rem;
            padding: 0.5rem 1rem;
            background-color: rgba(198, 40, 40, 0.1);
            color: #c62828;
            border-radius: 0.5rem;
            font-size: 0.875rem;
            font-weight: 600;
            text-decoration: none;
            transition: all 0.15s ease;
            white-space: nowrap;
          }

          .fotmob-link:hover {
            background-color: #c62828;
            color: white;
            transform: translateY(-1px);
            box-shadow: 0 4px 8px rgba(198, 40, 40, 0.2);
          }

          /* Player Details */
          .player-details {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
            gap: 1rem;
            padding: 1rem;
            background-color: rgba(0, 0, 0, 0.02);
            border-radius: 0.75rem;
          }

          @media (prefers-color-scheme: dark) {
            .player-details {
              background-color: rgba(255, 255, 255, 0.02);
            }
          }

          .detail-item {
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
          }

          .detail-label {
            font-size: 0.75rem;
            font-weight: 600;
            color: #999;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }

          .detail-value {
            font-size: 0.9375rem;
            font-weight: 600;
            color: #000;
          }

          @media (prefers-color-scheme: dark) {
            .detail-value {
              color: #e8e8e8;
            }
          }

          /* Tabs */
          .tabs-container {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
          }

          .tabs-list {
            display: flex;
            gap: 0.5rem;
            padding: 0.25rem;
            background-color: rgba(0, 0, 0, 0.03);
            border-radius: 0.75rem;
            overflow-x: auto;
            scrollbar-width: none;
          }

          .tabs-list::-webkit-scrollbar {
            display: none;
          }

          @media (prefers-color-scheme: dark) {
            .tabs-list {
              background-color: rgba(255, 255, 255, 0.03);
            }
          }

          .tab-button {
            flex: 1;
            min-width: fit-content;
            padding: 0.625rem 1.25rem;
            background: transparent;
            border: none;
            border-radius: 0.5rem;
            font-size: 0.9375rem;
            font-weight: 600;
            color: #666;
            cursor: pointer;
            transition: all 0.15s ease;
            white-space: nowrap;
          }

          .tab-button:hover {
            background-color: rgba(0, 0, 0, 0.04);
            color: #000;
          }

          @media (prefers-color-scheme: dark) {
            .tab-button {
              color: #a0a0a0;
            }
            .tab-button:hover {
              background-color: rgba(255, 255, 255, 0.05);
              color: #e8e8e8;
            }
          }

          .tab-button.active {
            background-color: #c62828;
            color: white;
          }

          .tab-button.active:hover {
            background-color: #b02525;
          }

          /* Tab Content */
          .tab-content {
            animation: fadeIn 0.3s ease;
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(8px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .stats-grid {
            display: grid;
            gap: 1.5rem;
          }

          .stat-section {
            background-color: rgba(0, 0, 0, 0.02);
            border-radius: 0.75rem;
            padding: 1.25rem;
          }

          @media (prefers-color-scheme: dark) {
            .stat-section {
              background-color: rgba(255, 255, 255, 0.02);
            }
          }

          .section-title {
            font-size: 1rem;
            font-weight: 700;
            color: #000;
            margin-bottom: 1rem;
            padding-bottom: 0.75rem;
            border-bottom: 2px solid rgba(198, 40, 40, 0.2);
          }

          @media (prefers-color-scheme: dark) {
            .section-title {
              color: #e8e8e8;
            }
          }

          .stat-group {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
            gap: 1rem;
          }

          .stat-item {
            display: flex;
            flex-direction: column;
            gap: 0.375rem;
          }

          .stat-label {
            font-size: 0.8125rem;
            font-weight: 500;
            color: #666;
          }

          @media (prefers-color-scheme: dark) {
            .stat-label {
              color: #a0a0a0;
            }
          }

          .stat-value-row {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            flex-wrap: nowrap;
          }

          .stat-value {
            font-size: 1.125rem;
            font-weight: 700;
            color: #000;
          }

          @media (prefers-color-scheme: dark) {
            .stat-value {
              color: #e8e8e8;
            }
          }

          .stat-percentile {
            display: inline-flex;
            align-items: center;
            gap: 0.375rem;
            padding: 0.25rem 0.625rem;
            border-radius: 1rem;
            font-size: 0.75rem;
            font-weight: 700;
            letter-spacing: 0.01em;
            cursor: help;
            transition: all 0.2s ease;
            border: 1.5px solid transparent;
            white-space: nowrap;
            flex-shrink: 0;
          }

          .stat-percentile:hover {
            transform: translateY(-1px);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          }

          .percentile-rank {
            font-variant-numeric: tabular-nums;
          }

          .stat-percentile.high {
            background: linear-gradient(135deg, rgba(255, 215, 0, 0.15) 0%, rgba(212, 175, 55, 0.1) 100%);
            color: #b8860b;
            border-color: rgba(218, 165, 32, 0.3);
          }

          .stat-percentile.high:hover {
            background: linear-gradient(135deg, rgba(255, 215, 0, 0.25) 0%, rgba(212, 175, 55, 0.15) 100%);
            border-color: rgba(218, 165, 32, 0.5);
          }

          @media (prefers-color-scheme: dark) {
            .stat-percentile.high {
              background: linear-gradient(135deg, rgba(255, 215, 0, 0.2) 0%, rgba(212, 175, 55, 0.15) 100%);
              color: #ffd700;
              border-color: rgba(255, 215, 0, 0.3);
            }

            .stat-percentile.high:hover {
              background: linear-gradient(135deg, rgba(255, 215, 0, 0.3) 0%, rgba(212, 175, 55, 0.2) 100%);
              border-color: rgba(255, 215, 0, 0.5);
            }
          }

          .stat-percentile.mid {
            background: linear-gradient(135deg, rgba(192, 192, 192, 0.15) 0%, rgba(169, 169, 169, 0.1) 100%);
            color: #708090;
            border-color: rgba(192, 192, 192, 0.3);
          }

          .stat-percentile.mid:hover {
            background: linear-gradient(135deg, rgba(192, 192, 192, 0.25) 0%, rgba(169, 169, 169, 0.15) 100%);
            border-color: rgba(192, 192, 192, 0.5);
          }

          @media (prefers-color-scheme: dark) {
            .stat-percentile.mid {
              background: linear-gradient(135deg, rgba(192, 192, 192, 0.2) 0%, rgba(169, 169, 169, 0.15) 100%);
              color: #c0c0c0;
              border-color: rgba(192, 192, 192, 0.3);
            }

            .stat-percentile.mid:hover {
              background: linear-gradient(135deg, rgba(192, 192, 192, 0.3) 0%, rgba(169, 169, 169, 0.2) 100%);
              border-color: rgba(192, 192, 192, 0.5);
            }
          }

          .stat-percentile.low {
            background: linear-gradient(135deg, rgba(205, 127, 50, 0.15) 0%, rgba(184, 115, 51, 0.1) 100%);
            color: #8b4513;
            border-color: rgba(205, 127, 50, 0.3);
          }

          .stat-percentile.low:hover {
            background: linear-gradient(135deg, rgba(205, 127, 50, 0.25) 0%, rgba(184, 115, 51, 0.15) 100%);
            border-color: rgba(205, 127, 50, 0.5);
          }

          @media (prefers-color-scheme: dark) {
            .stat-percentile.low {
              background: linear-gradient(135deg, rgba(205, 127, 50, 0.2) 0%, rgba(184, 115, 51, 0.15) 100%);
              color: #cd7f32;
              border-color: rgba(205, 127, 50, 0.3);
            }

            .stat-percentile.low:hover {
              background: linear-gradient(135deg, rgba(205, 127, 50, 0.3) 0%, rgba(184, 115, 51, 0.2) 100%);
              border-color: rgba(205, 127, 50, 0.5);
            }
          }

          /* Mobile Responsive */
          @media (max-width: 768px) {
            .modal-header-section {
              flex-direction: column;
              align-items: flex-start;
            }

            .player-avatar {
              width: 64px;
              height: 64px;
            }

            .avatar-image,
            .avatar-placeholder {
              width: 64px;
              height: 64px;
              font-size: 1.5rem;
            }

            .player-name {
              font-size: 1.5rem;
            }

            .fotmob-link {
              align-self: stretch;
              justify-content: center;
            }

            .player-details {
              grid-template-columns: repeat(2, 1fr);
            }

            .stat-group {
              grid-template-columns: 1fr;
            }
          }
        `}</style>
      </DialogContent>
    </Dialog>
  )
}
