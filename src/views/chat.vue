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
        <van-empty description="开始和AI助手对话吧" />
        <div class="quick-questions">
          <div class="quick-title">常见问题</div>
          <van-tag
            v-for="question in quickQuestions"
            :key="question"
            size="large"
            mark
            class="quick-tag"
            @click="handleClick(question)"
            >{{ question }}</van-tag
          >
        </div>
      </div>
      <div v-else class="message-list">
        <ChatBubble v-for="msg in messages" :key="msg.id" :message="msg" />
        <div class="streaming-indicator" v-if="isStreaming">
          <van-loading type="spinner" size="20px" />
          <span>AI助手正在思考中...</span>
        </div>
      </div>
    </div>
    <div class="chat-input-area">
      <van-field
        v-model="inputValue"
        placeholder="输入您的问题"
        :disabled="isStreaming"
        @keyup.enter="sendMessage"
      >
        <template #button>
          <van-button
            @click="sendMessage"
            type="primary"
            size="medium"
            :disabled="!inputValue.trim()"
          >
            发送
          </van-button>
        </template>
      </van-field>
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
//会话数据
let messages = ref([]);
//输入框数据
let inputValue = ref("");

//常见问题
let quickQuestions = ref([
  "北京三日游",
  "上海景点推荐",
  "广州美食推荐",
  "湖南景点推荐",
]);
//AI处理中的状态
let isStreaming = ref(false);
//返回按钮
const onBack = () => {
  router.back();
};
//点击常见问题
const handleClick = (question) => {
  inputValue.value = question;
  sendMessage();
};

//发送消息
const sendMessage = () => {
  const msg = inputValue.value.trim();
  if (!msg || isStreaming.value) {
    return;
  }
  addUserMessage(msg);
  inputValue.value = "";
  fetchAIResponse(msg);
};
//将用户发送的消息添加进消息列表
const addUserMessage = (content) => {
  messages.value.push({
    id: Date.now(),
    role: "user",
    content,
    timestamp: new Date().toISOString(),
  });
};
//获取AI响应
// 获取AI响应
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
      //将AI回复的消息添加进入消息列表
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
      // 只有完全没有收到内容时才提示错误
      if (lastMsg && lastMsg.role === "ai" && !fullResponse) {
        lastMsg.content = "网络异常，请重试";
        showToast("网络异常，请重试");
      }
      
      isStreaming.value = false;
    }
  );
};
const route = useRoute();
onMounted(() => {
  if (route.query.scheme === 'detail' && route.query.city) {
    inputValue.value = `我想了解一下${route.query.city}的旅游规划`;
  }
});
</script>

<style scoped>
/* 页面整体容器：弹性布局，固定占满屏幕 */
.page-container {
  height: 95vh;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 中间聊天内容区域：自动占剩余空间，独立滚动 */
.page-content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 14px 12px;
  padding-top: 35px;
  box-sizing: border-box;
}

/* 空状态居中样式 */
.chat-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 65vh;
  gap: 40px;
}

/* 快捷问题区域 */
.quick-questions {
  width: 100%;
  padding: 0 16px;
  text-align: center;
}
.quick-title {
  font-size: 16px;
  color: #888;
  margin-bottom: 24px;
}
.quick-tag {
  margin: 8px 6px;
  background-color: #999 !important;
  border: none !important;
  color: #fff !important;
  border-radius: 20px !important;
  padding: 4px 16px !important;
}

/* 消息列表 */
.message-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* AI思考中加载指示器 */
.streaming-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #909399;
  padding: 8px 4px;
  margin-left: 4px;
}

/* 底部输入区域：固定高度，永久显示 */
.chat-input-area {
  flex-shrink: 0; /* 禁止被压缩 */
  background: #fff;
  border-top: 1px solid #eee;
  padding: 12px 16px;
  box-sizing: border-box;
}

/* 深度修改 vant 输入框和按钮样式 */
:deep(.van-field) {
  background-color: #f5f7fa;
  /* border-radius: 24px; */
  padding: 0 12px;
}
:deep(.van-field__body) {
  padding: 0 8px;
}
:deep(.van-button--primary) {
  /* border-radius: 20px; */
  padding: 0 16px;
}
</style>
