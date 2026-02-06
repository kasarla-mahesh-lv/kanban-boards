export type HistoryType = "Task" | "Attendance" | "Project" | "System";
export type HistoryStatus = "Success" | "Pending" | "Updated" | "Deleted";

export type HistoryItem = {
  id: number | string;
  title: string;
  description?: string;
  type: HistoryType;
  status: HistoryStatus;
  user: string;
  time: string; // ISO string
};

const API_URL = import.meta.env.VITE_API_URL;

export async function getHistory(): Promise<HistoryItem[]> {
  const res = await fetch(`${API_URL}/api/history`, {
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) throw new Error(`API failed: ${res.status}`);
  return res.json();
}
