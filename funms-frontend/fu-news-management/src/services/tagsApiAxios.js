import httpClient from "./httpClient";

const BASE = "/tags";

export async function searchAllTags(keyword = "", page = 0, size = 5) {
    const res = await httpClient.get(`${BASE}`, {
      params: {
        page,
        size,
        keyword: keyword?.trim() || undefined,
      },
    });
    return res.data;
}

export async function getTagById(id) {
    const res = await httpClient.get(`${BASE}/${id}`);
    return res.data;
}

export async function getAllTagsDropdown() {
    const res = await httpClient.get(`${BASE}/all`);
    return res.data;
}

export async function createTag(data) {
    const res = await httpClient.post(`${BASE}`, data);
    return res.data;
}

export async function updateTag(id, data) {
    const res = await httpClient.put(`${BASE}/${id}`, data);
    return res.data;
}

export async function deleteTag(id) {
    const res = await httpClient.delete(`${BASE}/${id}`);
    return res.data;
}
