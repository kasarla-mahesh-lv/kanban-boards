import axios from "axios";
import type { Notification } from "./types";

const BASE = "/api/notifications";

export const getNotifications = async (userId: number) => {
  const res = await axios.get<Notification[]>(`${BASE}?userId=${userId}`);
  return res.data;
};

export const getUnreadCount = async (userId: number) => {
  const res = await axios.get<number>(`${BASE}/count?userId=${userId}`);
  return res.data;
};

export const markRead = async (id: number) => {
  await axios.put(`${BASE}/${id}/read`);
};
