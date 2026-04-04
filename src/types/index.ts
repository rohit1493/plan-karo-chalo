export type TripStatus = 'planning' | 'confirmed'
export type MemberRole = 'primary_planner' | 'secondary_planner' | 'contributor'
export type StageType = 'date' | 'location' | 'stay' | 'activity'
export type TreeState = 'seed' | 'sprout' | 'healthy' | 'wilting'

export interface Trip {
  id: string
  name: string
  created_by: string | null
  invite_code: string
  current_stage: number
  tree_health: number
  status: TripStatus
  created_at: string
  updated_at: string
  last_vote_at: string | null
}

export interface Member {
  id: string
  trip_id: string
  name: string
  session_id: string
  role: MemberRole
  joined_at: string
}

export interface Stage {
  id: string
  trip_id: string
  order: number
  type: StageType
  is_locked: boolean
  locked_option_id: string | null
  locked_at: string | null
  options?: OptionWithVotes[]
}

export interface Option {
  id: string
  stage_id: string
  title: string
  link: string | null
  notes: string | null
  added_by: string | null
  created_at: string
}

export interface Vote {
  id: string
  option_id: string
  member_id: string
  created_at: string
}

export interface OptionWithVotes extends Option {
  vote_count: number
  voters: { id: string; name: string }[]
}

export interface StageWithOptions extends Stage {
  options: OptionWithVotes[]
  locked_option?: Option | null
}

export interface TreeHealth {
  state: TreeState
  pct: number
  message: string
}
