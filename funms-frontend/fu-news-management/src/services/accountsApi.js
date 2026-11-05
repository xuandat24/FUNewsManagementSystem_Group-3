import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_ACCOUNTS_API_URL ||
  "http://localhost:8080/api/v1/admin/accounts";

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

export async function getAccounts(
  page = 0,
  size = 10,
  keyword = "",
  role = "",
) {
  try {
    const res = await axios.get(BASE_URL, {
      headers: getAuthHeaders(),
      params: {
        page,
        size,
        keyword: keyword?.trim() || undefined,
        role: role !== "" ? role : undefined,
      },
    });
    return res.data;
  } catch (err) {
    handleAxiosError(err, "Lỗi khi tải danh sách tài khoản");
  }
}

export async function getAccountById(id) {
  try {
    const res = await axios.get(`${BASE_URL}/${id}`, {
      headers: getAuthHeaders(),
    });
    return res.data;
  } catch (err) {
    handleAxiosError(err, "Lỗi khi lấy thông tin tài khoản");
  }
}

export async function createAccount(data) {
  try {
    const res = await axios.post(BASE_URL, data, {
      headers: getAuthHeaders(),
    });
    return res.data;
  } catch (err) {
    handleAxiosError(err, "Lỗi khi tạo tài khoản");
  }
}

export async function updateAccount(id, data) {
  try {
    const res = await axios.put(`${BASE_URL}/${id}`, data, {
      headers: getAuthHeaders(),
    });
    return res.data;
  } catch (err) {
    handleAxiosError(err, "Lỗi khi cập nhật tài khoản");
  }
}

export async function deleteAccount(id) {
  try {
    const res = await axios.delete(`${BASE_URL}/${id}`, {
      headers: getAuthHeaders(),
    });
    return res.data;
  } catch (err) {
    handleAxiosError(err, "Lỗi khi xóa tài khoản");
  }
}
