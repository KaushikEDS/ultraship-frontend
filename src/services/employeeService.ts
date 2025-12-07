import { Employee } from "../types/Employee";

const API_URL = "https://jsonplaceholder.typicode.com/users";

interface JsonPlaceholderUser {
  id: number;
  name: string;
  username: string;
  email: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
  };
  phone: string;
  website: string;
  company: {
    name: string;
  };
}

// Map jsonplaceholder user data to Employee interface
const mapToEmployee = (user: JsonPlaceholderUser): Employee => {
  // Generate age based on ID (for demo purposes)
  const age = 20 + (user.id % 30);
  
  // Generate class based on ID
  const classes = ["A", "B", "C", "D", "E"];
  const classValue = classes[user.id % classes.length];
  
  // Generate subjects based on user data
  const allSubjects = ["Math", "Science", "English", "History", "Geography", "Art", "Music", "PE"];
  const subjectCount = 3 + (user.id % 4); // 3-6 subjects
  const subjects = allSubjects.slice(0, subjectCount);
  
  // Generate some attendance records
  const attendance: Record<string, boolean> = {};
  const today = new Date();
  for (let i = 0; i < 10; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    attendance[dateStr] = Math.random() > 0.2; // 80% attendance rate
  }
  
  // Use current date for createdAt/updatedAt
  const now = new Date().toISOString();
  
  return {
    id: user.id,
    name: user.name,
    age,
    class: classValue,
    subjects,
    attendance,
    createdAt: now,
    updatedAt: now,
  };
};

export const fetchEmployees = async (): Promise<Employee[]> => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: JsonPlaceholderUser[] = await response.json();
    return data.map(mapToEmployee);
  } catch (error) {
    console.error("Error fetching employees:", error);
    throw error;
  }
};

