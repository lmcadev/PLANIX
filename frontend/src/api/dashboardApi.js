import { httpClient } from "./httpClient";

export const dashboardApi = {
  getKpis: () => httpClient.get("/dashboard/kpis/"),
};
