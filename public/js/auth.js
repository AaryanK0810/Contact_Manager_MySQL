async function authenticatedFetch(url, options = {}) {
const token = localStorage.getItem("token");
if (!token) {
    window.location.href = "login.html";
    throw new Error("No authentication token found");
}

const response = await fetch(url, {
    ...options,
    headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`
    }
});

if (response.status === 401) {
    localStorage.removeItem("token");
    window.location.href = "login.html";
    throw new Error("Session expired. Please log in again.");
}

return response;

}