import { Employee } from "../types/Employee";

const API_URL = "https://jsonplaceholder.typicode.com/users";

export const fetchEmployees = async (): Promise<Employee[]> => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: Employee[] = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching employees:", error);
    throw error;
  }
};

