<template>
  <div>
    <h1>Generated Paper</h1>
    <section id="paper-details">
      <p>Course Code: {{ courseCode }}</p>
      <div
        v-for="(question, index) in questions"
        :key="question.id"
        class="question"
      >
        {{ index + 1 }}. {{ question.description }}
      </div>
    </section>
    <button @click="downloadGeneratedPaper">Download Generated Paper</button>
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
    <body>
      <h1 style="font-size: 3.2em; line-height: 1.1; color: black;text-align: center;">Generated Paper for ${courseCode}</h1><br><br>`;

  questions.forEach((question, index) => {
    content += `<div style="box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.5); transition: 0.3s; background-color: rgb(43, 41, 41); margin: 10px; padding: 1em 2em; display: block; color: white; width: 100%;">Question ${
      index + 1
    }:<br>${question.description}</div><br><br>`;
  });

  content += "</body>";
  return content;
};
</script>
