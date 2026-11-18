export interface ReportAssignment {
  assignmentId: number;
  reportId: number;
  providerId: number;
  providerName: string;
  managerId: number;
  managerName: string;
  assignedAt: string;
  isCurrent: boolean;
}

export interface CreateReportAssignmentDTO {
  reportId: number;
  providerId: number;
}

export interface ReportAssignmentsState {
  assignments: ReportAssignment[];
  loading: boolean;
  error: string | null;
}

export const initialState: ReportAssignmentsState = {
  assignments: [],
  loading: false,
  error: null,
};