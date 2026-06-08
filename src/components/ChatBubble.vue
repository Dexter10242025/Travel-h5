<template>
  <div class="chat-bubble" :class="messageClass">
    <!-- AI头像：在AI消息时显示，放在左边 -->
    <div v-if="message.role === 'ai'" class="avatar ai-avatar">
      <van-icon name="chat-o" size="20" />
    </div>

    <div class="message-wrapper">
      <div class="bubble-content">
        <div class="message-text">{{ message.content }}</div>
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
  line-height: 1.5;
  font-size: 14px;
  word-break: break-all;
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
