import { baseUrl, dashboard, getToken } from "./main.js";

document.addEventListener("DOMContentLoaded",  async () => {
    
    const token =  getToken();
    const loaderContainer = document.querySelector(".container-loader");
    const settingsForm = document.getElementById("settingsForm");
    
    settingsForm.addEventListener("submit", async (event)=>{
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);
        const userData = JSON.parse(sessionStorage.getItem("user"));
        const password = formData.get("password");
        const pin = formData.get("newPin");
        const confirmPin = formData.get("confirmPin");
        
        try{
            loaderContainer.style.display = "flex";
            settingsForm.style.display = "none";
       
        if(pin == confirmPin){
            let data = {
                "userId": userData.id,
                "password": formData.get("password"),
                "pinPassword":pin,
            }
            const response = await fetch(`${baseUrl}/editRecoveryPassword`,{
                "method":"POST",
                "mode":"cors",
                "headers":{
                  "Content-Type":"application/json",
                  "Authorization":`Bearer ${token}`
                },
                body: JSON.stringify(data)
              });
              if(response.ok){
                const result = await response.json();
                alert(result.message);
                 location.reload();
              }
        }
        else{
            alert("Pin does not matched with confirm pin. Please try again.");
        }

            setTimeout(()=>{
                loaderContainer.style.display = "none";
                settingsForm.style.display = "block";
             }, 3000)
         }catch(e){
            alert(`An error occurred: ${e}`);
         }
         
    });
});

