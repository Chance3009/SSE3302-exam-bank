<template>
  <button class="card" @click="selectPaper(paper.id)">
    {{ String(paper.id).split("-")[0] }} {{ paper.year }} Test {{ paper.test }}
  </button>
</template>

<script setup>
import { useRouter } from "vue-router";

const props = defineProps(["paper"]);

const router = useRouter();

const selectPaper = (paperId) => {
  router.push({ name: "questions-list", params: { paperId } });
};
</script>
