<script setup lang="ts">
import { computed, ref } from "vue";
import { TimelinePost, thisMonth, thisWeek, today } from "../posts";
import TimelineItem from "./TimelineItem.vue";
import { DateTime } from "luxon";
import { usePosts } from "../stores/posts";
// type Period = "Today" | "This Week" | "This Month";
// const periods: Period[] = ["Today", "This Week", "This Month"];

const postsStore = usePosts();
const periods = ["Today", "This Week", "This Month"] as const;
type Period = typeof periods[number];

const selectedPeriod = ref<Period>("Today");

function selectPeriod(period: Period) {
  console.log(period);
  selectedPeriod.value = period;
}

const posts = computed<TimelinePost[]>(() => {
  return postsStore.ids
    .map((id) => {
      const post = postsStore.all.get(id);

      if (!post) {
        throw Error(`Post with id of ${id} was expected but not found.`);
      }

      return {
        ...post,
        created: DateTime.fromISO(post.created),
      };
    })
    .filter((post) => {
      if (selectedPeriod.value === "Today") {
        return post.created >= DateTime.now().minus({ day: 1 });
      }

      if (selectedPeriod.value === "This Week") {
        return post.created >= DateTime.now().minus({ week: 1 });
      }
      return post;
    });
});
</script>

<template>
  <nav class="is-primary panel">
    <span class="panel-tabs">
      <a
        v-for="period of periods"
        :key="period"
        :class="{ 'is-active': period === selectedPeriod }"
        @click="selectPeriod(period)"
        >{{ period }}</a
      >
    </span>

    <TimelineItem v-for="post of posts" :key="post.id" :post="post" />
  </nav>
</template>
