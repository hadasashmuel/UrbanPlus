export interface WorkType {
  workTypeId: number;
  categoryId: number;
  nameWorkTypes: string;
  description: string | null;
  categoryName: string;
}

export interface CreateWorkTypeDTO {
  categoryId: number;
  nameWorkTypes: string;
  description: string | null;
}

export interface UpdateWorkTypeDTO extends CreateWorkTypeDTO {
  workTypeId: number;
}

export interface WorkTypesState {
  workTypes: WorkType[];
  loading: boolean;
  error: string | null;
}

export const initialState: WorkTypesState = {
  workTypes: [],
  loading: false,
  error: null,
};