/**
 * 최근 경기 정보 타입
 */
export interface RecentMatch {
  date: string;
  opponent: string;
  result: string;
  is_home: boolean;
  minutes: number;
  goals: number;
  assists: number;
  rating: string | null;
  is_motm: boolean;
}

/**
 * CSV 데이터에서 로드되는 선수 정보 타입
 */
export interface Player {
  collection_date: string;
  week: string;
  player_id: number;
  player_name: string;
  player_name_kr: string;
  team: string;
  league: string;
  position: string;

  // 최근 경기 정보 (파싱된 데이터)
  recent_match?: RecentMatch | null;

  // 시즌 스탯 (null 가능)
  season_matches: number | null;
  season_goals: number | null;
  season_assists: number | null;
  season_avg_rating: number | null;
  season_yellow_cards: number | null;
  season_red_cards: number | null;

  // 추가 정보
  recent_matches_json: string | null;
  is_injured: string; // 'Yes' | 'No'
  injury_status: string | null;
  injury_expected_return: string | null;
  on_loan: string; // 'Yes' | 'No'
  contract_end: string | null;
  fotmob_url: string;
}

/**
 * 정렬 설정 타입
 */
export interface SortConfig {
  key: string | null;
  direction: 'asc' | 'desc';
}

/**
 * 필터 옵션 타입
 */
export interface FilterOptions {
  leagues: string[];
  position: string;
  injuredOnly: boolean;
}
