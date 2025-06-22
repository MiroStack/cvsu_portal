import { baseUrl, dashboard, getToken } from "./main.js";

const loaderContainer = document.querySelector(".container-loader");

const usersTable = document.querySelector(".users-table");
document.addEventListener("DOMContentLoaded", async () => {


    try{
        document.body.style.display = "none"; 
        if (!getToken()) { // This checks for null, undefined, or empty string
            window.location.href = "./index.html";
        }
        else{
            document.body.style.display = "block";
        }
       loaderContainer.style.display = "flex";
       usersTable.style.display = "none";

       const userData = JSON.parse(sessionStorage.getItem('user'));
       const id = userData.id; 

       const response = await fetch(`${baseUrl}/fetchUsers?id=${id}`,{
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${getToken()}`,
                   
                },
                 mode: "cors"
            });
            if(response.ok){
                 const data = await response.json();
                const users = data;
                const usersTableBody = document.querySelector("#usersTableBody");
          
                users.forEach((user) => {
                   const userTableRow = document.createElement("tr");
                   userTableRow.innerHTML = `
                       <td data-node="Id">${user.id}</td>
                       <td data-node="Fullname">${user.fullName}</td>
                       <td data-node="Rolename">${user.roleName}</td>
                       <td data-node="Position">${user.position}</td>
                       <td data-node="Actions">
                           <button class="update-user w-50 btn ${user.status == "active"?"btn-success":"btn-danger"}" data-user-id="${user.id}">${user.status}</button>
                       </td>
                    `;
                    usersTableBody.appendChild(userTableRow);
                     // Attach the event listener after adding the row
                    const updateButton = userTableRow.querySelector(".update-user");
                    updateButton.addEventListener("click", () => updateUserStatus(user.id));
                    loaderContainer.style.display = "none";
                    usersTable.style.display = "";
              
                });
            }
            else{
                const errorData = await response.json();
                alert(errorData.message);
            }

    }catch(e){   
        alert("Error occured: " + e.message);
    }   

 });

 const updateUserStatus = async (userId)=>{
        try{
            loaderContainer.style.display = "flex";
        usersTable.style.display = "none";
        console.log(userId);
        const status = "Active";
        const queryParams = new URLSearchParams({
            id: userId,
        });
        const response = await fetch(`${baseUrl}/updateStatus?${queryParams}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getToken()}`
            },
            mode: "cors"
        });
        if(response.ok){
            const result = await response.json();
            if(result.success){
                alert(result.message);
                
        }
        else{
            alert(result.message);
        }
        }
        else{
            const errorData = await response.json();
            alert(errorData.message);
        }
        window.location.reload();
        }catch(e){
            alert("Error occured: " + e.message);
        }       
   
}
