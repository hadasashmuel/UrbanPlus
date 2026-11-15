
export interface UserBadge {
  badgeId: number;
  name: string;
  description: string;
  icon: string;
  createdAt: string;
}

export interface ProfileUser {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  authProvider: number;
  roleCode: number;
  profilePicture: string | null;
  scoreReliability: number;
  createdAt: string;
  userBadges: UserBadge[];
  votes: unknown[];
  savedEvents: unknown[];
}

// משתמש לצורך לוח המנהל
export interface AdminUser {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  profilePicture: string | null;
  roleCode: number;
  scoreReliability: number;
  createdAt: string;
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

  // ניהול משתמשים - מנהל
  adminUsers: AdminUser[];
  adminUsersLoading: boolean;
  adminUsersError: string | null;
}

export const initialState: UsersState = {
  user: null,
  token: null,
  expiresAt: null,
  loading: false,
  error: null,

  // ניהול משתמשים
  adminUsers: [],
  adminUsersLoading: false,
  adminUsersError: null,
};
