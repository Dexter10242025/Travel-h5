<template>
  <div class="page-container">
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
      <!-- loading效果 -->
      <div class="loading-container" v-if="isLoading">
        <div class="loading-wrapper">
          <van-loading size="36px" vertical type="spinner" color="#5a6eff">
            行程规划中...
          </van-loading>
        </div>
      </div>
      <div v-else-if="errorMsg">
        <van-empty :description="errorMsg">
          <van-button
            type="primary"
            @click="travelRecommendData"
            class="retry-button"
          >
            重试
          </van-button>
        </van-empty>
      </div>

      <template v-else-if="tripData && tripData.success !== false">
        <div class="card overview-card">
          <div class="trip-header">
            <div class="trip-info">
              <h2 class="trip-title">
                {{ tripData.city }} · {{ tripData.days }}天行程
              </h2>
              <p class="trip-subtitle">智能规划您的完美旅程</p>
            </div>
            <div class="budget-badge">
              <van-icon name="gold-coin-o" size="20" />
              <span class="budget-text">¥{{ tripData.totalBudget }}</span>
            </div>
          </div>
        </div>

        <van-collapse v-model="activeNames" class="custom-collapse">
          <van-collapse-item
            v-for="day in tripData.dailyItinerary"
            :key="day.day"
            :title="'第' + day.day + '天'"
            :name="day.day"
          >
            <div class="day-schedule">
              <div class="schedule-section">
                <div class="section-label morning">
                  <van-icon name="sun-o" size="16" />
                  上午
                </div>
                <SpotItem :data="day.morning" />
              </div>
              <div class="schedule-section">
                <div class="section-label afternoon">
                  <van-icon name="sun" size="16" />
                  下午
                </div>
                <SpotItem :data="day.afternoon" />
              </div>
              <div class="schedule-section">
                <div class="section-label evening">
                  <van-icon name="moon-o" size="16" />
                  晚上
                </div>
                <SpotItem :data="day.evening" />
              </div>
            </div>
          </van-collapse-item>
        </van-collapse>

        <!-- 预算明细 -->
        <div class="card budget-card" v-if="tripData.budgetBreakdown">
          <div class="card-header">
            <div class="section-title">
              <van-icon name="chart-trending-o" size="20" class="title-icon" />
              预算明细
            </div>
          </div>
          <BudgetTable
            :data="tripData.budgetBreakdown"
            :total="tripData.totalBudget"
          />
        </div>

        <!-- 温馨提示 -->
        <div
          class="card tips-card"
          v-if="tripData.tips && tripData.tips.length"
        >
          <div class="card-header">
            <div class="section-title">
              <van-icon name="info-o" size="20" class="title-icon" />
              温馨提示
            </div>
          </div>
          <ul class="tips-list">
            <li v-for="(tip, index) in tripData.tips" :key="index">
              <van-icon name="check" size="16" class="tip-icon" />
              {{ tip }}
            </li>
          </ul>
        </div>

        <!-- 注意事项 -->
        <div
          class="card warnings-card"
          v-if="tripData.warnings && tripData.warnings.length"
        >
          <div class="card-header">
            <div class="section-title warning-title">
              <van-icon name="warning-o" size="20" class="title-icon" />
              注意事项
            </div>
          </div>
          <ul class="tips-list">
            <li v-for="(warning, index) in tripData.warnings" :key="index">
              <van-icon
                name="warning"
                size="16"
                class="tip-icon warning-icon"
              />
              {{ warning }}
            </li>
          </ul>
        </div>
      </template>
    </div>

    <div class="detail-footer" v-if="tripData && tripData.success !== false">
      <van-button
        type="primary"
        size="large"
        round
        @click="goToChat"
        class="chat-button"
      >
        <van-icon name="chat-o" size="18" />
        咨询AI助手
      </van-button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getTravelRecommend } from "../api/travel.js";
import SpotItem from "../components/Spotltem.vue";
import BudgetTable from "../components/BudgetTable.vue";

const route = useRoute();
const router = useRouter();

let isLoading = ref(true);
let formData = reactive({
  city: "",
  budget: "",
  days: "",
});
let tripData = ref(null);
let errorMsg = ref("");
let activeNames = ref([]);

onMounted(() => {
  formData.city = route.query.city;
  formData.budget = route.query.budget;
  formData.days = route.query.days;

  // 读取本地缓存
  const cache = localStorage.getItem("tripPlanCache");
  if (cache) {
    try {
      const { params, data } = JSON.parse(cache);
      // 参数一致 → 直接使用缓存，不发请求
      if (
        params.city === formData.city &&
        String(params.budget) === String(formData.budget) &&
        String(params.days) === String(formData.days)
      ) {
        tripData.value = data;
        isLoading.value = false;
        return;
      }
    } catch (e) {}
  }

  // 无缓存 → 正常发起请求
  if (formData.city && formData.budget && formData.days) {
    travelRecommendData();
  }
});

let title = computed(() => {
  return formData.city + "行程规划";
});

function onBack() {
  router.back();
}

function goToChat() {
  router.push({
    path: "chat",
    query: {
      scheme: "detail",
      city: formData.city,
    },
  });
}
// 行程规划数据
let travelRecommendData = async () => {
  isLoading.value = true;
  errorMsg.value = "";

  try {
    let data = {
      city: formData.city,
      budget: Number(formData.budget),
      days: Number(formData.days),
    };
    const res = await getTravelRecommend(data);
    isLoading.value = false;

    if (res && res.data.success === true) {
      tripData.value = res.data;
      // 缓存参数与结果
      localStorage.setItem(
        "tripPlanCache",
        JSON.stringify({
          params: {
            city: formData.city,
            budget: formData.budget,
            days: formData.days,
          },
          data: res.data,
        }),
      );
    } else {
      errorMsg.value = res.data.error || "暂无行程数据";
    }
  } catch (error) {
    isLoading.value = false;
    errorMsg.value = "获取数据失败，请检查网络";
  }
};
</script>

<style scoped>
.page-container {
  min-height: 100vh;
  background: linear-gradient(180deg, #f0f4ff 0%, #faf5ff 50%, #f5f3ff 100%);
}

.page-content {
  padding: 16px;
  padding-bottom: 90px;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.loading-wrapper {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 40px 60px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06);
}

.card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06);
  margin-bottom: 20px;
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.5);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 8px;
}

.title-icon {
  background: linear-gradient(135deg, #5a6eff 0%, #a855f7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.warning-title {
  color: #f43f5e;
}

.warning-title .title-icon {
  background: linear-gradient(135deg, #f43f5e 0%, #ec4899 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.overview-card {
  background: linear-gradient(135deg, #5a6eff 0%, #a855f7 50%, #ec4899 100%);
  border: none;
  padding: 24px;
}

.trip-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.trip-info {
  flex: 1;
}

.trip-title {
  margin: 0 0 8px 0;
  font-size: 22px;
  font-weight: 700;
  color: #fff;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.trip-subtitle {
  margin: 0;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
}

.budget-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  padding: 12px 20px;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.budget-badge :deep(.van-icon) {
  color: #ffd700;
}

.budget-text {
  font-size: 20px;
  color: #fff;
  font-weight: 700;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.custom-collapse {
  background: transparent;
}

.custom-collapse :deep(.van-collapse-item) {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06);
  margin-bottom: 16px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  overflow: hidden;
}

.custom-collapse :deep(.van-collapse-item__title) {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  padding: 20px 24px;
}

.custom-collapse :deep(.van-collapse-item__content) {
  padding: 0 24px 20px;
}

.custom-collapse :deep(.van-icon-arrow) {
  color: #5a6eff;
}

.day-schedule {
  padding: 8px 0;
}

.schedule-section {
  margin-bottom: 16px;
}

.section-label {
  padding: 8px 16px;
  border-radius: 12px;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 12px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.section-label :deep(.van-icon) {
  color: #fff;
}

.section-label.morning {
  background: linear-gradient(135deg, #5a6eff 0%, #7c3aed 100%);
}

.section-label.afternoon {
  background: linear-gradient(135deg, #ff9500 0%, #ff6b00 100%);
}

.section-label.evening {
  background: linear-gradient(135deg, #722ed1 0%, #9254de 100%);
}

.budget-card {
  margin-top: 0;
}

.tips-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.tips-list li {
  font-size: 14px;
  line-height: 1.8;
  color: #475569;
  margin-bottom: 12px;
  text-align: justify;
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.tip-icon {
  color: #10b981;
  flex-shrink: 0;
  margin-top: 2px;
}

.warning-icon {
  color: #f43f5e;
}

.retry-button {
  background: linear-gradient(135deg, #5a6eff 0%, #a855f7 100%);
  border: none;
  border-radius: 16px;
  height: 44px;
  font-weight: 600;
}

.detail-footer {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 12px 16px;
  padding-bottom: calc(12px + env(safe-area-inset-bottom));
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.98) 0%,
    rgba(248, 250, 252, 0.98) 100%
  );
  backdrop-filter: blur(20px);
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.08);
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  z-index: 99;
}

.chat-button {
  background: linear-gradient(135deg, #5a6eff 0%, #a855f7 50%, #ec4899 100%);
  border: none;
  height: 48px;
  border-radius: 16px;
  font-size: 16px;
  font-weight: 600;
  box-shadow: 0 8px 24px rgba(90, 110, 255, 0.4);
  transition: all 0.3s ease;
}

.chat-button:active {
  transform: scale(0.98);
  box-shadow: 0 4px 12px rgba(90, 110, 255, 0.3);
}

.chat-button :deep(.van-button__text) {
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.chat-button :deep(.van-icon) {
  color: #fff;
}
</style>
