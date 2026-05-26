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
        <van-loading size="30px" vertical type="spinner">
          行程规划中...
        </van-loading>
      </div>
      <div v-else-if="errorMsg">
        <van-empty :description="errorMsg">
          <van-button type="primary" @click="travelRecommendData">
            重试
          </van-button>
        </van-empty>
      </div>

      <template v-else-if="tripData && tripData.success !== false">
        <div class="card overview-card">
          <div class="trip-header">
            <h2>{{ tripData.city }} · {{ tripData.days }}天行程</h2>
            <span class="budget-text">预算:¥{{ tripData.totalBudget }}</span>
          </div>
        </div>

        <van-collapse v-model="activeNames">
          <van-collapse-item
            v-for="day in tripData.dailyItinerary"
            :key="day.day"
            :title="'第' + day.day + '天'"
            :name="day.day"
          >
            <div class="day-scheaule">
              <div class="scheaule-section">
                <div class="section-label morning">上午</div>
                <SpotItem :data="day.morning" />
              </div>
              <div class="scheaule-section">
                <div class="section-label afternoon">下午</div>
                <SpotItem :data="day.afternoon" />
              </div>
              <div class="scheaule-section">
                <div class="section-label evening">晚上</div>
                <SpotItem :data="day.evening" />
              </div>
            </div>
          </van-collapse-item>
        </van-collapse>

        <!-- 预算明细 -->
        <div class="card budget-card" v-if="tripData.budgetBreakdown">
          <div class="section-title">预算明细</div>
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
          <div class="section-title">温馨提示</div>
          <ul class="tips-list">
            <li v-for="(tip, index) in tripData.tips" :key="index">
              {{ tip }}
            </li>
          </ul>
        </div>

        <!-- 注意事项 -->
        <div
          class="card warnings-card"
          v-if="tripData.warnings && tripData.warnings.length"
        >
          <div class="section-title">注意事项</div>
          <ul class="tips-list">
            <li v-for="(warning, index) in tripData.warnings" :key="index">
              {{ warning }}
            </li>
          </ul>
        </div>
      </template>
    </div>

    <div class="detail-footer" v-if="tripData && tripData.success !== false">
      <van-button type="primary" size="large" round @click="goToChat"
        >咨讯AI助手</van-button
      >
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
  background-color: #f5f5f5;
}
.page-content {
  padding: 16px;
}
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}
.card {
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin-bottom: 16px;
  padding: 20px 16px;
}
.trip-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.trip-header h2 {
  margin: 0;
  font-size: 22px;
  font-weight: 600;
}
.budget-text {
  font-size: 18px;
  color: #e64340;
  font-weight: 600;
}

.day-scheaule {
  padding: 8px 0;
}
.scheaule-section {
  margin-bottom: 12px;
}
.section-label {
  padding: 6px 12px;
  border-radius: 6px;
  color: #fff;
  font-size: 14px;
  margin-bottom: 8px;
  display: inline-block;
}
.section-label.morning {
  background-color: #409eff;
}
.section-label.afternoon {
  background-color: #ff9500;
}
.section-label.evening {
  background-color: #722ed1;
}
.budget-card{
  margin-top: 16px;
}
.section-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 12px;
  padding-bottom: 6px;
  border-bottom: 2px solid #ffd180;
}

.tips-list {
  margin: 0;
  padding: 0;
  list-style: none;
}
.tips-list li {
  font-size: 14px;
  line-height: 1.8;
  color: #333;
  margin-bottom: 10px;
  text-align: justify;
}

/* 底部固定按钮，和导航栏一样吸底悬浮 */
.detail-footer {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 10px 16px;
  background: #fff;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
  z-index: 99; /* 保证在最上层 */
}

/* 给页面底部留出按钮高度，防止内容被挡住 */
.page-content {
  padding-bottom: 70px !important;
}
</style>
