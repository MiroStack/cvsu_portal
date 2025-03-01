import { baseUrl, getToken, dashboard } from "../scripts/main.js";

document.addEventListener("DOMContentLoaded", async () =>{


  const loadingContainer = document.querySelector(".container-loader");
  const buildingsContainer = document.querySelector("#buildingsContainer");
  let buildingInfo;
  const token = getToken();
  console.log(token);
 
    try{
        loadingContainer.style.display = "flex"
        buildingsContainer.style.display = "none"
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
           loadingContainer.style.display = "none"
          buildingsContainer.style.display = "block"
          buildingInfo = result;
         
        }
        else{
          alert('Failed to load the building information.'); 
        }  
           

       
       // console.log(buildingInfo);
        const floorList = ["Ground Floor", "Second Floor", "Third Floor"];
    
        const buildings = buildingInfo.map((building) => {
          const floorsMap = {}; // To store floors dynamically
      
          building.roomsInfo.forEach((room) => {
              const roomId = room.roomId;
              const floorIndex = room.floorId - 1;
              const floorName = ["Ground Floor", "Second Floor", "Third Floor"][floorIndex] || "No Floor";
      
              // If the floor does not exist, create it
              if (!floorsMap[floorIndex]) {
                  floorsMap[floorIndex] = {
                      name: floorName,
                      rooms: [],
                  };
              }
      
              // Add the room to the correct floor
              floorsMap[floorIndex].rooms.push({
                  id: room.roomId,
                  name: room.roomName,
              });
              
          });
         
      
          return { 
              id: building.buildingId,
              name: building.buildingName,
              floors: Object.values(floorsMap), // Convert floors object to an array
          };
      });
      
           

      
            const buildingVisibility = {}

            function createBuildingElement(building, index) {
              const buildingDiv = document.createElement("div")
              buildingDiv.className = "building"

              const buildingHeader = document.createElement("div")
              buildingHeader.className = "building-header"

              const buildingTitle = document.createElement("h2")
              buildingTitle.textContent = building.name

              buildingHeader.appendChild(buildingTitle)

              const toggleButton = document.createElement("button")
              toggleButton.textContent = "Show Floors"

              const floorsDiv = document.createElement("div")
              floorsDiv.className = "floors"
            
              building.floors.forEach((floor, floorIndex) => {
                
               
                const floorDiv = document.createElement("div")
                floorDiv.className = "floor"
                

                const floorName = document.createElement("h3")
                floorName.textContent = floor.name
                if (floor.name === "No Floor") {
                  floorName.style.display = "none"
                }
                floorName.style.fontWeight = "bold"
                floorDiv.appendChild(floorName)

                const roomsContainer = document.createElement("div")
                roomsContainer.className = "rooms-container"

                floor.rooms.forEach((room, roomIndex) => {
                  const roomDiv = document.createElement("div")
                  roomDiv.className = "room"

                  const roomInfo = document.createElement("div")
                  roomInfo.className = "room-info"

                  const roomName = document.createElement("span")
                  roomName.className = "room-name"
                  roomName.textContent = room.name;

                  // console.log(room.name);

                  const floorInfo = document.createElement("span")
                  floorInfo.className = "room-floor"
                  if (floor.name !== "No Floor") {
                    floorInfo.textContent = floor.name
                  }

                  roomInfo.appendChild(roomName)
                  roomInfo.appendChild(floorInfo)
    
                  const iconContainer = document.createElement("div")
                  iconContainer.className = "icon-container"
                  const editIcon = document.createElement("ion-icon")
                  editIcon.name = "create-outline"
                  editIcon.className = "edit-icon"
                  editIcon.addEventListener("click", (e) => {
                    e.stopPropagation()
                    editRoom(index, floorIndex, roomIndex)
                  })

                  const deleteIcon = document.createElement("ion-icon")
                  deleteIcon.name = "close-circle-outline"
                  deleteIcon.className = "delete-icon"
                  deleteIcon.addEventListener("click", (e) => {
                    e.stopPropagation()
                    deleteRoom(index, floorIndex, roomIndex)
                  })

                  iconContainer.appendChild(editIcon)
                  iconContainer.appendChild(deleteIcon)

                  roomDiv.appendChild(roomInfo)
                  roomDiv.appendChild(iconContainer)
                  roomsContainer.appendChild(roomDiv)
                })

                floorDiv.appendChild(roomsContainer)
                floorsDiv.appendChild(floorDiv)
              })

              if (buildingVisibility[index] === undefined) {
                buildingVisibility[index] = false
              }

              if (buildingVisibility[index]) {
                floorsDiv.style.display = "block"
                toggleButton.textContent = "Hide Floors"
              } else {
                floorsDiv.style.display = "none"
                toggleButton.textContent = "Show Floors"
              }

              toggleButton.addEventListener("click", () => {
                buildingVisibility[index] = !buildingVisibility[index]
                renderBuildings()
              })

              buildingDiv.appendChild(buildingHeader)
              buildingDiv.appendChild(toggleButton)
              buildingDiv.appendChild(floorsDiv)

              return buildingDiv
            }

            function editRoom(buildingIndex, floorIndex, roomIndex) {
              const building = buildings[buildingIndex]
              const currentRoom = building.floors[floorIndex].rooms[roomIndex].name
              const currentFloor = building.floors[floorIndex].name
              const id  =building.floors[floorIndex].rooms[roomIndex].id;
              

              const modal = document.createElement("div")
              modal.className = "modal"

              const floorOptions = floorList
              .map((floor, index) => `<option value="${index}" ${index === floorIndex ? "selected" : ""}>${floor}</option>`)
              .join("");
            

              modal.innerHTML = `
                <div class="modal-content">
                  <h2>Edit Room</h2>

                  <label for="roomName">Room Name:</label>
                  <input type="text" id="roomName" value="${currentRoom}">

                  <label for="floorSelect">Floor:</label>
                  <select id="floorSelect">
                    ${floorOptions}
                  </select>

                  <div class="modal-buttons">
                    <button id="saveButton">Save</button>
                    <button id="cancelButton">Cancel</button>
                  </div>
                </div>
              `

              document.body.appendChild(modal)

              document.getElementById("saveButton").addEventListener("click", async () => {
                const newName = document.getElementById("roomName").value.trim()
                const newFloorIndex = Number.parseInt(document.getElementById("floorSelect").value)
              
                if (newName !== "") {
                  // Remove room from old floor
                  buildings[buildingIndex].floors[floorIndex].rooms.splice(roomIndex, 1)

                  // Add room to new floor
                  if (!buildings[buildingIndex].floors[newFloorIndex]) {
                    console.error("Floor index out of bounds:", newFloorIndex);
                  } else {
                    buildings[buildingIndex].floors[newFloorIndex].rooms.push({
                      id: id, // Keep the same room ID
                      name: newName, // Use the new name
                    });
                  }
                  
                  console.log(id);
                  console.log(newName);
                  console.log(newFloorIndex + 1);
                  const newRoomInfo ={
                    roomId:id,
                    roomName: newName,
                    floorId: newFloorIndex + 1,
                  }

                  try{
                    const response = await fetch(`${baseUrl}/updateRoom`,{
                       method:"PUT",
                       headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                       },
                       mode: "cors", // Enable CORS
                       body:JSON.stringify(newRoomInfo)
                    });
                    if (response.ok) {
                      const result = await response.json();
                      alert(result.message);
      
                      dashboard();
      
                  } else {
                      const errorData = await response.json();
                      alert(errorData.message);
                  }
                  }catch(e){
                    alert("Error occured: "+e);
                  }


                  renderBuildings()
                }
                document.body.removeChild(modal)
              })

              document.getElementById("cancelButton").addEventListener("click", () => {
                document.body.removeChild(modal)
              })
            }

            const deleteRoom = async(buildingIndex, floorIndex, roomIndex) => {
              const roomId = buildings[buildingIndex].floors[floorIndex].rooms[roomIndex].id;
              console.log(roomId);
                  try{
                    const response = await fetch(`${baseUrl}/deleteRoom?roomId=${roomId}`,{
                       method:"DELETE",
                       headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                       },
                       mode: "cors", // Enable CORS
                    });
                    if(response.ok){
                        const result =  await response.json();
                        alert(result.message);
                        dashboard();
                  
                    }
                    else{
                      const error = await response.json();
                      alert(error.message);
                    }
              }
              catch(e){
                alert("Error occured: " + e.message);
              }
              renderBuildings()
            }

            function renderBuildings() {
              buildingsContainer.innerHTML = ""
              buildings.forEach((building, index) => {
                const buildingElement = createBuildingElement(building, index)
                buildingsContainer.appendChild(buildingElement)
              })
            }

            renderBuildings()


    }
    catch(e){
        alert("Error occured: " + e.message);
    }
});