document.addEventListener('DOMContentLoaded', () => {
    const feedbackList = sessionStorage.getItem('exportFeedbackList')
        ? JSON.parse(sessionStorage.getItem('exportFeedbackList'))
        : [];

    const downloadBtn = document.querySelector('#download_pdf_btn');
    const feedbackTableBody = document.querySelector('#feedbackTableBody');
    const totalRows = 40;
    const printContainer = document.querySelector('.print-container');
    const status = sessionStorage.getItem('exportFeedbackType') || 'all';
    let previousDate = null;

    for (let i = 0; i < totalRows; i++) {
        const feedback = feedbackList[i];
        const row = document.createElement('tr');

        if (feedback) {
            const date = feedback.submittedDate;
            const formattedDate = new Date(date).toLocaleString();
            if(previousDate == null){
                previousDate = formattedDate;
            }
            else{
                if(previousDate > formattedDate){
                    previousDate = formattedDate;
                }
            }

            row.innerHTML = `
        <td>${i + 1}</td>
        <td>${formattedDate}</td>
        <td>${feedback.respondentRole}</td>
        <td>${feedback.purpose}</td>
        <td>${feedback.attendingStaff || ""}</td>
        <td>${feedback.comment != null ? feedback.comment : ""}</td>
        <td>${feedback.rating != null ? feedback.rating.toFixed(2) : ""}</td>
      `;
        } else {
            // Render empty row
            row.innerHTML = `
        <td>${i + 1}</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
      `;
        }

        feedbackTableBody.appendChild(row);
    }
    downloadBtn.addEventListener('click', async () => {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF("p", "pt", "a4"); // portrait, points, A4

        const content = document.querySelector(".print-container");

        // Convert HTML to canvas
        const canvas = await html2canvas(content, {
            scale: 2 // Higher resolution
        });

        const imgData = canvas.toDataURL("image/png");

        // Get PDF dimensions
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        // Add the image to the PDF
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

        pdf.save("feedback_report.pdf");
    });
});
