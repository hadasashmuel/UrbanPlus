
export interface ReportImage {
  reportImageId: number;
  reportId: number;
  imageUrl: string;
}

export interface Report {
  reportId: number;
  userId: number;
  mainEventId: number | null;
  categoryId: number;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  inputAddress: string;
  createdAt: string;
  imageList: ReportImage[] | null;
  categoryName: string;
}

export interface ReportsState {
  myReports: Report[];
  loading: boolean;
  error: string | null;
}

export const initialState: ReportsState = {
  myReports: [],
  loading: false,
  error: null,
};
