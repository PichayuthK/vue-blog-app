<script lang="ts" setup>
import { onMounted, ref, watch } from "vue";
import { TimelinePost } from "../posts";
import { marked } from "marked";
import highlightjs from "highlight.js";

const props = defineProps<{
  post: TimelinePost;
}>();

const title = ref(props.post.title);
const content = ref(props.post.markdown);
const html = ref("");
const contentEditable = ref<HTMLDivElement>();

watch(
  content,
  (newContent) => {
    marked.parse(
      newContent,
      {
        gfm: true,
        breaks: true,
        highlight: (code) => {
          return highlightjs.highlightAuto(code).value;
        },
      },
      (err, parseResult) => {
        html.value = parseResult;
      }
    );
  },
  {
    immediate: true,
  }
);

onMounted(() => {
  if (!contentEditable.value) {
    throw Error("ContentEditable DOM node was not found");
  }

  contentEditable.value.innerText = content.value;
});

function handleInput() {
  if (!contentEditable.value) {
    throw Error("ContentEditable DOM node was not found");
  }

  content.value = contentEditable.value.innerText;
}
</script>

<template>
  <div class="columns">
    <div class="column">
      <div class="field">
        <div class="label">Post Title</div>
        <input type="text" class="input" v-model="title" />
      </div>
    </div>
  </div>

  <div class="columns">
    <div class="column">
      <div
        class="realtime-editor"
        contenteditable
        ref="contentEditable"
        @input="handleInput"
      />
    </div>
    <div class="column">
      <div class="realtime-editor" v-html="html" />
    </div>
  </div>
</template>

<style>
@import "highlight.js/styles/atom-one-dark.css";

.realtime-editor > ul {
  list-style: revert !important;
  list-style-position: inside !important;
}

.realtime-editor > h1,
.realtime-editor > h2,
.realtime-editor > h3,
.realtime-editor > h4,
.realtime-editor > h5,
.realtime-editor > h6 {
  font-size: revert !important;
  margin: 10px 0 !important;
}

.realtime-editor > pre {
  margin: 10px 0 !important;
}

.realtime-editor > p {
  margin: 10px 0 !important;
}
</style>
