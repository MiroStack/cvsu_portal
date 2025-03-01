const weeklyData = [
    { id: 1, date: "2023-05-01 09:15", role: "Student", purpose: "View campus map", rating: 5 },
    { id: 2, date: "2023-05-02 14:30", role: "Visitor", purpose: "Locate student services", rating: 3 },
    { id: 3, date: "2023-05-03 11:45", role: "Student", purpose: "Find classroom", rating: 4 },
    { id: 4, date: "2023-05-04 10:00", role: "Student", purpose: "Check library hours", rating: 5 },
    { id: 5, date: "2023-05-05 13:20", role: "Visitor", purpose: "Locate admin office", rating: 4 },
  ]
  
  const quarterlyData = [
    { id: 1, date: "2023-03-15 08:45", role: "Student", purpose: "View campus map", rating: 5 },
    { id: 2, date: "2023-04-02 16:15", role: "Visitor", purpose: "Locate admin office", rating: 3 },
    { id: 3, date: "2023-04-20 12:30", role: "Student", purpose: "Find library", rating: 4 },
    { id: 4, date: "2023-05-01 09:15", role: "Student", purpose: "View campus map", rating: 5 },
    { id: 5, date: "2023-05-02 14:30", role: "Visitor", purpose: "Locate student services", rating: 3 },
    { id: 6, date: "2023-05-10 11:00", role: "Student", purpose: "Find cafeteria", rating: 4 },
    { id: 7, date: "2023-05-18 15:45", role: "Visitor", purpose: "Locate parking area", rating: 5 },
    { id: 8, date: "2023-05-25 10:30", role: "Student", purpose: "Check exam schedule", rating: 4 },
  ]
  
  // Function to sort by date and reassign IDs
  function sortAndReassignIDs(data) {
    const sortedData = data.sort((a, b) => new Date(a.date) - new Date(b.date)) // Sort by date
    return sortedData.map((item, index) => ({ ...item, id: index + 1 })) // Reassign sequential IDs starting from 1
  }
  
  // Function to update dashboard and display feedback
  function updateDashboard(data, label) {
    const totalFeedback = data.length
  
    document.getElementById("totalFeedback").textContent = totalFeedback
  
    const tableBody = document.getElementById("feedbackTableBody")
    tableBody.innerHTML = "" // Clear existing rows
    data.forEach((item) => {
      const formattedDate = new Date(item.date).toLocaleString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
      const row = `
              <tr>
                  <td>${item.id}</td>
                  <td>${formattedDate}</td>
                  <td>${item.role}</td>
                  <td>${item.purpose}</td>
                  <td>${item.rating}</td>
              </tr>
          `
      tableBody.innerHTML += row
    })
  
    document.getElementById("tableLabel").textContent = label // Update the table label
  }
  
  const allBtn = document.getElementById("allBtn")
  const weeklyBtn = document.getElementById("weeklyBtn")
  const quarterlyBtn = document.getElementById("quarterlyBtn")
  
  // Function to handle button activation
  function activateButton(button) {
    // Remove 'active' class from all buttons
    document.querySelectorAll(".btn-group .btn").forEach((btn) => btn.classList.remove("active"))
    // Add 'active' class to the clicked button
    button.classList.add("active")
  }
  
  // Event listeners for each button
  allBtn.addEventListener("click", () => {
    activateButton(allBtn)
    updateDashboard(sortAndReassignIDs([...weeklyData, ...quarterlyData]), "Showing: Overall Feedback")
  })
  
  weeklyBtn.addEventListener("click", () => {
    activateButton(weeklyBtn)
    updateDashboard(sortAndReassignIDs(weeklyData), "Showing: Weekly Feedback")
  })
  
  quarterlyBtn.addEventListener("click", () => {
    activateButton(quarterlyBtn)
    updateDashboard(sortAndReassignIDs(quarterlyData), "Showing: Quarterly Feedback")
  })
  
  // Initialize with overall feedback (combined data)
  updateDashboard(sortAndReassignIDs([...weeklyData, ...quarterlyData]), "Showing: Overall Feedback")
  
  