import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_TAGS_API_URL || "http://localhost:8080/api/v1/tags";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const handleAxiosError = (err, defaultMsg) => {
  const res = err.response;
  const data = res?.data;
  const serverMsg = data?.message || err?.message || defaultMsg;
  throw new Error(serverMsg);
};

export async function searchAllTags(keyword = "", page = 0, size = 5) {
  try {
    const res = await axios.get(BASE_URL, {
      headers: getAuthHeaders(),
      params: {
        page,
        size,
        keyword: keyword?.trim() || undefined,
      },
    });
    return res.data;
  } catch (err) {
    handleAxiosError(err, "Lỗi khi tải danh sách tags");
  }
}

export async function getTagById(id) {
  try {
    const res = await axios.get(`${BASE_URL}/${id}`, {
      headers: getAuthHeaders(),
    });
    return res.data;
  } catch (err) {
    handleAxiosError(err, "Lỗi khi lấy thông tin tag");
  }
}

export async function getAllTagsDropdown() {
  try {
    const res = await axios.get(`${BASE_URL}/all`, {
      headers: getAuthHeaders(),
    });
    return res.data;
  } catch (err) {
    handleAxiosError(err, "Lỗi khi tải tags cho dropdown");
  }
}

export async function createTag(data) {
  try {
    const res = await axios.post(BASE_URL, data, {
      headers: getAuthHeaders(),
    });
    return res.data;
  } catch (err) {
    handleAxiosError(err, "Lỗi khi tạo tag");
  }
}

export async function updateTag(id, data) {
  try {
    const res = await axios.put(`${BASE_URL}/${id}`, data, {
      headers: getAuthHeaders(),
    });
    return res.data;
  } catch (err) {
    handleAxiosError(err, "Lỗi khi cập nhật tag");
  }
}

export async function deleteTag(id) {
  try {
    const res = await axios.delete(`${BASE_URL}/${id}`, {
      headers: getAuthHeaders(),
    });
    return res.data;
  } catch (err) {
    handleAxiosError(err, "Lỗi khi xóa tag");
  }
}
