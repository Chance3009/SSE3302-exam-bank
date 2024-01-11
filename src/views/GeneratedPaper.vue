<template>
  <div>
    <h1>Generated Paper</h1>
    <section id="paper-details">
      <p>Course Code: {{ courseCode }}</p>
      <div v-for="question in questions" :key="question.id" class="question">
        {{ question.quesNo }} . {{ question.description }}
      </div>
    </section>
    <button @click="downloadGeneratedPaper">Download Generated Paper</button>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

export default {
  props: {
    questions: {
      type: Array,
      required: true,
    },
    courseCode: {
      type: String,
      required: true,
    },
  },

  setup() {
    const generatedPaper = ref({});
    const router = useRouter();
    const courseCode = router.currentRoute.value.courseCode;
    const selectedQuestions = router.currentRoute.value.jQues
      ? JSON.parse(router.currentRoute.value.jQues)
      : [];

    const downloadGeneratedPaper = () => {
      const blobContent = generateBlobContent(selectedQuestions);

      const blob = new Blob([blobContent], { type: "text/plain" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `GeneratedPaper_${courseCode}.pdf`;
      a.click();

      // Clean up the Blob URL
      URL.revokeObjectURL(url);
    };

    const generateBlobContent = (questions) => {
      // Implement this function based on the structure of your selected questions
      // Adjust the formatting logic as needed
      let content = `Generated Paper for ${courseCode}\n\n`;

      // Iterate over selected questions and append them to the content
      questions.forEach((question, index) => {
        content += `Question ${index + 1}:\n`;
        content += `ID: ${question.id}\n`; // Adjust the property names based on your actual question structure
        content += `Description: ${question.description}\n\n`;
      });

      return content;
    };
  },
};
</script>
