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

const router = useRouter();
const courseCode = router.currentRoute.value.params.courseCode;
const questions = JSON.parse(
  router.currentRoute.value.params.jsonSelectedQuestions
);

const downloadGeneratedPaper = () => {
  const blobContent = generateBlobContent(questions);

  const blob = new Blob([blobContent], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `GeneratedPaper_${courseCode}.txt`;
  a.click();

  URL.revokeObjectURL(url);
};

const generateBlobContent = (questions) => {
  let content = `Generated Paper for ${courseCode}\n\n`;

  questions.forEach((question, index) => {
    content += `Question ${index + 1}:\n`;
    content += `${question.description}\n\n`;
  });

  return content;
};
</script>
