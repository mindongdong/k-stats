import { useEffect, useState } from 'react'
import { ExternalLink, TrendingUp, TrendingDown } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { PlayerProfile } from '@/types/playerProfile'
import { loadPlayerProfile, formatPercentile, formatDecimal, formatSuccessRate } from '@/utils/profileParser'
import { translateTeam, translateLeague, translatePosition } from '@/utils/translations'
import { formatStat } from '@/utils/dataHelpers'

interface PlayerProfileModalProps {
  playerId: string | null
  playerName: string
  onClose: () => void
}

type TabType = 'overview' | 'attack' | 'passing' | 'defense' | 'discipline' | 'advanced'

export function PlayerProfileModal({ playerId, playerName, onClose }: PlayerProfileModalProps) {
  const [profile, setProfile] = useState<PlayerProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<TabType>('overview')

  useEffect(() => {
    if (!playerId) return

    setLoading(true)
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
    { id: 'discipline', label: '징계' },
    { id: 'advanced', label: '상세' },
  ]

  const renderStatWithPercentile = (
    label: string,
    value: number | null,
    percentile?: number | null,
    unit: string = ''
  ) => {
    const percentileValue = percentile ?? 0
    const isHigh = percentileValue >= 70
    const isMid = percentileValue >= 40 && percentileValue < 70

    return (
      <div className="stat-item">
        <div className="stat-label">{label}</div>
        <div className="stat-value-row">
          <span className="stat-value">{formatStat(value)}{unit}</span>
          {percentile !== null && percentile !== undefined && (
            <span className={`stat-percentile ${isHigh ? 'high' : isMid ? 'mid' : 'low'}`}>
              {isHigh ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {formatPercentile(percentile)}
            </span>
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
                <div className="avatar-placeholder">
                  {profile.player_name_kr?.charAt(0) || profile.player_name?.charAt(0)}
                </div>
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
                <span className="detail-label">국적</span>
                <span className="detail-value">{profile.nationality}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">키</span>
                <span className="detail-value">{profile.height || '-'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">주발</span>
                <span className="detail-value">{profile.preferred_foot || '-'}</span>
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
                      <h3 className="section-title">득점</h3>
                      <div className="stat-group">
                        {renderStat('골', profile.attack_goals)}
                        {renderStat('기대 골 (xG)', formatDecimal(profile.attack_expected_goals))}
                        {renderStat('xG 차이', formatDecimal(profile.attack_xg_difference))}
                        {renderStat('논페널티 xG', formatDecimal(profile.attack_non_penalty_xg))}
                      </div>
                    </div>

                    <div className="stat-section">
                      <h3 className="section-title">슈팅</h3>
                      <div className="stat-group">
                        {renderStat('총 슈팅', profile.attack_shots)}
                        {renderStat('유효 슈팅', profile.attack_shots_on_target)}
                        {renderStat('슈팅 정확도', formatSuccessRate(profile.attack_shooting_accuracy))}
                        {renderStat('골 전환율', formatSuccessRate(profile.attack_conversion_rate))}
                        {renderStat('빅찬스 실축', profile.attack_big_chances_missed)}
                      </div>
                    </div>

                    <div className="stat-section">
                      <h3 className="section-title">드리블</h3>
                      <div className="stat-group">
                        {renderStat('성공한 드리블', profile.attack_dribbles_succeeded)}
                        {renderStat('드리블 성공률', formatSuccessRate(profile.attack_dribble_success_rate))}
                        {renderStat('박스 내 터치', profile.attack_touches_in_box)}
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
                        {renderStat('xA 차이', formatDecimal(profile.passing_xa_difference))}
                        {renderStat('키패스', profile.passing_key_passes)}
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
                        {renderStat('성공한 태클', profile.defense_tackles_successful)}
                        {renderStat('태클 성공률', formatSuccessRate(profile.defense_tackle_success_rate))}
                        {renderStat('인터셉트', profile.defense_interceptions)}
                        {renderStat('클리어링', profile.defense_clearances)}
                        {renderStat('슈팅 차단', profile.defense_blocked_shots)}
                      </div>
                    </div>

                    <div className="stat-section">
                      <h3 className="section-title">듀얼</h3>
                      <div className="stat-group">
                        {renderStat('승리한 듀얼', profile.defense_duels_won)}
                        {renderStat('듀얼 승률', formatSuccessRate(profile.defense_duel_success_rate))}
                        {renderStat('지상 듀얼 승', profile.defense_ground_duels_won)}
                        {renderStat('지상 듀얼 승률', formatSuccessRate(profile.defense_ground_duel_success_rate))}
                        {renderStat('공중볼 승', profile.defense_aerials_won)}
                        {renderStat('공중볼 승률', formatSuccessRate(profile.defense_aerial_success_rate))}
                      </div>
                    </div>

                    <div className="stat-section">
                      <h3 className="section-title">기타</h3>
                      <div className="stat-group">
                        {renderStat('볼 리커버리', profile.defense_recoveries)}
                        {renderStat('드리블 허용', profile.defense_dribbled_past)}
                        {renderStat('파울', profile.defense_fouls_committed)}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'discipline' && (
                  <div className="stats-grid">
                    <div className="stat-section">
                      <h3 className="section-title">징계 기록</h3>
                      <div className="stat-group">
                        {renderStat('옐로카드', profile.discipline_yellow_cards)}
                        {renderStat('레드카드', profile.discipline_red_cards)}
                        {renderStat('파울', profile.discipline_fouls_committed)}
                        {renderStat('얻어낸 파울', profile.discipline_fouls_won)}
                      </div>
                    </div>

                    <div className="stat-section">
                      <h3 className="section-title">점유율</h3>
                      <div className="stat-group">
                        {renderStat('총 터치', profile.possession_touches)}
                        {renderStat('박스 내 터치', profile.possession_touches_in_box)}
                        {renderStat('볼 소유권 상실', profile.possession_dispossessed)}
                        {renderStat('얻어낸 파울', profile.possession_fouls_won)}
                        {renderStat('얻어낸 페널티', profile.possession_penalty_won)}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'advanced' && (
                  <div className="stats-grid">
                    <div className="stat-section">
                      <h3 className="section-title">슈팅 분석</h3>
                      <div className="stat-group">
                        {renderStat('총 슈팅', profile.shot_total_shots)}
                        {renderStat('골', profile.shot_goals)}
                        {renderStat('유효 슈팅', profile.shot_on_target)}
                        {renderStat('차단된 슈팅', profile.shot_blocked)}
                        {renderStat('빗나간 슈팅', profile.shot_off_target)}
                        {renderStat('총 xG', formatDecimal(profile.shot_total_xg))}
                        {renderStat('슈팅 퀄리티', formatDecimal(profile.shot_quality, 3))}
                      </div>
                    </div>

                    <div className="stat-section">
                      <h3 className="section-title">슈팅 유형</h3>
                      <div className="stat-group">
                        {renderStat('왼발 슈팅', profile.shot_left_foot)}
                        {renderStat('오른발 슈팅', profile.shot_right_foot)}
                        {renderStat('헤딩 슈팅', profile.shot_headed)}
                        {renderStat('주발 비율', formatSuccessRate(profile.shot_preferred_foot_ratio))}
                      </div>
                    </div>

                    <div className="stat-section">
                      <h3 className="section-title">슈팅 상황</h3>
                      <div className="stat-group">
                        {renderStat('오픈 플레이', profile.shot_open_play)}
                        {renderStat('프리킥', profile.shot_free_kick)}
                        {renderStat('페널티킥', profile.shot_penalty)}
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
            grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
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
            gap: 0.25rem;
            padding: 0.125rem 0.5rem;
            border-radius: 0.375rem;
            font-size: 0.75rem;
            font-weight: 600;
          }

          .stat-percentile.high {
            background-color: rgba(46, 125, 50, 0.1);
            color: #2e7d32;
          }

          @media (prefers-color-scheme: dark) {
            .stat-percentile.high {
              background-color: rgba(102, 187, 106, 0.2);
              color: #66bb6a;
            }
          }

          .stat-percentile.mid {
            background-color: rgba(237, 108, 2, 0.1);
            color: #ed6c02;
          }

          @media (prefers-color-scheme: dark) {
            .stat-percentile.mid {
              background-color: rgba(255, 167, 38, 0.2);
              color: #ffa726;
            }
          }

          .stat-percentile.low {
            background-color: rgba(211, 47, 47, 0.1);
            color: #d32f2f;
          }

          @media (prefers-color-scheme: dark) {
            .stat-percentile.low {
              background-color: rgba(239, 83, 80, 0.2);
              color: #ef5350;
            }
          }

          /* Mobile Responsive */
          @media (max-width: 768px) {
            .modal-header-section {
              flex-direction: column;
              align-items: flex-start;
            }

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
