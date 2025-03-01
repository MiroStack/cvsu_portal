import { baseUrl, getToken, dashboard } from "../scripts/main.js";


document.addEventListener("DOMContentLoaded", ()=>  {
    const loaderContainer = document.querySelector(".container-loader");
    const addAccountForm = document.getElementById("add_account_form");
    const token = getToken();
    addAccountForm.addEventListener("submit", async (event) => {
        event.preventDefault(); // Prevent default form submission
    
        const form = event.target; // Correct reference to the form
        const userData = JSON.parse(sessionStorage.getItem('user')); // Get logged-in user data
        const formData = new FormData(form);
        
        const data = {
            firstname: formData.get("firstname"),
            middlename: formData.get("middlename"),
            lastname: formData.get("lastname"),
            username: formData.get("username"),
            password: formData.get("password"),
            confirmPassword: formData.get("confirm_password"),
            canCreateAccount: formData.get("allowCreateUser"),
        };

       if(data.password === data.confirmPassword){
        const queryParams = new URLSearchParams({
            firstname: data.firstname,
            middlename: data.middlename,
            lastname: data.lastname,
            username: data.username,
            password: data.password,
            canCreateAccount: data.canCreateAccount ?? false,
            createdById: userData.id
        });
        console.log(queryParams.canCreateAccount);

        try {
            loaderContainer.style.display = "flex";
            addAccountForm.style.display = "none";
            const response = await fetch(`${baseUrl}/addAccount?${queryParams}`, {
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
                loaderContainer.style.display = "none";
                addAccountForm.style.display = "block";
                dashboard();

            } else {
                const errorData = await response.json();
                alert(errorData.message);
            }
        } catch (e) {
            alert("Error occured: " + e.message);
        }
       }
       else{
              alert("Password does not match");
       }
    });
});
