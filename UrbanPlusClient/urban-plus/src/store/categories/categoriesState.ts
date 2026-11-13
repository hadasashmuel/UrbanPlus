
export interface Category {
  categoryId: number;
  categoryName: string;
  categoryDescription: string;
}

export interface CategoriesState {
  categories: Category[];
  loading: boolean;
  error: string | null;
}

export const initialState: CategoriesState = {
  categories: [],
  loading: false,
  error: null,
};