export interface Transaction {
  date: string;
  time: string;
  description: string;
  type: string;
  amount: number;
  status: "completed" | "failed" | "pending";
}

export interface Note {
  author: string;
  date: string;
  content: string;
}

export interface UserActivityProps {
  transactions: Transaction[];
  notes?: Note[];
}
