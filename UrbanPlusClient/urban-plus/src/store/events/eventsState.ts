
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
  imageUrls: string[];
  messages: Message[];
}

export interface Message {
  messageId: number;
  mainEventId: number;
  userId: number;
  content: string;
  createdAt: string;
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
  eventMessages: Message[];

  loadingMainEvents: boolean;
  loadingSavedEvents: boolean;
  loadingMyVotes: boolean;
  loadingEventMessages: boolean;

  savingEvent: boolean;
  deletingSavedEvent: boolean;

  creatingVote: boolean;
  deletingVote: boolean;

  deletingMainEvent: boolean;
  updatingMainEvent: boolean;

  error: string | null;
}

export const initialState: EventsState = {
  mainEvents: [],
  savedEvents: [],
  votes: [],
  eventMessages: [],

  loadingMainEvents: false,
  loadingSavedEvents: false,
  loadingMyVotes: false,
  loadingEventMessages: false,

  savingEvent: false,
  deletingSavedEvent: false,

  creatingVote: false,
  deletingVote: false,

  deletingMainEvent: false,
  updatingMainEvent: false,

  error: null,
};
