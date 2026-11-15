
export interface MainEvent {
  mainEventsId: number;
  categoryId: number;
  title: string;
  status: number | string;
  latitude: number;
  longitude: number;
  address: string;
  severity: number | string;
  estimatedResolutionMinutes: number;
  createdAt: string;
  startedAt: string | null;
  resolvedAt: string | null;
  actualResolutionMinutes: number | null;
  categoryName: string;
  countVotes: number;
  countSavedEvents: number;
  countReports: number;
  messages: unknown[];
}

export interface SavedEvent {
  savedEventId: number;
  userId: number;
  mainEventId: number;
  createdAt: string;
}

export interface Vote {
  voteId: number;
  userId: number;
  mainEventId: number;
  typeVote: number;
  createdAt: string;
}

export interface EventsState {
  mainEvents: MainEvent[];

  savedEvents: SavedEvent[];
  votes: Vote[];

  loadingMainEvents: boolean;
  loadingSavedEvents: boolean;
  loadingMyVotes: boolean;

  savingEvent: boolean;
  deletingSavedEvent: boolean;

  creatingVote: boolean;
  deletingVote: boolean;

  // ניהול אירועים – מנהל
  deletingMainEvent: boolean;

  error: string | null;
}

export const initialState: EventsState = {
  mainEvents: [],

  savedEvents: [],
  votes: [],

  loadingMainEvents: false,
  loadingSavedEvents: false,
  loadingMyVotes: false,

  savingEvent: false,
  deletingSavedEvent: false,

  creatingVote: false,
  deletingVote: false,

  // ניהול אירועים – מנהל
  deletingMainEvent: false,

  error: null,
};
