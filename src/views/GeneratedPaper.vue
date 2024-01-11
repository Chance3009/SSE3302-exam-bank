<template>
  <div>
    <h1>Generated Paper</h1>
    <section id="paper-details">
      <p>Course Code: {{ courseCode }}</p>
      <button @click="downloadGeneratedPaper">Download Generated Paper</button>
      <h3>Question Bank</h3>
      <table>
        <thead>
          <tr>
            <th>No.</th>
            <th>Question</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(question, index) in questions" :key="question.id">
            <td>{{ index + 1 }}</td>
            <td>{{ question.description }}</td>
          </tr>
        </tbody>
      </table>
    </section>

  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import html2pdf from "html2pdf.js";


const router = useRouter();
const courseCode = router.currentRoute.value.params.courseCode;
const questions = JSON.parse(
  router.currentRoute.value.params.jsonSelectedQuestions
);

const downloadGeneratedPaper = () => {
  const htmlContent = generateHtmlContent(questions);

  const pdfOptions = {
    margin: 10,
    filename: `GeneratedPaper_${courseCode}_${new Date().toLocaleDateString()}.pdf`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
  };

  html2pdf().from(htmlContent).set(pdfOptions).save();
};

const generateHtmlContent = (questions) => {
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
    content += `
      <div style="box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2); margin: 10px; padding: 1em 2em; display: block; color: black; width: 100%;">
        <strong>Question ${index + 1}:</strong><br>${question.description}
      </div>
      <div style="height: 15px;"></div> <!-- Space before the line -->
      <hr style="border: none; border-top: 1px solid black;"> <!-- Black line -->
      <div style="height: 15px;"></div> <!-- Space after the line -->
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
