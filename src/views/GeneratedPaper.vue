<template>
  <div class="content-container">
    <div>
      <h1>Generated Paper</h1>
      <section id="paper-details">
        <p>Course Code: {{ courseCode }}</p>
        <DownloadPaperButton :questions="questions" :courseCode="courseCode" :isGenerated="true" />
        <h3>Preview</h3>
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
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import DownloadPaperButton from "../components/DownloadPaperButton.vue";

const router = useRouter();
const courseCode = router.currentRoute.value.params.courseCode;
const questions = JSON.parse(
  router.currentRoute.value.params.jsonSelectedQuestions
);
</script>
