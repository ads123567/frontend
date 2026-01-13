const API_URL = "http://localhost:8080";

export async function checkPincode(pincode) {
    return fetchWithAuth(`/stores/by-pincode/${pincode}`);
}

export async function checkLocation(lat, long) {
    return fetchWithAuth(`/stores/check-location?lat=${lat}&long=${long}`);
}

export async function getProducts(storeId, categoryId, search) {
    const params = new URLSearchParams();
    if (storeId) params.append("store_id", storeId);
    if (categoryId) params.append("category_id", categoryId);
    if (search) params.append("search", search);

    return fetchWithAuth(`/products/?${params.toString()}`);
}

// Helper for fetch with credentials
async function fetchWithAuth(url, options = {}) {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user?.token;

    const defaultOptions = {
        credentials: "include", // Keep cookies as fallback or for other needs
    };

    const headers = {
        "Content-Type": "application/json",
        ...options.headers,
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${url}`, {
        ...defaultOptions,
        ...options,
        headers,
    });
    if (response.status === 401) {
        // Could handle global redirect here or throw specific error
        throw new Error("Unauthorized");
    }
    if (!response.ok) {
        throw new Error("Request failed");
    }
    return response.json();
}

export async function login(email, password) {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
        throw new Error("Login failed");
    }
    return response.json();
}

export async function logout() {
    const response = await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
    });
    if (!response.ok) throw new Error("Logout failed");
    return response.json();
}

export async function getProfile() {
    return fetchWithAuth("/auth/profile");
}
// Cart APIs
export async function getCart() {
    return fetchWithAuth("/cart/");
}

export async function addToCartApi(productId, quantity) {
    return fetchWithAuth("/cart/items", {
        method: "POST",
        body: JSON.stringify({ product_id: productId, quantity }),
    });
}

export async function updateCartItemApi(productId, quantity) {
    return fetchWithAuth(`/cart/items/${productId}`, {
        method: "PUT",
        body: JSON.stringify({ quantity }),
    });
}

export async function removeFromCartApi(productId) {
    return fetchWithAuth(`/cart/items/${productId}`, {
        method: "DELETE",
    });
}

export async function syncCartApi(items) {
    return fetchWithAuth("/cart/sync", {
        method: "POST",
        body: JSON.stringify(items.map(item => ({ product_id: item.id, quantity: item.quantity }))),
    });
}

export async function clearCartApi() {
    return fetchWithAuth("/cart/", {
        method: "DELETE",
    });
}

export async function getAddresses() {
    return fetchWithAuth("/users/me/addresses");
}

export async function addAddress(addressData) {
    return fetchWithAuth("/users/me/addresses", {
        method: "POST",
        body: JSON.stringify(addressData),
    });
}

export async function getOrders() {
    return fetchWithAuth("/users/me/orders");
}

export async function placeOrderApi(orderData) {
    return fetchWithAuth("/cart/place-order", {
        method: "POST",
        body: JSON.stringify(orderData),
    });
}

export async function getOrderDetailsApi(orderId) {
    return fetchWithAuth(`/users/me/orders/${orderId}`);
}

export async function cancelOrderApi(orderId) {
    return fetchWithAuth(`/users/me/orders/${orderId}/cancel`, {
        method: "POST",
    });
}

export async function getPincodes() {
    return fetchWithAuth("/stores/pincodes");
}

export async function createUser(userData) {
    return fetchWithAuth("/admin/create-user", {
        method: "POST",
        body: JSON.stringify(userData),
    });
}

export async function resetPasswordAdmin(data) {
    return fetchWithAuth("/admin/reset-password", {
        method: "POST",
        body: JSON.stringify(data),
    });
}

export async function changePasswordUser(data) {
    return fetchWithAuth("/auth/change-password", {
        method: "POST",
        body: JSON.stringify(data),
    });
}
