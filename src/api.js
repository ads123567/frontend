const API_URL = "http://localhost:8000";

export async function checkPincode(pincode) {
    const response = await fetch(`${API_URL}/stores/by-pincode/${pincode}`);
    if (!response.ok) {
        throw new Error("Service not available");
    }
    return response.json();
}

export async function checkLocation(lat, long) {
    const response = await fetch(`${API_URL}/check-location?lat=${lat}&long=${long}`);
    if (!response.ok) {
        throw new Error("Service not available");
    }
    return response.json();
}

export async function getProducts(storeId, categoryId, search) {
    const params = new URLSearchParams();
    if (storeId) params.append("store_id", storeId);
    if (categoryId) params.append("category_id", categoryId);
    if (search) params.append("search", search);

    const response = await fetch(`${API_URL}/products/?${params.toString()}`);
    if (!response.ok) {
        throw new Error("Failed to fetch products");
    }
    return response.json();
}

// Helper for fetch with credentials
async function fetchWithAuth(url, options = {}) {
    const defaultOptions = {
        credentials: "include", // Important for cookies
    };
    const response = await fetch(`${API_URL}${url}`, {
        ...defaultOptions,
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
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

export async function getPincodes() {
    const response = await fetch(`${API_URL}/stores/pincodes`);
    if (!response.ok) throw new Error("Failed to fetch pincodes");
    return response.json();
}
