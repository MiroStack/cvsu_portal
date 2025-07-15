document.addEventListener('DOMContentLoaded', () => {
    const feedbackList = sessionStorage.getItem('exportFeedbackList')
        ? JSON.parse(sessionStorage.getItem('exportFeedbackList'))
        : [];

    const downloadBtn = document.querySelector('#download_pdf_btn');
    const status = sessionStorage.getItem('exportFeedbackType') || 'all';
    const rowsPerPage = 30;
    const totalPages = Math.ceil(feedbackList.length / rowsPerPage);
    const user = sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user')) : null;

    // Remove the original template container (optional)
    const original = document.querySelector('.print-container');
    if (original) original.remove();

    let previousDate = null;
    const date = new Date();
    

    for (let page = 0; page < totalPages; page++) {
        const container = document.createElement('div');
        container.classList.add('print-container');

        const start = page * rowsPerPage;
        const end = start + rowsPerPage;
        const pageData = feedbackList.slice(start, end);

        // Build feedback rows
        let feedbackRows = '';
        for (let i = 0; i < rowsPerPage; i++) {
            const feedback = pageData[i];
            const index = start + i;
            let row = '';

            if (feedback) {
                const date = feedback.submittedDate;
                const formattedDate = new Date(date).toLocaleString();

                if (previousDate === null || previousDate > formattedDate) {
                    previousDate = formattedDate;
                }

                row = `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${formattedDate}</td>
                        <td>${feedback.respondentRole}</td>
                        <td>${feedback.purpose}</td>
                        <td>${feedback.attendingStaff || ""}</td>
                        <td>${feedback.comment || ""}</td>
                        <td>${feedback.rating != null ? feedback.rating.toFixed(2) : ""}</td>
                    </tr>`;
            } else {
                row = `
                    <tr>
                        <td>${index + 1}</td>
                        <td colspan="6"></td>
                    </tr>`;
            }

            feedbackRows += row;
        }

        // HTML template per page
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const toyear = date.getFullYear();
        const toMonth = date.getMonth(); // Months are 0-indexed
        const date1 = new Date(previousDate);
        const fromyear = date1.getFullYear();
        const fromMonth = date1.getMonth(); // Months are 0-indexed
        let containerTitle = "";
        if(status === "quarterly") {
            containerTitle = `From ${months[fromMonth]} ${fromyear} to ${months[toMonth]} ${toyear}`;
        }else if(status === "weekly") {
            containerTitle = `From ${months[date1.getMonth()]} ${date1.getDate()} to ${date.getDate()}`;
        }else if(status === "all") {
            containerTitle = `From ${months[fromMonth]} ${fromyear} to ${months[toMonth]} ${toyear}`;
        }
        container.innerHTML = `
            <div style="position: relative; display: flex; align-items: center; justify-content: center;">
                <div style="margin-right: 18px; position: absolute; left: 25%">
                    <img src="../styles/img/favicon/cvsu-logo.png" alt="CVSU Logo" style="width: 56px; height: 56px; display: block; margin: 0 auto" />
                </div>
                <div style="text-align: center">
                    <p style="font-size: 12px">Republic of the Philippines</p>
                    <h1 style="font-size: 20px">Cavite State University</h1>
                    <p style="font-size: 14px">Naic, Cavite</p>
                </div>
            </div>

            <h2 class="header">${status == "all"? "Feedback Report": status == "weekly"?"Weekly Feedback Report": status == "quarterly"?"Quarterly Feedback Report":""}</h2>

            <div class="info-line">
                <span>Period Covered:</span>
                <div class="line"><span>${containerTitle || ''}</span></div>
                <span>Total Number of Clients:</span>
                <div class="line"><span>${feedbackList.length}</span></div>
            </div>

            <div class="table-responsive" style="margin-top: 40px;">
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Date & Time</th>
                            <th>Role</th>
                            <th>Purpose of Visit</th>
                            <th>Attending Staff</th>
                            <th>Comment</th>
                            <th>Rating</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${feedbackRows}
                    </tbody>
                </table>
            </div>

            <div class="info-line2" style="margin-top: 10em;">
                
                <div>${user.fullname}<hr><span>Prepared by:</span></div>
                <div><hr><span>Signature:</span></div>
            </div>
        `;

        document.body.appendChild(container);
    }

    // PDF Export Logic (for all .print-container)
    downloadBtn.addEventListener('click', async () => {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF("p", "pt", "a4");
        const containers = document.querySelectorAll(".print-container");

        for (let i = 0; i < containers.length; i++) {
            const content = containers[i];
            const canvas = await html2canvas(content, { scale: 2 });
            const imgData = canvas.toDataURL("image/png");

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            if (i > 0) pdf.addPage();
            pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        }

        pdf.save("feedback_report.pdf");
    });
});
