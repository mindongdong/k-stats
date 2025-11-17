import Papa from 'papaparse';
import type { Player } from '../types';

/**
 * CSV 파일을 로드하고 파싱하는 함수
 * @param filePath - CSV 파일 경로
 * @returns 파싱된 선수 데이터 배열
 */
export const loadPlayerData = async (filePath: string): Promise<Player[]> => {
  try {
    const response = await fetch(filePath);
    const csvText = await response.text();

    return new Promise((resolve, reject) => {
      Papa.parse<Player>(csvText, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        transformHeader: (header: string) => header.trim(),
        transform: (value: string) => {
          // 빈 문자열을 null로 변환하여 일관성 유지
          return value === '' ? null : value;
        },
        complete: (results) => {
          console.log('✅ CSV 파싱 완료');
          console.log('📊 전체 행 수:', results.data.length);
          console.log('❌ 오류 수:', results.errors.length);

          if (results.errors.length > 0) {
            console.error('⚠️ CSV 파싱 오류 상세:', results.errors);
            // 오류가 있어도 파싱된 데이터는 반환 (부분 성공)
          }

          if (results.data.length === 0) {
            console.warn('⚠️ 경고: 파싱된 데이터가 없습니다!');
          } else {
            console.log('📋 첫 3명 샘플 데이터:', results.data.slice(0, 3));
          }

          resolve(results.data);
        },
        error: (error: Error) => {
          console.error('❌ CSV 파싱 실패:', error);
          reject(error);
        }
      });
    });
  } catch (error) {
    console.error('CSV 로딩 실패:', error);
    throw error;
  }
};

/**
 * 고유한 리그 목록 추출
 * @param players - 선수 데이터 배열
 * @returns 중복 제거된 리그 목록
 */
export const getUniqueLeagues = (players: Player[]): string[] => {
  const leagues = players
    .map(player => player.league)
    .filter((league): league is string => !!league && league.trim() !== '');
  return [...new Set(leagues)].sort();
};

/**
 * 고유한 포지션 목록 추출
 * @param players - 선수 데이터 배열
 * @returns 중복 제거된 포지션 목록
 */
export const getUniquePositions = (players: Player[]): string[] => {
  const positions = players
    .map(player => player.position)
    .filter((position): position is string => !!position && position.trim() !== '');
  return [...new Set(positions)].sort();
};
