<template>
  <div class="headline">
    <div class="date">{{ item.date }}</div>
    <div class="title">{{ item.title }}</div>
  </div>
</template>

<script lang="ts" setup>
import { Item } from "../types/Item";
import { defineProps } from "vue";

defineProps<{ item: Item }>();
</script>

<style scoped>
.headline {
  position: relative;
  margin: 0;
  box-sizing: border-box;
  padding: 16px 32px;
  width: 240px;
}
.date {
  color: white;
  font-size: 0.8rem;
  /*color: rgba(255,255,255,0.7);*/
  margin-bottom: 0;
  opacity: 0.75;
}
.title {
  color: white;
  margin-top: 8px;
  font-size: 2.5rem;
  line-height: 1;
  font-weight: 900;
}
@media (max-width: 960px) {
  .headline {
    width: initial;
  }
  .title {
    font-size: 1em;
  }
}
</style>
