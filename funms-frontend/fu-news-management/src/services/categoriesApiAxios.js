import httpClient from "./httpClient";

const BASE = "/categories";

export async function getCategoryById(id) {
  const res = await httpClient.get(`${BASE}/${id}`);
  return res.data;
}

export async function getCategories(
  page = 0,
  size = 5,
  keyword = "",
  isActive = "",
) {
  const res = await httpClient.get(`${BASE}`, {
    params: {
      page,
      size,
      keyword: keyword?.trim() || undefined,
      isActive: isActive !== "" ? isActive : undefined,
    },
  });
  return res.data;
}

export async function searchAllActive(keyword = "", page = 0, size = 5) {
  const res = await httpClient.get(`${BASE}/active`, {
    params: {
      keyword: keyword?.trim() || undefined,
      page,
      size,
    },
  });
  return res.data;
}

export async function getAllCategoryActiveDropdown() {
  const res = await httpClient.get(`${BASE}/all`);
  return res.data;
}

export async function createCategory(data) {
  const res = await httpClient.post(`${BASE}`, data);
  return res.data;
}

export async function updateCategory(id, data) {
  const res = await httpClient.put(`${BASE}/${id}`, data);
  return res.data;
}

export async function deleteCategory(id) {
  const res = await httpClient.delete(`${BASE}/${id}`);
  return res.data;
}
