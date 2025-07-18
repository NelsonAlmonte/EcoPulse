export interface CreateIssueDto {
  photo: string;
  status: string;
  latitude: string;
  longitude: string;
  comment?: string;
  category: string;
  user: string;
}
