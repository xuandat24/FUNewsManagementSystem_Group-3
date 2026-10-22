const BASE_URL = import.meta.env.VITE_TAGS_API_URL|| 'http://localhost:8080/api/v1/tags';

export async function searchAllTags(keyword = '', page = 0, size = 5) {
    const params = new URLSearchParams();
    params.set('page', page);
    params.set('size', size);

    if (keyword && keyword.trim() !== '') {
        params.set('keyword', keyword.trim()); 
    }

    const res = await fetch(`${BASE_URL}?${params.toString()}`);
    const resData = await res.json();

    if(!res.ok) throw new Error(resData.message || "Lỗi khi tải tags");
    return resData;
}

export async function getTagById(id){
    const res = await fetch(`${BASE_URL}/${id}`)
    const resData = await res.json();

    if(!res.ok) throw new Error(resData.message || "Lỗi khi tải tags");
    return resData;
}

export async function getAllTagsDropdown(){
    const res = await fetch(`${BASE_URL}/all`)
    const resData = await res.json();

    if(!res.ok) throw new Error(resData.message || "Lỗi khi tải tags");
    return resData;
}

export async function createTag(data){
    const res = await fetch(`${BASE_URL}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    const resData = await res.json();
    if(!res.ok) throw new Error(resData.message || "Lỗi khi tạo tag");
    return resData;
}

export async function updateTag(id, data){
    const res = await fetch(`${BASE_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    const resData = await res.json();
    if(!res.ok) throw new Error(resData.message || "Lỗi khi cập nhật tag");
    return resData;
}

export async function deleteTag(id){
    const res = await fetch(`${BASE_URL}/${id}`, {
        method: 'DELETE'    
    });

    if(!res.ok){
        const resData = await res.json();
        throw new Error(resData.message || "Lỗi khi xóa tag");
    }
}