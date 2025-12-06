export interface Employee {
  id: number;
  name: string;
  age: number;
  class: string;
  subjects: string[];
  attendance: Record<string, boolean>;
  createdAt: string;
  updatedAt: string;
}
