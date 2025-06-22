// export const baseUrl = "https://cvsunaicapi-production.up.railway.app/cvsu";
export const baseUrl = "https://cvsu.duckdns.org/cvsu";
// export const baseUrl = "http://localhost:8081/cvsu";
export const dashboard = () =>{
    window.location.href = "./dashboard-ppss.html"
}
export const addAccount = () =>{
    window.location.href = "./add_account.html"
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

export function exportJsonToExcel(data) {
  if (!Array.isArray(data) || data.length === 0) {
    alert("No data to export.");
    return;
  }

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  XLSX.writeFile(workbook, "feedback.xlsx");
}
