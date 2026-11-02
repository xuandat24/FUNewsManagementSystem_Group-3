const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const BASE_URL = import.meta.env.VITE_CATEGORIES_API_URL || 'http://localhost:8080/api/v1/categories';

export async function getCategoryById(id) {
    const res = await fetch(`${BASE_URL}/${id}`, {
        headers: getAuthHeaders(),
    });
    const resData = await res.json();
    if (!res.ok) throw new Error(resData.message || "Lỗi khi lấy danh mục với id " + id);
    return resData;
}

export async function getCategories(page = 0, size = 5, keyword = '', isActive = '') {
    const params = new URLSearchParams();
    params.set('page', page);
    params.set('size', size);
    if (keyword) params.set('keyword', keyword.trim());
    if (isActive !== '') params.set('isActive', isActive);

    const res = await fetch(`${BASE_URL}?${params.toString()}`, {
        headers: getAuthHeaders(),
    });
    const resData = await res.json();
    if (!res.ok) throw new Error(resData.message || 'Lỗi khi tải danh mục');
    return resData;
}

export async function searchAllActive(keyword = '', page = 0, size = 5) {
    const params = new URLSearchParams();
    params.set('page', page);
    params.set('size', size);

    if (keyword) params.set('keyword', keyword.trim());
    const res = await fetch(`${BASE_URL}/active?${params.toString()}`, {
        headers: getAuthHeaders(),
    });
    const resData = await res.json();
    if (!res.ok) throw new Error(resData.message || 'Lỗi khi tải danh mục');
    return resData;
}

export async function getAllCategoryActiveDropdown() {
    const res = await fetch(`${BASE_URL}/all`, {
        headers: getAuthHeaders(),
    });
    const resData = await res.json();
    if (!res.ok) throw new Error(resData.message || "Lỗi khi lấy danh mục");
    return resData;
}

export async function createCategory(data) {
    const res = await fetch(`${BASE_URL}`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
    });
    const resData = await res.json();
    if (!res.ok) throw new Error(resData.message || "Lỗi khi tạo danh mục");
    return resData;
}

export async function updateCategory(id, data) {
    const res = await fetch(`${BASE_URL}/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
    });
    const resData = await res.json();
    if (!res.ok) throw new Error(resData.message || "Lỗi khi cập nhật danh mục");
    return resData;
}

export async function deleteCategory(id) {
    const res = await fetch(`${BASE_URL}/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    });

    if (!res.ok) {
        const resData = await res.json();
        throw new Error(resData.message || "Lỗi khi xóa danh mục");
    }
}
