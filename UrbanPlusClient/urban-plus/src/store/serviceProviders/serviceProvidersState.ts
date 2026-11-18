
export interface ServiceProvider {
  providerId: number;
  fullName: string;
  department: string | null;
  phone: string | null;
  email: string | null;
  isActive: boolean;
}

export interface ServiceProvidersState {
  // רשימת הספקים הרגילה
  serviceProviders: ServiceProvider[];
  loading: boolean;
  error: string | null;

  // ספקים המתאימים לאירוע
  eventServiceProviders: ServiceProvider[];
  loadingEventProviders: boolean;
  eventProvidersError: string | null;
}

export const initialState: ServiceProvidersState = {
  serviceProviders: [],
  loading: false,
  error: null,

  eventServiceProviders: [],
  loadingEventProviders: false,
  eventProvidersError: null,
};
