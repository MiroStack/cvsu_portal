export const baseUrl = "https://cvsunaicapi-production.up.railway.app/cvsu";

// export const baseUrl = "http://localhost:8080/cvsu";
export const dashboard = () =>{
    window.location.href = "./dashboard-ppss.html"
}

export const hrDashboard = () =>{
    window.location.href = "/hr-login/dashboard-hr.html"
}

let token;  // Module-scoped variable (not exported)

export const getToken = () => {

    const token = sessionStorage.getItem("authToken")
    return token; // Retrieve from session storage
    
}

export const setToken =(newToken)=> {
    token = newToken;
    sessionStorage.setItem("authToken", newToken);
}