export interface Payment {
  id: string;
  amount: number;
  status: "pending" | "completed" | "overdue";
  description: string;
  category: string;
}