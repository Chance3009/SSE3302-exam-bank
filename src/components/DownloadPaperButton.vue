<template>
  <div v-if="questions.length > 0">
    <button @click="downloadExamPaper">Download Exam Paper</button>
  </div>
</template>

<script setup>
import html2pdf from "html2pdf.js";

const { questions, courseCode, isGenerated } = defineProps({
  questions: Array,
  courseCode: String,
  isGenerated: Boolean,
});

const downloadExamPaper = async () => {
  const htmlContent = await generateHtmlContent(questions);

  const pdfOptions = {
    margin: 10,
    filename: `GeneratedPaper_${courseCode}_${new Date().toLocaleDateString()}.pdf`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
  };

  html2pdf().from(htmlContent).set(pdfOptions).save();
};

const generateHtmlContent = async (questions) => {
  let content = `
    <body style="font-family: 'Times New Roman', serif; color: black;">
      <header style="text-align: center; margin-bottom: 20px;">
        <h1 style="color: black;">${courseCode} Test Paper</h1>
        <p style="color: black;">Date: ${new Date().toLocaleDateString()}</p>
        <p style="color: black;">Duration: 2 Hours</p>
      </header>
      <section style="margin-bottom: 20px;">
        <h2 style="color: black;">Instructions:</h2>
        <p style="color: black;">Read each question carefully. Answer within the space provided below each question.</p>
      </section>`;

  questions.forEach((question, index) => {
    const questionNumber = isGenerated ? index + 1 : question.quesNo;
    content += `
    <div style="box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2); margin: 10px; padding: 1em 2em; display: block; color: black; width: 100%;">
      <strong>Question ${questionNumber}:</strong><br>${question.description}
    </div>
    <div style="height: 15px;"></div> 
    <hr style="border: none; border-top: 1px solid black;">
    <div style="height: 15px;"></div> 
    <br>`;
  });

  content += `
      <footer style="text-align: center; margin-top: 20px;">
        <p style="color: black;">End of Paper</p>
      </footer>
    </body>`;
  return content;
};
</script>



<!-- 
<template>
  <div v-if="questions.length > 0">
    <button @click="downloadExamPaper">Download Exam Paper</button>
  </div>
</template>

<script setup>
import jsPDF from "jspdf";

const { questions, courseCode, isGenerated } = defineProps({
  questions: Array,
  courseCode: String,
  isGenerated: Boolean,
});

const downloadExamPaper = async () => {
  try {
    const pdf = new jsPDF({
      unit: "mm",
      format: "a4",
      orientation: "portrait",
    });

    await generatePdfContent(pdf);

    pdf.save(`GeneratedPaper_${courseCode}_${new Date().toLocaleDateString()}.pdf`);
  } catch (error) {
    console.error("Error generating PDF:", error);
  }
};

const generatePdfContent = (pdf) => {
  return new Promise((resolve) => {
    pdf.text(`${courseCode} Test Paper`, 105, 15, { align: "center" });
    pdf.text(`Date: ${new Date().toLocaleDateString()}`, 105, 25, { align: "center" });
    pdf.text("Duration: 2 Hours", 105, 35, { align: "center" });

    pdf.text("Instructions:", 15, 45);
    pdf.text("Read each question carefully. Answer within the space provided below each question.", 15, 55);

    let yPosition = 75;

    questions.forEach((question, index) => {
      const questionNumber = isGenerated ? index + 1 : question.quesNo;
      pdf.text(`Question ${questionNumber}:`, 15, yPosition);
      pdf.text(question.description, 15, yPosition + 10);
      yPosition += 30;
    });

    pdf.text("End of Paper", 105, yPosition, { align: "center" });

    resolve();
  });
};
</script> -->
