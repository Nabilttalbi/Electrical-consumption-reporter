export interface Tag {
  id: string;
  name: string;
  area: string;
}

export interface Reading {
  id: string;
  tagId: string;
  kwh: number;
  timestamp: string;
  submittedBy: string;
}
