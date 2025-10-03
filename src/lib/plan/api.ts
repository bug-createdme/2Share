import axios from "axios";

const API_BASE = "https://2share.icu/plans";

export async function createPlan(plan: any, token: string) {
  const res = await axios.post(`${API_BASE}/create-plan`, plan, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });
  return res.data;
}

export async function getPlans(token?: string) {
  const res = await axios.get(`${API_BASE}/get-plans`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  });
  return res.data;
}
