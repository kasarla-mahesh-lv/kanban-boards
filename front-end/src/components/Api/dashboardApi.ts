import { apiGet } from "./ApiCommon";

export const getDashboardStats = () =>
  apiGet<any>("/dashboard/stats");
