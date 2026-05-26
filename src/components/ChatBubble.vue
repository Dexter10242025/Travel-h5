<template>
  <div class="chat-bubble" :class="messageClass">
    <div class="bubble-content">
      <!-- 用户消息 -->
      <div class="message-text" v-if="message.role === 'user'">
        {{ message.content }}
      </div>
      <!-- AI消息 -->
      <div class="message-text" v-else>
        {{ message.content }}
      </div>
    </div>
    <!-- 消息时间 -->
    <div class="message-time" v-if="showTime">
      {{ formatTime }}
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

// 接收父组件传递的消息对象
const props = defineProps({
  message: {
    type: Object,
    required: true,
    // 消息对象结构：{ role: 'user'|'ai', content: '消息内容', timestamp: 时间戳 }
  },
});

// 计算消息样式类，区分用户/AI
const messageClass = computed(() => {
  return props.message.role === "user" ? "user-message" : "ai-message-wrap";
});

// 控制时间是否显示：存在时间戳且有消息内容时显示
const showTime = computed(() => {
  return props.message.timestamp && props.message.content;
});

// 格式化时间为 时:分
const formatTime = computed(() => {
  if (!props.message.timestamp) return "";
  const date = new Date(props.message.timestamp);
  return `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
});
</script>

<style scoped>
.chat-bubble {
  display: flex;
  flex-direction: column;
  max-width: 80%;
  margin: 8px 12px;
}

/* 用户消息：右对齐，蓝色气泡 */
.user-message {
  align-self: flex-end;
}
.user-message .bubble-content {
  background-color: #409eff;
  color: #fff;
  border-radius: 12px 12px 4px 12px;
  padding: 8px 12px;
}

.ai-message-wrap {
  align-self: flex-start;
}
.ai-message-wrap .bubble-content {
  background-color: #f5f7fa;
  color: #303133;
  border-radius: 12px 12px 12px 4px;
}

.message-text {
  line-height: 1.5;
  font-size: 14px;
  word-break: break-all;
}

/* 时间样式 */
.message-time {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}
.user-message .message-time {
  text-align: right;
}
.ai-message-wrap .message-time {
  text-align: left;
}
</style>
