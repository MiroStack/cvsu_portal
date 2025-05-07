import { baseUrl, dashboard, getToken } from "./main.js";
let feedbacks = {};

const feedbackTable = document.querySelector('#feedbackTable');
const loaderContainer = document.querySelector(".container-loader");
const feedbackCounterCard = document.getElementById("feedbackCounterCard");
let status = "all";
const token = getToken();
const allBtn =  document.getElementById('allBtn');
const weeklyBtn =  document.getElementById('weeklyBtn');
const quarterlyBtn =  document.getElementById('quarterlyBtn');
document.addEventListener('DOMContentLoaded', async()=> {
  document.body.style.display = "none"; 
  try{
    if (!token) { // This checks for null, undefined, or empty string
      window.location.href = "./index.html";
    }
    else{
      document.body.style.display = "block"; 
    }
    feedbackTable.style.display = "none";
    feedbackCounterCard.style.display = "none"; 
    loaderContainer.style.display = "flex";
    console.log("Token: "+token);
    const response = await fetch(`${baseUrl}/displayAllFeedback`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        mode: 'cors',
    });
    if(response.status === 200){
      const data = await response.json();
    
      feedbacks = data;
   
      console.log(feedbacks);
      const totalFeedback = feedbacks.length;
      const feedbackCount = document.getElementById('totalFeedback');
      feedbackCount.textContent = totalFeedback;
      const feedbackTableBody = document.querySelector('#feedbackTableBody');
      feedbacks.forEach((feedback, index) => {
        const feedbackTableRow = document.createElement('tr');
        const date = feedback.submittedDate;
        const formattedDate = new Date(date).toLocaleString();
        feedbackTableRow.innerHTML = `
          <td data-node="#">${index+1}</td>
          <td data-node="Date & Time">${formattedDate}</td>
          <td data-node="Role">${feedback.respondentRole}</td>
          <td data-node="Purpose of Visit">
            ${feedback.purpose}
          </td>
          <td data-node="Comment">
              ${feedback.comment != null ? feedback.comment : ""}
            </td>
            
          <td data-node="Rating">${feedback.rating.toFixed(2)}</td>
        `;
        feedbackTableBody.appendChild(feedbackTableRow);
      });
      feedbackTable.style.display = "";
      loaderContainer.style.display = "none";
      feedbackCounterCard.style.display = ""; 
    }
    else{
        alert("Failed to fetch feedbacks.");
    }        

  }catch(e){
    alert("An error occured: "+e.message);
  }

});

function filterFeedback(feedbacks){
  const feedbackTableBody = document.querySelector('#feedbackTableBody');
  feedbackTableBody.innerHTML = "";
  if(status === "quarterly"){
      const date = new Date();
      const quarter = new Date();
      quarter.setDate(quarter.getDate() - 90);
      console.log(quarter);
      feedbacks.forEach((feedback, index) => {
        const feedbackTableRow = document.createElement('tr');
        const submitteddate = new Date(feedback.submittedDate);
        const formattedDate = submitteddate.toLocaleString();
        if(submitteddate.getTime() >= quarter.getTime() && submitteddate.getTime() <= date.getTime()){
          feedbackTableRow.innerHTML = `
            <td data-node="#">${index+1}</td>
            <td data-node="Date & Time">${formattedDate}</td>
            <td data-node="Role">${feedback.respondentRole}</td>
            <td data-node="Purpose of Visit">
              ${feedback.purpose}
            </td>
            <td data-node="Comment">
              ${feedback.comment}
            </td>
            <td data-node="Rating">${feedback.rating.toFixed(2)}</td>
          `;
          feedbackTableBody.appendChild(feedbackTableRow);
        }
      });
  }
  else if(status === "weekly"){
     const date = new Date();
      const week = new Date();
      week.setDate(week.getDate() - 7);
      feedbacks.forEach((feedback, index) => {
        const feedbackTableRow = document.createElement('tr');
        const submitteddate = new Date(feedback.submittedDate);
        const formattedDate = submitteddate.toLocaleString();
        if(submitteddate.getTime() >= week.getTime() && submitteddate.getTime() <= date.getTime()){
          feedbackTableRow.innerHTML = `
            <td data-node="#">${index+1}</td>
            <td data-node="Date & Time">${formattedDate}</td>
            <td data-node="Role">${feedback.respondentRole}</td>
            <td data-node="Purpose of Visit">
              ${feedback.purpose}
            </td>
            <td data-node="Comment">
               ${feedback.comment != null ? feedback.comment : ""}
            </td>
            <td data-node="Rating">${feedback.rating.toFixed(2)}</td>
          `;
          feedbackTableBody.appendChild(feedbackTableRow);
        }
      });
      
  }
  else{

    feedbacks.forEach((feedback, index) => {
      const feedbackTableRow = document.createElement('tr');
      const date = feedback.submittedDate;
      const formattedDate = new Date(date).toLocaleString();
      feedbackTableRow.innerHTML = `
        <td data-node="#">${index+1}</td>
        <td data-node="Date & Time">${formattedDate}</td>
        <td data-node="Role">${feedback.respondentRole}</td>
        <td data-node="Purpose of Visit">
          ${feedback.purpose}
        </td>
        <td data-node="Comment">
              ${feedback.comment != null ? feedback.comment : ""}
            </td>
        <td data-node="Rating">${feedback.rating.toFixed(2)}</td>
      `;
      feedbackTableBody.appendChild(feedbackTableRow);
    });
  }
 
  feedbackTable.style.display = "";
  loaderContainer.style.display = "none";
  feedbackCounterCard.style.display = ""; 
}


allBtn.addEventListener('click', ()=>{
  status = "all";
  allBtn.classList.add('active');
  weeklyBtn.classList.remove('active');
  quarterlyBtn.classList.remove('active');
  filterFeedback(feedbacks);
});

weeklyBtn.addEventListener('click', ()=>{
  status = "weekly";
  weeklyBtn.classList.add('active');
  allBtn.classList.remove('active');
  quarterlyBtn.classList.remove('active');
  filterFeedback(feedbacks);
});

quarterlyBtn.addEventListener('click', ()=>{
  status = "quarterly";
  quarterlyBtn.classList.add('active');
  weeklyBtn.classList.remove('active');
  allBtn.classList.remove('active');
  filterFeedback(feedbacks);
});