<template>
  <div class="chat-bubble" :class="messageClass">
    <!-- AI头像：在AI消息时显示，放在左边 -->
    <div v-if="message.role === 'ai'" class="avatar ai-avatar">
      <van-icon name="chat-o" size="20" />
    </div>

    <div class="message-wrapper">
      <div class="bubble-content">
        <div class="message-text" v-if="message.role === 'user'">
          {{ message.content }}
        </div>
        <div
          class="message-text ai-message"
          v-else
          v-html="renderedContent"
        ></div>
      </div>
      <div class="message-time" v-if="showTime">
        {{ formatTime }}
      </div>
    </div>

    <!-- 用户头像：在用户消息时显示，放在右边 -->
    <div v-if="message.role === 'user'" class="avatar user-avatar">
      <van-icon name="friends-o" size="20" />
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import MarkdownIt from "markdown-it";

const md = new MarkdownIt({
  breaks: true,
  linkify: true,
});

const props = defineProps({
  message: {
    type: Object,
    required: true,
  },
});

const messageClass = computed(() => {
  return props.message.role === "user" ? "user-message" : "ai-message-wrap";
});

const showTime = computed(() => {
  return props.message.timestamp && props.message.content;
});

const formatTime = computed(() => {
  if (!props.message.timestamp) return "";
  const date = new Date(props.message.timestamp);
  return `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
});

const renderedContent = computed(() => {
  if (!props.message.content) return "";
  return md.render(props.message.content);
});
</script>

<style scoped>
.chat-bubble {
  display: flex;
  align-items: flex-start;
  max-width: 80%;
  margin: 8px 12px;
  gap: 8px;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #5a6eff 0%, #a855f7 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  flex-shrink: 0;
}

.user-message {
  align-self: flex-end;
}

.ai-message-wrap {
  align-self: flex-start;
}

.message-wrapper {
  display: flex;
  flex-direction: column;
  max-width: 100%;
}

.user-message .bubble-content {
  background-color: #409eff;
  color: #fff;
  border-radius: 12px 12px 4px 12px;
  padding: 8px 12px;
}

.ai-message-wrap .bubble-content {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  color: #1e293b;
  border-radius: 4px 16px 16px 16px;
  padding: 16px;
  border: 1px solid rgba(90, 110, 255, 0.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
}

.message-text {
  line-height: 1.6;
  font-size: 14px;
  word-break: break-word;
}

.ai-message {
  white-space: pre-wrap;
}

.ai-message p {
  margin: 0 0 12px 0;
}

.ai-message p:last-child {
  margin-bottom: 0;
}

.ai-message ul,
.ai-message ol {
  margin: 8px 0;
  padding-left: 24px;
}

.ai-message li {
  margin-bottom: 6px;
  line-height: 1.6;
}

.ai-message li:last-child {
  margin-bottom: 0;
}

.ai-message strong {
  font-weight: 600;
  color: #1e293b;
}

.ai-message em {
  font-style: italic;
}

.ai-message code {
  background-color: #f1f5f9;
  color: #e11d48;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 13px;
  font-family: monospace;
}

.ai-message pre {
  background-color: #1e293b;
  color: #e2e8f0;
  padding: 12px;
  border-radius: 8px;
  overflow-x: auto;
  margin: 8px 0;
}

.ai-message pre code {
  background-color: transparent;
  color: inherit;
  padding: 0;
}

.ai-message blockquote {
  border-left: 3px solid #5a6eff;
  padding-left: 12px;
  margin: 8px 0;
  color: #64748b;
  font-style: italic;
}

.ai-message a {
  color: #5a6eff;
  text-decoration: underline;
}

.message-time {
  font-size: 11px;
  color: #909399;
  margin-top: 4px;
  text-align: right;
}

.ai-message-wrap .message-time {
  text-align: left;
}
</style>
