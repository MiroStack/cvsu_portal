import { baseUrl, dashboard, getToken, hrDashboard } from "./main.js";

document.addEventListener("DOMContentLoaded", function () {
    const loaderContainer = document.querySelector(".container-loader");
    const settingsForm = document.getElementById("settingsForm");
    const token = getToken();
    if (!token) { // This checks for null, undefined, or empty string
        window.location.href = "./index.html";
      }
    document.getElementById("settingsForm").addEventListener("submit", async (event) => {
        event.preventDefault(); // Prevent default form submission
    
        const form = event.target; // Correct reference to the form
        const userData = JSON.parse(sessionStorage.getItem('user')); // Get logged-in user data
        const formData = new FormData(form);
        
        
        const data = {
            currentPassword: formData.get("currentPassword"),
            newUsername: userData.username,
            newPassword: formData.get("password"),
            confirmPassword: formData.get("confirmPassword")
        };

        console.log(userData.id);

        if (data.newPassword !== data.confirmPassword) {
            alert("Passwords do not match.");
        } else if (data.newUsername.length < 5) {
            alert("Username must be at least 5 characters.");
        } else {
            console.log(data.currentPassword);
            const queryParams = new URLSearchParams({
                username: data.newUsername,
                currentPassword: data.currentPassword,
                password: data.newPassword,
                id: userData.id
            });

            try {
                loaderContainer.style.display = "flex";
                settingsForm.style.display = "none";
                const response = await fetch(`${baseUrl}/editAccount?${queryParams}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                       },
                       mode: "cors", // Enable CORS
                });

                if (response.ok) {
                    const result = await response.json();
                    alert(result.message);
                    form.reset();
                    
                    if(result.success){
                        loaderContainer.style.display = "none";
                        settingsForm.style.display = "block";
                        const removeToken = "";
                        const removeUser = "";
                        sessionStorage.setItem("authToken", removeToken);
                        sessionStorage.setItem("user", removeUser);
                        if(userData.position == "PPSS"){
                            window.location.replace("./ppss-login.html");
                        } // Redirect without history entry
                        else{
                            window.location.replace("./hr-login.html");
                        }
                       
                    }else{
                            if(userData.position == "PPSS"){
                                 dashboard();
                             } // Redirect without history entry
                             else{
                                hrDashboard();
                              }
                                              
                                      }
                    

                } else {
                    const errorData = await response.json();
                    alert(errorData.message);
                }
            } catch (e) {
                alert("Error updating account: " + e.message);
            }
        }
    });
});
