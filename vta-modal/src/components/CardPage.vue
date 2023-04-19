<script setup lang="ts">
import { nextTick, ref } from "vue";
import { transitionHelper } from "../utils";
import CardItem from "./CardItem.vue";
import ModalDialog from "./ModalDialog.vue";
import type { Item } from "../types/Item";
import { items } from "../data/items";

const isModalOpen = ref(false);

const selectedItem = ref<Item | null>(null);

const openDialog = (item: Item) => {
  const element = document.querySelector<HTMLElement>(`[data-card="${item.id}"]`)!;
  const img = element.querySelector<HTMLElement>("img")!;
  const title = element.querySelector<HTMLElement>(".headline")!;

  element.style.viewTransitionName = "card";
  img.style.viewTransitionName = "card-img";
  title.style.viewTransitionName = "card-title";

  transitionHelper({
    async updateDOM() {
      selectedItem.value = item;
      isModalOpen.value = true;
      await nextTick();
    },
    cleanup() {
      element.style.viewTransitionName = "";
      img.style.viewTransitionName = "";
      title.style.viewTransitionName = "";
    },
  });
};


const closeDialog = () => {
  const id = selectedItem.value?.id ?? "";

  transitionHelper({
    async updateDOM() {
      isModalOpen.value = false;
      selectedItem.value = null;
      await nextTick();

      const element = document.querySelector<HTMLElement>(`[data-card='${id}']`)!;
      const img = element.querySelector<HTMLImageElement>("img")!;
      const title = element.querySelector<HTMLElement>(".headline")!;

      element.style.viewTransitionName = "card";
      img.style.viewTransitionName = "card-img";
      title.style.viewTransitionName = "card-title";
    },
    cleanup() {
      const element = document.querySelector<HTMLElement>(`[data-card='${id}']`)!;
      const img = element.querySelector<HTMLImageElement>("img")!;
      const title = element.querySelector<HTMLElement>(".headline")!;

      element.style.viewTransitionName = "";
      img.style.viewTransitionName = "";
      title.style.viewTransitionName = "";
    },
  });
};
</script>

<template>
  <div class="page">
    <div class="table" :inert="isModalOpen">
      <template v-for="(item, index) in items">
        <div
          class="row"
          v-if="index % 2 === 0"
          :class="{
            _left: (index / 2) % 2 === 0,
            _right: (index / 2) % 2 === 1,
          }"
        >
          <CardItem :item="items[index]" @open="openDialog" :selected="selectedItem?.id === items[index].id" />
          <CardItem :item="items[index + 1]" @open="openDialog" :selected="selectedItem?.id === items[index + 1].id" />
        </div>
      </template>
    </div>

    <template v-if="selectedItem != null">
      <ModalDialog v-if="isModalOpen" :item="selectedItem" @close="closeDialog"></ModalDialog>
    </template>
  </div>
</template>

<style scoped>
.page {
  --gap: 48px;
}
@media (max-width: calc(1080px + 32px)) {
  .page {
    --gap: 16px;
  }
}

.table {
  display: flex;
  flex-direction: column;
  gap: var(--gap);
  max-width: 1080px;
  margin: 0 auto 32px;
}
@media (max-width: calc(1080px + 32px)) {
  .table {
    margin-left: 32px;
    margin-right: 32px;
  }
}
@media (max-width: 960px) {
  .table {
    margin-left: 16px;
    margin-right: 16px;
  }
}

.row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: var(--gap);
}

.row._left :deep(.card:nth-child(1)) {
  grid-column-start: 1;
  grid-column-end: 3;
}

.row._left :deep(.card:nth-child(2)) {
  grid-column-start: 3;
  grid-column-end: 4;
}

.row._right :deep(.card:nth-child(1)) {
  grid-column-start: 1;
  grid-column-end: 2;
}

.row._right :deep(.card:nth-child(2)) {
  grid-column-start: 2;
  grid-column-end: 4;
}
</style>
