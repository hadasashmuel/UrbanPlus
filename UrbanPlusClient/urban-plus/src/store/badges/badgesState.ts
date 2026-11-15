
export interface Badge {
  badgeId: number;
  badgeName: string;
  description: string;
  iconUrl: string;
}

export interface BadgesState {
  badges: Badge[];
  loading: boolean;
  error: string | null;
}

export const initialState: BadgesState = {
  badges: [],
  loading: false,
  error: null,
};
