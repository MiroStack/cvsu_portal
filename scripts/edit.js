import { baseUrl, dashboard, getToken } from "./main.js";

 document.addEventListener("DOMContentLoaded", async () =>{
 
  let buildingInfo;
  const loadingContainer = document.querySelector(".container-loader");
  const editBuildingForm = document.getElementById("editBuildingForm");
  const token = getToken();
  console.log(token);
  try{
    document.body.style.display = "none"; 
    if (!token) { // This checks for null, undefined, or empty string
      window.location.href = "./index.html";
    }
    else{
      document.body.style.display ="block";
    }
    loadingContainer.style.display = "flex";
    editBuildingForm.style.display = "none";
    const response = await fetch(`${baseUrl}/displayAllBldgAndRooms`,{
      method: "GET",
      headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
      },
      mode: "cors", // Enable CORS
    });

    if(response.ok){
      const result = await response.json();
      buildingInfo = result;
      loadingContainer.style.display = "none";
      editBuildingForm.style.display = "flex";
    }
    else{
      alert('Failed to load the building information.'); 
    }  
    
    const selectBuildingList = document.getElementById("building-list");
    const buildingNameList = buildingInfo.map(building => ({
      buildingName: building.buildingName,
      buildingId: building.buildingId
   }));

      buildingNameList.forEach((building, index) => {
        let option = document.createElement("option");
        option.value = building.buildingName;
        option.textContent = building.buildingName;
        
        if (index === 0) {
            option.selected = true; // ✅ Select first option as default
        }

        selectBuildingList.appendChild(option);
    });

    let floorList = ["Ground Floor", "Second Floor", " Third Floor"];
    let sampleBuilding = {
      id: 0,
      name: "",
      description: "",
      rooms: [
        { name: "", floor: "", floor_id: 1, room_id: 0, building_id: 0 },
       
      ],
    }
    
    

    selectBuildingList.addEventListener("change", (event) => { 
      console.log(event.target.value);
      displayInfo(event.target.value);
    });   
    displayInfo(selectBuildingList.value);

    // Function to populate form with existing building data
    function populateBuildingData() {
      document.getElementById("buildingName").value = sampleBuilding.name
      document.getElementById("buildingDescription").value = sampleBuilding.description
    
      // Populate rooms list
      const roomsList = document.getElementById("roomsList")
      roomsList.innerHTML = "" // Clear existing rooms
      sampleBuilding.rooms.forEach((room) => {
        addRoomInput(room.floor ? room : { ...room, floor: "No Floor" })
      })
    }
    
    // Function to add a room input
    function addRoomInput(room = { name: "", floor: "Ground Floor" }) {
      const roomsList = document.getElementById("roomsList")
      const roomDiv = document.createElement("div")
      roomDiv.classList.add("room-item")
      roomDiv.innerHTML = `
              <input type="hidden" class="building-id" value="${sampleBuilding.id}">
              <input type="hidden" class="floor-id" value="${room.floor_id}">  
              <input type="hidden" class="room-id" value="${room.room_id }">   
              <input type="text" class="room-input" value="${room.name}" placeholder="Room name">
              <select class="floor-select">
                  <option value="Ground Floor" ${room.floor === "Ground Floor" ? "selected" : ""}>Ground Floor</option>
                  <option value="Second Floor" ${room.floor === "Second Floor" ? "selected" : ""}>Second Floor</option>
                  <option value="Third Floor" ${room.floor === "Third Floor" ? "selected" : ""}>Third Floor</option>
              </select>
              <ion-icon name="close-circle" class="delete-room-icon"></ion-icon>`
      roomsList.appendChild(roomDiv)
    }
    
    // Call the function to populate data on page load
    document.addEventListener("DOMContentLoaded", populateBuildingData)
    
    // Add room input dynamically when the "Add Room" button is clicked
    document.getElementById("addRoomBtn").addEventListener("click", () => addRoomInput())
    
    // Handle room deletion
    document.getElementById("roomsList").addEventListener("click", (event) => {
      if (event.target && event.target.classList.contains("delete-room-icon")) {
        event.target.closest(".room-item").remove()
      }
    })
    
    // Handle form submission
    document.getElementById("editBuildingForm").addEventListener("submit", (e) => {
      e.preventDefault()
    
      const building_name = document.getElementById("buildingName").value
      const buildingDescription = document.getElementById("buildingDescription").value
      let newBldgInformation = {
        buildingId: sampleBuilding.id,
        buildingName: building_name,
        buildingDetails: buildingDescription,
        roomsInfo: []
      };

      // sampleBuilding.rooms.forEach((room, index) => {
      //   newBldgInformation.roomsInfo.push({
      //     roomName: room.name,
      //     floorId: room.floorId,
      //     roomId: room.room_id,
      //     buildingId: room.building_id
      //   });
      // });

      let prevousId = 0;
      const rooms = Array.from(document.querySelectorAll(".room-item")).map((item, index) => {
        const name = item.querySelector(".room-input").value;
        const floor = item.querySelector(".floor-select").value;
        
        // Ensure room_id is valid
        const roomIdElement = item.querySelector(".room-id");
        const room_id = roomIdElement ? roomIdElement.value.trim() : null;
        
        // Ensure prevousId is numeric
        let validRoomId = room_id ? Number(room_id) : prevousId;
        prevousId = validRoomId + 1;
    
        console.log("Final room_id:", validRoomId);
    
        newBldgInformation.roomsInfo.push({
            roomName: name,
            floorId: floorList.indexOf(floor) + 1,
            roomId: validRoomId,
            buildingId:  sampleBuilding.id 
        });
    
        return floor === "No Floor" ? { name } : { name, floor };
    }).filter((room) => room.name.trim() !== "");
        console.log("Sample Building Data:", newBldgInformation);
      
        const cleanData = JSON.parse(JSON.stringify(newBldgInformation));  
      saveBldgInfo(cleanData);
      

    })
    
    // Handle building deletion
    // document.getElementById("deleteBuildingBtn").addEventListener("click", async () => {
    //   const confirmation = confirm("Are you sure you want to delete this building?")
    //   if (confirmation) {
    //     const id = sampleBuilding.id;
    //     try{
    //       loadingContainer.style.display = "flex";
    //       editBuildingForm.style.display = "none";
    //        const response = await fetch(`${baseUrl}/deleteBuilding?buildingId=${id}`,{
    //          method: "DELETE",
    //          headers: {
    //           "Content-Type": "application/json",
    //           "Authorization": `Bearer ${token}`
    //          },
    //          mode: "cors", // Enable CORS
    //        });
    //        const result = await response.json();
    //        loadingContainer.style.display = "none";
    //        editBuildingForm.style.display = "block";
    //        alert(result.message);
    //        dashboard();

    //     }catch(e){
    //       alert("Error occured: "+e.message)
    //     }
    //   }
    // })

    function displayInfo(selectedValue){
          buildingInfo.forEach((building, index)=>{
            if(selectedValue === building.buildingName){
              console.log("Test");
              // console.log(building.buildingName);
              // console.log(building.buildingDetails);
              // console.log(building.roomsInfo);
              // console.log(building.buildingId);
              console.log("");
              sampleBuilding.id = building.buildingId;
              sampleBuilding.name = building.buildingName;
              sampleBuilding.description = building.buildingDetails;
              sampleBuilding.rooms = [];
              building.roomsInfo.forEach((rooms, index)=>{
                console.log(rooms.roomName);
                console.log(rooms.roomId);
                console.log(floorList[rooms.floorId - 1]);
                sampleBuilding.rooms.push({
                  name: rooms.roomName,
                  floor:  floorList[rooms.floorId - 1],
                  floor_id: rooms.floorId ?? 0,
                  room_id: rooms.roomId ?? 0,
                  building_id: rooms.buildingId  
                });
              })
              console.log("Sample Building Data:", sampleBuilding);
              
                // Update UI with new building data
              populateBuildingData();
            }
            
      });
    }
    const saveBldgInfo = async (newBldgInfo)=> {
      try{
        loadingContainer.style.display = "flex";
        editBuildingForm.style.display = "none";
        const response = await fetch(`${baseUrl}/updateBuildingAndRooms`,{
          method: "PUT",
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
          loadingContainer.style.display = "none";
          editBuildingForm.style.display = "block";
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