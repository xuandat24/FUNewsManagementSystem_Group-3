import httpClient from "./httpClient";

const BASE = "/admin/accounts";

export async function getAccounts(
  page = 0,
  size = 10,
  keyword = "",
  role = "",
) {
    const res = await httpClient.get(BASE, {
      params: {
        page,
        size,
        keyword: keyword?.trim() || undefined,
        role: role !== "" ? role : undefined,
      },
    });
    return res.data;
}

export async function getAccountById(id) {
    const res = await httpClient.get(`${BASE}/${id}`);
    return res.data;
}

export async function createAccount(data) {
    const res = await httpClient.post(BASE, data);
    return res.data;
}

export async function updateAccount(id, data) {
    const res = await httpClient.put(`${BASE}/${id}`, data);
    return res.data;
}

export async function deleteAccount(id) {
    const res = await httpClient.delete(`${BASE}/${id}`);
    return res.data;
}
