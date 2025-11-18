import type { Player, FilterOptions } from '../types';

/**
 * 데이터 정렬 함수
 * @param data - 정렬할 데이터 배열
 * @param key - 정렬 기준 컬럼 (Player 속성 또는 커스텀 키)
 * @param direction - 정렬 방향 ('asc' | 'desc')
 * @returns 정렬된 데이터
 */
export const sortData = (
  data: Player[],
  key: string | null,
  direction: 'asc' | 'desc'
): Player[] => {
  if (!key) return data;

  return [...data].sort((a, b) => {
    let aValue: any;
    let bValue: any;

    // 커스텀 키 처리 (최근 경기 데이터)
    if (key === 'recent_rating') {
      aValue = a.recent_match?.rating ? parseFloat(a.recent_match.rating) : null;
      bValue = b.recent_match?.rating ? parseFloat(b.recent_match.rating) : null;
    } else if (key === 'recent_minutes') {
      aValue = a.recent_match?.minutes ?? null;
      bValue = b.recent_match?.minutes ?? null;
    } else if (key === 'recent_goals') {
      aValue = a.recent_match?.goals ?? null;
      bValue = b.recent_match?.goals ?? null;
    } else if (key === 'recent_assists') {
      aValue = a.recent_match?.assists ?? null;
      bValue = b.recent_match?.assists ?? null;
    } else {
      // 기본 Player 속성 접근
      aValue = a[key as keyof Player];
      bValue = b[key as keyof Player];
    }

    // null, undefined, 빈 문자열 처리
    if (aValue == null || aValue === '') aValue = direction === 'asc' ? Infinity : -Infinity;
    if (bValue == null || bValue === '') bValue = direction === 'asc' ? Infinity : -Infinity;

    // 숫자 정렬
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return direction === 'asc' ? aValue - bValue : bValue - aValue;
    }

    // 문자열 정렬
    const aString = String(aValue).toLowerCase();
    const bString = String(bValue).toLowerCase();

    if (direction === 'asc') {
      return aString.localeCompare(bString);
    } else {
      return bString.localeCompare(aString);
    }
  });
};

/**
 * 데이터 필터링 함수
 * @param data - 필터링할 데이터
 * @param filters - 필터 옵션
 * @returns 필터링된 데이터
 */
export const filterData = (data: Player[], filters: FilterOptions): Player[] => {
  const { leagues, position, injuredOnly } = filters;

  return data.filter(player => {
    // 리그 필터 (다중 선택)
    if (leagues && leagues.length > 0) {
      if (!leagues.includes(player.league)) {
        return false;
      }
    }

    // 포지션 필터
    if (position && position !== '') {
      if (player.position !== position) {
        return false;
      }
    }

    // 부상 선수만 보기 필터
    if (injuredOnly) {
      if (player.is_injured !== 'Yes') {
        return false;
      }
    }

    return true;
  });
};

/**
 * 평점 포맷팅 (0은 '-'로 표시)
 * @param rating - 평점 값
 * @returns 포맷된 평점 문자열
 */
export const formatRating = (rating: number | null | undefined): string => {
  if (rating == null || rating === 0 || rating === '') {
    return '-';
  }
  return typeof rating === 'number' ? rating.toFixed(2) : String(rating);
};

/**
 * 스탯 포맷팅 (0은 '-'로 표시)
 * @param value - 스탯 값
 * @returns 포맷된 스탯 문자열
 */
export const formatStat = (value: number | string | null | undefined): string => {
  if (value == null || value === 0 || value === '') {
    return '-';
  }
  return String(value);
};

/**
 * 분 단위 시간 포맷팅
 * @param minutes - 출전 시간 (분)
 * @returns 포맷된 시간 문자열
 */
export const formatMinutes = (minutes: number | null | undefined): string => {
  if (minutes == null || minutes === 0) {
    return '-';
  }
  return `${minutes}'`;
};

/**
 * 선수 데이터 유효성 검증
 * @param player - 검증할 선수 데이터
 * @returns 유효한 데이터인지 여부
 */
export const validatePlayer = (player: any): player is Player => {
  // 필수 필드 검증
  if (!player) {
    console.warn('⚠️ null 또는 undefined 선수 데이터');
    return false;
  }

  const missingFields: string[] = [];

  if (!player.player_name_kr || player.player_name_kr.trim() === '') {
    missingFields.push('player_name_kr');
  }
  if (!player.player_id) {
    missingFields.push('player_id');
  }
  if (!player.team || player.team.trim() === '') {
    missingFields.push('team');
  }
  if (!player.league || player.league.trim() === '') {
    missingFields.push('league');
  }

  if (missingFields.length > 0) {
    console.warn('⚠️ 필수 필드 누락:', missingFields, player);
    return false;
  }

  return true;
};
