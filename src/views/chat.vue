<template>
  <div class="page-container chat-page">
    <div class="page-header">
      <van-nav-bar
        fixed
        left-text="返回"
        left-arrow
        :title="title"
        @click-left="onBack"
        placeholder
      />
    </div>
    <div class="page-content">
      <div v-if="messages.length === 0" class="chat-empty">
        <div class="empty-avatar">
          <van-icon name="robot" size="64" />
        </div>
        <div class="empty-title">AI旅游助手</div>
        <div class="empty-desc">开始和AI助手对话吧</div>
        <div class="quick-questions">
          <div class="quick-title">常见问题</div>
          <div class="quick-tags">
            <van-tag
              v-for="question in quickQuestions"
              :key="question"
              size="large"
              class="quick-tag"
              @click="handleClick(question)"
              >{{ question }}</van-tag
            >
          </div>
        </div>
      </div>
      <div v-else class="message-list">
        <!-- 每一条用户消息和AI消息都会渲染一个ChatBubble组件 -->
        <ChatBubble v-for="msg in messages" :key="msg.id" :message="msg" />
        <div class="streaming-indicator" v-if="isStreaming">
          <div class="thinking-dots">
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
          </div>
          <span>AI助手正在思考中...</span>
        </div>
      </div>
    </div>
    <div class="chat-input-area">
      <div class="input-wrapper">
        <van-field
          v-model="inputValue"
          placeholder="输入您的问题"
          :disabled="isStreaming"
          @keyup.enter="sendMessage"
        />
        <van-button
          @click="sendMessage"
          type="primary"
          size="medium"
          :disabled="!inputValue.trim() || isStreaming"
          class="send-btn"
        >
          <van-icon name="upgrade" size="60" />
          <!-- 发送 -->
        </van-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { fetchStream } from "../api/travel.js";
import { showToast } from "vant";
import ChatBubble from "../components/ChatBubble.vue";

const router = useRouter();

let title = ref("AI旅游助手");
let messages = ref([]);
let inputValue = ref("");

let quickQuestions = ref([
  "北京三日游",
  "上海景点推荐",
  "广州美食推荐",
  "湖南景点推荐",
]);
let isStreaming = ref(false);

const onBack = () => {
  router.back();
};

const handleClick = (question) => {
  inputValue.value = question;
  sendMessage();
};

const sendMessage = () => {
  const msg = inputValue.value.trim();
  if (!msg || isStreaming.value) {
    return;
  }
  addUserMessage(msg);
  inputValue.value = "";
  fetchAIResponse(msg);
};

const addUserMessage = (content) => {
  messages.value.push({
    id: Date.now(),
    role: "user",
    content,
    timestamp: new Date().toISOString(),
  });
};

const fetchAIResponse = async (Usermsg) => {
  isStreaming.value = true;
  messages.value.push({
    id: Date.now() + 1,
    role: "ai",
    content: "",
    timestamp: new Date().toISOString(),
  });
  let fullResponse = "";
  fetchStream(
    "chat",
    { message: Usermsg },
    (chunk) => {
      fullResponse += chunk;
      const lastMsg = messages.value[messages.value.length - 1];
      if (lastMsg && lastMsg.role === "ai") {
        lastMsg.content = fullResponse;
      }
    },
    () => {
      isStreaming.value = false;
    },
    (errMsg) => {
      console.warn("流提示：", errMsg);

      const lastMsg = messages.value[messages.value.length - 1];
      if (lastMsg && lastMsg.role === "ai" && !fullResponse) {
        lastMsg.content = "网络异常，请重试";
        showToast("网络异常，请重试");
      }

      isStreaming.value = false;
    },
  );
};

const route = useRoute();
onMounted(() => {
  if (route.query.scheme === "detail" && route.query.city) {
    inputValue.value = `我想了解一下${route.query.city}的旅游规划`;
  }
});
</script>

<style scoped>
.page-container {
  min-height: 90vh;
  background: linear-gradient(180deg, #f0f4ff 0%, #faf5ff 50%, #f5f3ff 100%);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.page-content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  /* padding: 14px 12px; */
  padding-top: 15px;
  box-sizing: border-box;
}

.chat-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  gap: 16px;
}

.empty-avatar {
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, #5a6eff 0%, #a855f7 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 32px rgba(90, 110, 255, 0.3);
  margin-bottom: 8px;
}

.empty-avatar :deep(.van-icon) {
  color: #fff;
}

.empty-title {
  font-size: 20px;
  font-weight: 600;
  color: #1e293b;
  margin-top: 8px;
}

.empty-desc {
  font-size: 14px;
  color: #64748b;
}

.quick-questions {
  width: 100%;
  padding: 0 16px;
  margin-top: 32px;
}

.quick-title {
  font-size: 14px;
  color: #94a3b8;
  margin-bottom: 16px;
  text-align: center;
}

.quick-tags {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
}

.quick-tag {
  background: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(20px) !important;
  border: 1px solid rgba(90, 110, 255, 0.2) !important;
  color: #5a6eff !important;
  border-radius: 24px !important;
  padding: 10px 20px !important;
  font-size: 14px !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06) !important;
  transition: all 0.3s ease !important;
}

.quick-tag:active {
  transform: scale(0.95);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08) !important;
}

.message-list {
  display: flex;
  flex-direction: column;
  padding-bottom: 160px;
  gap: 16px;
}

.streaming-indicator {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: #64748b;
  padding: 16px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  margin: 8px 0;
  width: fit-content;
}

.thinking-dots {
  display: flex;
  gap: 4px;
}

.thinking-dots .dot {
  width: 8px;
  height: 8px;
  background: linear-gradient(135deg, #5a6eff 0%, #a855f7 100%);
  border-radius: 50%;
  animation: dotPulse 1.4s infinite ease-in-out;
}

.thinking-dots .dot:nth-child(1) {
  animation-delay: 0s;
}

.thinking-dots .dot:nth-child(2) {
  animation-delay: 0.2s;
}

.thinking-dots .dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes dotPulse {
  0%,
  80%,
  100% {
    transform: scale(0.6);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

.chat-input-area {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 50px;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.98) 0%,
    rgba(248, 250, 252, 0.98) 100%
  );
  backdrop-filter: blur(20px);
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.08);
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  padding: 12px 16px;
  padding-bottom: calc(12px + env(safe-area-inset-bottom));
  z-index: 99;
}

.input-wrapper {
  display: flex;
  gap: 12px;
  align-items: center;
}

.input-wrapper :deep(.van-field) {
  flex: 1;
  background: rgba(241, 245, 249, 0.8);
  border-radius: 20px;
  padding: 12px 16px;
  border: 1px solid rgba(90, 110, 255, 0.1);
}

.input-wrapper :deep(.van-field__body) {
  padding: 0;
}

.input-wrapper :deep(.van-field__control) {
  font-size: 15px;
}

.send-btn {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  padding: 0;
  background: linear-gradient(135deg, #5a6eff 0%, #a855f7 50%, #ec4899 100%);
  border: none;
  box-shadow: 0 8px 24px rgba(90, 110, 255, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.send-btn:active {
  transform: scale(0.92);
  box-shadow: 0 4px 12px rgba(90, 110, 255, 0.3);
}

.send-btn:not(:disabled) :deep(.van-icon) {
  color: #fff;
}

.send-btn:disabled {
  background: #cbd5e1;
  box-shadow: none;
}
</style>
