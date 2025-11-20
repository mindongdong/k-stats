/**
 * Korean translations for football (soccer) terminology
 * Based on commonly used terms in Korean football media and fan communities
 */

// Position translations
const POSITION_TRANSLATIONS = {
  // Standard positions
  'striker': '스트라이커',
  'center back': '센터백',
  'attacking midfielder': '공격형 미드필더',
  'defensive midfielder': '수비형 미드필더',
  'central midfielder': '중앙 미드필더',
  'left back': '레프트백',
  'right back': '라이트백',
  'left winger': '왼쪽 윙어',
  'right winger': '오른쪽 윙어',

  // Lowercase variations (for data normalization)
  'forward': '포워드',
  'midfielder': '미드필더',
} as const;

// League translations
const LEAGUE_TRANSLATIONS = {
  // English leagues
  'premier league': '프리미어리그',
  'championship': '챔피언십',
  'premier league 2': '프리미어리그 2',

  // German leagues
  'bundesliga': '분데스리가',
  '2. bundesliga': '2. 분데스리가',

  // Spanish leagues
  'laliga2': '라리가2',

  // Portuguese leagues
  'liga portugal': '리가 포르투갈',
  'liga portugal 2': '리가 포르투갈 2',

  // French leagues
  'ligue 1': '리그 1',

  // Dutch leagues
  'eredivisie': '에레디비시',

  // Belgian leagues
  'belgian pro league': '벨기에 프로리그',

  // American leagues
  'major league soccer': '메이저 리그 사커',

  // Turkish leagues
  'super lig': '슈퍼리그',

  // Scottish leagues
  'premiership': '프리미어십',

  // Swiss leagues
  'super league': '스위스 슈퍼리그',

  // Danish leagues
  'superligaen': '슈퍼리가엔',

  // Serbian leagues
  'super liga': '슈퍼리가',

  // Polish leagues
  'ekstraklasa': '엑스트라클라사',
} as const;

// Team translations (major clubs only)
const TEAM_TRANSLATIONS = {
  // German clubs
  'bayern münchen': '바이에른 뮌헨',
  'union berlin': '우니온 베를린',
  'mainz 05': '마인츠',
  'borussia mönchengladbach': '보루시아 묀헨글라트바흐',
  'kaiserslautern': '카이저슬라우테른',

  // French clubs
  'paris saint-germain': '파리 생제르맹',
  'nantes': '낭트',

  // English clubs
  'newcastle united': '뉴캐슬 유나이티드',
  'newcastle united u21': '뉴캐슬 유나이티드 U21',
  'wolverhampton wanderers': '울버햄프턴 원더러스',
  'birmingham city': '버밍엄 시티',
  'stoke city': '스토크 시티',
  'swansea city': '스완지 시티',
  'portsmouth': '포츠머스',

  // Scottish clubs
  'celtic': '셀틱',

  // Dutch clubs
  'feyenoord': '페예노르트',
  'excelsior': '엑셀시오르',

  // Belgian clubs
  'genk': '헹크',

  // Portuguese clubs
  'arouca': '아로카',
  'portimonense': '포르티모넨스',

  // Spanish clubs
  'fc andorra': 'FC 안도라',

  // Turkish clubs
  'alanyaspor': '알란야스포르',

  // Austrian clubs
  'austria wien': '오스트리아 빈',

  // Swiss clubs
  'grasshopper': '그라스호퍼',

  // Danish clubs
  'fc midtjylland': 'FC 미트윌란',

  // Serbian clubs
  'fk crvena zvezda': 'FK 츠르베나 즈베즈다',

  // Polish clubs
  'górnik zabrze': '구르니크 자브제',

  // American clubs
  'los angeles fc': 'LA FC',
  'minnesota united': '미네소타 유나이티드',
  'st. louis city': '세인트루이스 시티',
} as const;

// Preferred foot translations
const PREFERRED_FOOT_TRANSLATIONS = {
  'left': '왼발',
  'right': '오른발',
  'both': '양발',
} as const;

/**
 * Translate position name to Korean
 * @param position - English position name
 * @returns Korean translation or original if no translation exists
 */
export function translatePosition(position: string | null): string {
  if (!position) return '';

  const normalized = position.toLowerCase();
  return POSITION_TRANSLATIONS[normalized as keyof typeof POSITION_TRANSLATIONS] || position;
}

/**
 * Translate league name to Korean
 * @param league - English league name
 * @returns Korean translation or original if no translation exists
 */
export function translateLeague(league: string | null): string {
  if (!league) return '';

  const normalized = league.toLowerCase();
  return LEAGUE_TRANSLATIONS[normalized as keyof typeof LEAGUE_TRANSLATIONS] || league;
}

/**
 * Translate team name to Korean
 * @param team - English team name
 * @returns Korean translation or original if no translation exists
 */
export function translateTeam(team: string | null): string {
  if (!team) return '';

  const normalized = team.toLowerCase();
  return TEAM_TRANSLATIONS[normalized as keyof typeof TEAM_TRANSLATIONS] || team;
}

/**
 * Get all unique positions in Korean
 * Used for generating filter options
 */
export function getTranslatedPositions(positions: string[]): string[] {
  return positions.map(translatePosition);
}

/**
 * Get all unique leagues in Korean
 * Used for generating filter options
 */
export function getTranslatedLeagues(leagues: string[]): string[] {
  return leagues.map(translateLeague);
}

/**
 * Translate preferred foot to Korean
 * @param foot - Preferred foot (Left, Right, Both)
 * @returns Korean translation or "-" if null/empty
 */
export function translatePreferredFoot(foot: string | null): string {
  if (!foot) return '-';

  const normalized = foot.toLowerCase();
  return PREFERRED_FOOT_TRANSLATIONS[normalized as keyof typeof PREFERRED_FOOT_TRANSLATIONS] || foot;
}
