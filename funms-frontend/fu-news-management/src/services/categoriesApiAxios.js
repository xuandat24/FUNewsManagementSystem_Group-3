import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_CATEGORIES_API_URL ||
  "http://localhost:8080/api/v1/categories";

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

export async function getCategoryById(id) {
  try {
    const res = await axios.get(`${BASE_URL}/${id}`, {
      headers: getAuthHeaders(),
    });
    return res.data;
  } catch (err) {
    handleAxiosError(err, `Lỗi khi lấy danh mục với id ${id}`);
  }
}

export async function getCategories(
  page = 0,
  size = 5,
  keyword = "",
  isActive = "",
) {
  try {
    const res = await axios.get(BASE_URL, {
      headers: getAuthHeaders(),
      params: {
        page,
        size,
        keyword: keyword?.trim() || undefined,
        isActive: isActive !== "" ? isActive : undefined,
      },
    });
    return res.data;
  } catch (err) {
    handleAxiosError(err, "Lỗi khi tải danh mục");
  }
}

export async function searchAllActive(keyword = "", page = 0, size = 5) {
  try {
    const res = await axios.get(`${BASE_URL}/active`, {
      headers: getAuthHeaders(),
      params: {
        keyword: keyword?.trim() || undefined,
        page,
        size,
      },
    });
    return res.data;
  } catch (err) {
    handleAxiosError(err, "Lỗi khi tải danh mục active");
  }
}

export async function getAllCategoryActiveDropdown() {
  try {
    const res = await axios.get(`${BASE_URL}/all`, {
      headers: getAuthHeaders(),
    });
    return res.data;
  } catch (err) {
    handleAxiosError(err, "Lỗi khi lấy danh mục");
  }
}

export async function createCategory(data) {
  try {
    const res = await axios.post(BASE_URL, data, {
      headers: getAuthHeaders(),
    });
    return res.data;
  } catch (err) {
    handleAxiosError(err, "Lỗi khi tạo danh mục");
  }
}

export async function updateCategory(id, data) {
  try {
    const res = await axios.put(`${BASE_URL}/${id}`, data, {
      headers: getAuthHeaders(),
    });
    return res.data;
  } catch (err) {
    handleAxiosError(err, "Lỗi khi cập nhật danh mục");
  }
}

export async function deleteCategory(id) {
  try {
    const res = await axios.delete(`${BASE_URL}/${id}`, {
      headers: getAuthHeaders(),
    });
    return res.data;
  } catch (err) {
    handleAxiosError(err, "Lỗi khi xóa danh mục");
  }
}
