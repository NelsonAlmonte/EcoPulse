export interface CreateIssueDto {
  photo: string;
  status: string;
  latitude: number;
  longitude: number;
  comment?: string;
  category: string;
  user: string;
}
