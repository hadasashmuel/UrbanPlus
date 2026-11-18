
export interface ProviderWorkType {
  providerWorkTypesId: number;
  providerId: number;
  providerName: string;
  workTypeId: number;
  nameWorkTypes: string;
}

export interface CreateProviderWorkTypeDTO {
  providerId: number;
  workTypeId: number;
}

export interface ProviderWorkTypesState {
  providerWorkTypes: ProviderWorkType[];
  loading: boolean;
  error: string | null;
}

export const initialState: ProviderWorkTypesState = {
  providerWorkTypes: [],
  loading: false,
  error: null,
};
