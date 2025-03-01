export const baseUrl = "https://cvsunaicapi-production.up.railway.app/cvsu";


export const dashboard = () =>{
    window.location.href = "./dashboard-ppss.html"
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