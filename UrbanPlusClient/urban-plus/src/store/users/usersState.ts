export interface ProfileUser {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  authProvider: number;
  profilePicture: string | null;
  scoreReliability: number;
  createdAt: string;
  userBadges: unknown[];
  votes: unknown[];
  savedEvents: unknown[];
}

export interface AuthResponseUser {
  token: string;
  expiresAt: string;
}

export interface UsersState {
  user: ProfileUser | null;
  token: string | null;
  expiresAt: string | null;
  loading: boolean;
  error: string | null;
}

export const initialState: UsersState = {
  user: null,
  token: null,
  expiresAt: null,
  loading: false,
  error: null,
};
