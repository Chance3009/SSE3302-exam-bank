<template>
  <div>
    <h1>Home</h1>
    <div class="search-bar">
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Search for papers..."
        @input="performSearch"
      />
      <button @click="performSearch">Search</button>
    </div>
    <div class="search-results">
      <PaperCard v-for="paper in papers" :key="paper.id" :paper="paper" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { examsRef } from "../firebase/db.js";
import { query, where, getDocs } from "firebase/firestore";
import PaperCard from "../components/PaperCard.vue";

const searchQuery = ref("");
const papers = ref([]);

const performSearch = async () => {
  const query = searchQuery.value.toUpperCase();

  try {
    const q = query(
      examsRef,
      where("__name__", ">=", `${query}`),
      where("__name__", "<", `${query}\uf8ff`)
    );
    const snapshot = await getDocs(q);
    papers.value = snapshot.docs.map((paper) => ({
      id: paper.id,
      ...paper.data(),
    }));
  } catch (error) {
    console.error("Error performing search:", error);
  }
};

onMounted(() => {
  // You can perform an initial search on component mount if needed
  // performSearch();
});
</script>
