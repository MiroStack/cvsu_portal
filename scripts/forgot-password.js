import { baseUrl} from "./main.js";

document.addEventListener("DOMContentLoaded", async () =>{
    const submitBtn = document.getElementById("submit_btn");
    const pin =  document.getElementById("pin");
    const newPassword = document.getElementById("newpassword");
    const confirmPassword = document.getElementById("confirmpassword");
    const containerLoader = document.querySelector(".container-loader");
    const formContainer = document.querySelector(".form-container");
    const recoveryForm = document.querySelector(".recovery-form");
    const searchForm = document.querySelector(".search-form");
    const empNo = document.getElementById("emp_id");
    const searchBtn = document.getElementById("search_btn");
    try{
       
       
        recoveryForm.style.display = "none";
        searchBtn.addEventListener("click", async() =>{
            containerLoader.style.display = "flex";
            formContainer.style.display = "none";
            const response = await fetch(`${baseUrl}/findMyAccount?employeeNo=${empNo.value}`,{
                method:"GET",
                mode:"cors",
                headers:{
                    "Content-Type":"application/json"
                }
            });
            if(response.ok){
                const data = await response.json();
                alert(data.message);
                if(data.success){
                    containerLoader.style.display = "none";
                    formContainer.style.display = "flex";
                    searchForm.style.display = "none";
                    recoveryForm.style.display = "";
                   
                    submitNewPassword();

                }
            }
        });
    }catch(e){

    }
    
const submitNewPassword = async ()=>{

    submitBtn.addEventListener("click", async() =>{

        if(newPassword.value == confirmPassword.value){
            containerLoader.style.display = "flex";
            formContainer.style.display = "none";
            const body = {
                "employeeNo": empNo.value,
                "pinPassword": pin.value,
                "newPassword": newPassword.value
            }
            const response = await fetch(`${baseUrl}/recoverPassword`,{
                method:"POST",
                mode:"cors",
                headers:{
                    "Content-Type":"application/json"
                },
                body: JSON.stringify(body)
            });
            if(response.ok){
                const data = await response.json();
                alert(data.message);
                
                if(data.success){
                    window.location.reload();
                }
            }
                containerLoader.style.display = "none";
                formContainer.style.display = "flex";
        }else{
            alert("Password does not match the confirm password");
        }
                
    });
}
});
