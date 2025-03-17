import { baseUrl, dashboard, getToken } from "./main.js";

document.addEventListener("DOMContentLoaded", ()=>{
  const token = getToken();
  const loaderContainer = document.querySelector(".container-loader");
  const addBuildingForm = document.getElementById("addBuildingForm");
  try{
    if (!token) { // This checks for null, undefined, or empty string
      window.location.href = "./index.html";
    }
    let floorList = ["Ground Floor", "Second Floor", " Third Floor"];
    console.log("addBuilding.js is loaded");


    // Function to add a room input
    function addRoomInput(room = { name: "", floor: "Ground Floor" }) {
      const roomsList = document.getElementById("roomsList")
      const roomDiv = document.createElement("div")
      roomDiv.classList.add("room-item")
      roomDiv.innerHTML = `
              <input type="hidden" class="building-id" >
              <input type="hidden" class="floor-id" >  
              <input type="hidden" class="room-id" >   
              <input type="text" class="room-input"  placeholder="Room name">
              <select class="floor-select">
                  <option value="Ground Floor" ${room.floor === "Ground Floor" ? "selected" : ""}>Ground Floor</option>
                  <option value="Second Floor" ${room.floor === "Second Floor" ? "selected" : ""}>Second Floor</option>
                  <option value="Third Floor" ${room.floor === "Third Floor" ? "selected" : ""}>Third Floor</option>
              </select>
              <ion-icon name="close-circle" class="delete-room-icon"></ion-icon>`
      roomsList.appendChild(roomDiv)
    }
    

    
    // Add room input dynamically when the "Add Room" button is clicked
    document.getElementById("addRoomBtn").addEventListener("click", () => addRoomInput())
    
    // Handle room deletion
    document.getElementById("roomsList").addEventListener("click", (event) => {
      if (event.target && event.target.classList.contains("delete-room-icon")) {
        event.target.closest(".room-item").remove()
      }
    })
    
    // Handle form submission
    document.getElementById("addBuildingForm").addEventListener("submit", (e) => {
      e.preventDefault()
    
      const building_name = document.getElementById("buildingName").value
      const buildingDescription = document.getElementById("buildingDescription").value
      let newBldgInformation = {
        buildingName: building_name,
        buildingDetails: buildingDescription,
        roomsInfo: []
      };



      let prevousId = 0;
      const rooms = Array.from(document.querySelectorAll(".room-item")).map((item, index) => {
        const name = item.querySelector(".room-input").value;
        const floor = item.querySelector(".floor-select").value;
        
        // Ensure room_id is valid
        const roomIdElement = item.querySelector(".room-id");
        const room_id = roomIdElement ? roomIdElement.value.trim() : null;
        
        if (!name.trim()) {
            console.warn("Skipping empty room name");
       }
       else{
        newBldgInformation.roomsInfo.push({
            roomName: name,
            floorId: floorList.indexOf(floor) + 1,
        });
       }
    
      
    
        return floor === "No Floor" ? { name } : { name, floor };
    }).filter((room) => room.name.trim() !== "");
        console.log("Sample Building Data:", newBldgInformation);
      
        const cleanData = JSON.parse(JSON.stringify(newBldgInformation));  
      saveBldgInfo(cleanData);
      

    })
    
   
    const saveBldgInfo = async (newBldgInfo)=> {
      try{
        loaderContainer.style.display = "flex";
        addBuildingForm.style.display = "none"
        const response = await fetch(`${baseUrl}/addBuildingAndRooms`,{
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
           },
           mode: "cors", // Enable CORS
          body: JSON.stringify(newBldgInfo)
        });
    
        if(response.ok){
          const result = await response.json();
          alert(result.message);
          loaderContainer.style.display = "none";
          addBuildingForm.style.display = "block"
          dashboard();
          
        }
        else{
          const errorData = await response.json();
          alert(errorData.message);
        }
      }catch(e){
        alert("Error occured: " + e.message);
    }
  }
    
    
  }catch(e){
    alert("Error occured: " + e.message);
  }
  
});