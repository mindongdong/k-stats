export interface PlayerProfile {
  // Metadata
  collection_date: string
  collection_week: string
  player_id: string
  player_name: string
  player_name_kr: string
  birth_date: string
  age: number
  nationality: string
  height: string
  preferred_foot: string
  shirt_number: string
  position: string
  team: string
  team_id: string
  league: string
  league_id: string
  season: string
  market_value: string
  contract_end: string
  is_injured: string
  injury_status: string
  fotmob_url: string

  // Match Statistics
  matches: number
  matches_per90: number
  matches_percentile: number
  started: number
  started_per90: number
  started_percentile: number
  minutes_played: number
  minutes_played_per90: number
  minutes_played_percentile: number
  goals: number
  goals_per90: number
  goals_percentile: number
  assists: number
  assists_per90: number
  assists_percentile: number
  rating: number
  rating_per90: number
  rating_percentile: number

  // Attack Statistics
  attack_goals: number
  attack_expected_goals: number
  attack_xg_difference: number
  attack_non_penalty_xg: number
  attack_shots: number
  attack_shots_on_target: number
  attack_shooting_accuracy: number
  attack_conversion_rate: number
  attack_big_chances_missed: number
  attack_dribbles_succeeded: number
  attack_dribble_success_rate: number
  attack_touches_in_box: number

  // Passing Statistics
  passing_assists: number
  passing_expected_assists: number
  passing_xa_difference: number
  passing_key_passes: number
  passing_chances_created: number
  passing_successful_passes: number
  passing_pass_accuracy: number
  passing_long_balls_accurate: number
  passing_long_ball_accuracy: number
  passing_crosses_accurate: number
  passing_cross_accuracy: number

  // Possession Statistics
  possession_touches: number
  possession_touches_in_box: number
  possession_dispossessed: number
  possession_fouls_won: number
  possession_penalty_won: number

  // Defense Statistics
  defense_tackles: number
  defense_tackles_successful: number
  defense_tackle_success_rate: number
  defense_interceptions: number
  defense_clearances: number
  defense_blocked_shots: number
  defense_duels_won: number
  defense_duel_success_rate: number
  defense_ground_duels_won: number
  defense_ground_duel_success_rate: number
  defense_aerials_won: number
  defense_aerial_success_rate: number
  defense_recoveries: number
  defense_dribbled_past: number
  defense_fouls_committed: number

  // Discipline Statistics
  discipline_yellow_cards: number
  discipline_red_cards: number
  discipline_fouls_committed: number
  discipline_fouls_won: number

  // Shot Analysis
  shot_total_shots: number
  shot_goals: number
  shot_on_target: number
  shot_blocked: number
  shot_off_target: number
  shot_left_foot: number
  shot_right_foot: number
  shot_headed: number
  shot_open_play: number
  shot_free_kick: number
  shot_penalty: number
  shot_total_xg: number
  shot_preferred_foot_ratio: number
  shot_quality: number
}

export interface AttackStats {
  goals: number
  xG: number
  xgDifference: number
  nonPenaltyXG: number
  shots: number
  shotsOnTarget: number
  shootingAccuracy: number
  conversionRate: number
  bigChancesMissed: number
  dribblesSucceeded: number
  dribbleSuccessRate: number
  touchesInBox: number
}

export interface PassingStats {
  assists: number
  xA: number
  xaDifference: number
  keyPasses: number
  chancesCreated: number
  successfulPasses: number
  passAccuracy: number
  longBallsAccurate: number
  longBallAccuracy: number
  crossesAccurate: number
  crossAccuracy: number
}

export interface DefenseStats {
  tackles: number
  tacklesSuccessful: number
  tackleSuccessRate: number
  interceptions: number
  clearances: number
  blockedShots: number
  duelsWon: number
  duelSuccessRate: number
  groundDuelsWon: number
  groundDuelSuccessRate: number
  aerialsWon: number
  aerialSuccessRate: number
  recoveries: number
  ribbledPast: number
  foulsCommitted: number
}

export interface DisciplineStats {
  yellowCards: number
  redCards: number
  foulsCommitted: number
  foulsWon: number
}

export interface ShotAnalysis {
  totalShots: number
  goals: number
  onTarget: number
  blocked: number
  offTarget: number
  leftFoot: number
  rightFoot: number
  headed: number
  openPlay: number
  freeKick: number
  penalty: number
  totalXG: number
  preferredFootRatio: number
  shotQuality: number
}
