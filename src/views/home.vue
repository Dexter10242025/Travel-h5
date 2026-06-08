<template>
  <div class="page-container">
    <div class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">探索世界</h1>
        <p class="hero-subtitle">AI智能规划您的完美旅程</p>
      </div>
    </div>
    <div class="page-content">
      <div class="card search-card">
        <div class="card-header">
          <div class="search-title">规划你的旅程</div>
          <van-icon name="sparkles-o" size="18" class="title-icon" />
        </div>
        <van-form @submit="onSubmit">
          <div class="form-group">
            <van-field
              v-model="formData.city"
              is-link
              readonly
              name="city"
              label="目的地"
              placeholder="点击选择城市"
              @click="showPicker = true"
              class="form-field"
            />
            <van-popup
              v-model:show="showPicker"
              position="bottom"
              round
              class="picker-popup"
            >
              <van-picker
                title="选择目的地"
                :columns="columns"
                @confirm="onConfirm"
                @cancel="showPicker = false"
              />
            </van-popup>
          </div>
          <div class="form-group">
            <van-field
              v-model="formData.budget"
              type="number"
              name="budget"
              label="预算(元)"
              placeholder="请填写预算"
              :rules="[{ required: true, message: '请填写预算' }]"
              class="form-field"
            />
          </div>
          <div class="form-group">
            <van-field
              v-model="formData.days"
              type="digit"
              name="days"
              label="天数"
              placeholder="请填写天数"
              :rules="[{ required: true, message: '请填写天数' }]"
              class="form-field"
            />
          </div>
          <div class="button-wrapper">
            <van-button
              round
              block
              native-type="submit"
              :loading="loading"
              class="submit-button"
            >
              <van-icon name="magic" size="18" />
              智能规划
            </van-button>
          </div>
        </van-form>
      </div>
      <div class="features-section">
        <div
          class="feature-card"
          v-for="(feature, index) in features"
          :key="index"
        >
          <div class="feature-icon" :style="{ background: feature.gradient }">
            <van-icon :name="feature.icon" size="24" />
          </div>
          <div class="feature-info">
            <div class="feature-title">{{ feature.title }}</div>
            <div class="feature-desc">{{ feature.desc }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

let formData = reactive({
  city: "",
  budget: "",
  days: "",
});
let loading = ref(false);
let showPicker = ref(false);

let columns = ref([
  { text: "北京", value: "北京" },
  { text: "上海", value: "上海" },
  { text: "广州", value: "广州" },
  { text: "天津", value: "天津" },
  { text: "重庆", value: "重庆" },
  { text: "深圳", value: "深圳" },
  { text: "珠海", value: "珠海" },
  { text: "桂林", value: "桂林" },
  { text: "四川", value: "四川" },
]);

const features = [
  {
    icon: "bulb-o",
    title: "智能推荐",
    desc: "AI算法精准推荐景点",
    gradient: "linear-gradient(135deg, #5a6eff 0%, #7c3aed 100%)",
  },
  {
    icon: "clock",
    title: "行程规划",
    desc: "智能规划最优路线",
    gradient: "linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)",
  },
  {
    icon: "gold-coin-o",
    title: "预算管理",
    desc: "实时预算分析与建议",
    gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
  },
];

function onConfirm(values) {
  formData.city = values.selectedValues[0];
  showPicker.value = false;
}

function onSubmit() {
  if (!formData.city || !formData.budget || !formData.days) {
    return;
  }
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
  }, 1000);
  router.push({
    path: "/detail",
    query: {
      city: formData.city,
      budget: formData.budget,
      days: formData.days,
    },
  });
  formData.city = "";
  formData.budget = "";
  formData.days = "";
}
</script>

<style scoped>
.page-container {
  min-height: 100vh;
  background: linear-gradient(180deg, #f0f4ff 0%, #faf5ff 50%, #f5f3ff 100%);
  display: block;
}

.hero-section {
  background: linear-gradient(135deg, #5a6eff 0%, #a855f7 50%, #ec4899 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.hero-content {
  text-align: center;
  width: 100%;
}

.hero-icon-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.hero-icon {
  width: 88px;
  height: 88px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
}

.hero-icon :deep(.van-icon) {
  background: linear-gradient(135deg, #5a6eff 0%, #a855f7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-title {
  font-size: 32px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 8px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  letter-spacing: 2px;
}

.hero-subtitle {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 400;
}

.page-content {
  padding: 16px;
  padding-bottom: 100px;
  margin-top: -20px;
}

.notice-bar {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  margin-bottom: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.notice-bar :deep(.van-notice-bar__text) {
  color: #64748b;
  font-size: 13px;
}

.card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06);
  padding: 24px;
  margin-bottom: 20px;
  border: 1px solid rgba(255, 255, 255, 0.5);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
}

.search-title {
  font-size: 20px;
  font-weight: 600;
  color: #1e293b;
}

.title-icon {
  background: linear-gradient(135deg, #5a6eff 0%, #a855f7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.form-group {
  margin-bottom: 16px;
}

.form-field {
  background: linear-gradient(145deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 14px;
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.form-field:focus {
  border-color: #5a6eff;
  box-shadow: 0 0 0 4px rgba(90, 110, 255, 0.1);
}

.form-field :deep(.van-field__label) {
  font-size: 14px;
  color: #64748b;
  font-weight: 500;
}

.form-field :deep(.van-field__control) {
  font-size: 15px;
  color: #1e293b;
}

.form-field :deep(.van-field__placeholder) {
  color: #94a3b8;
}

.button-wrapper {
  margin-top: 8px;
}

.submit-button {
  background: linear-gradient(135deg, #5a6eff 0%, #a855f7 50%, #ec4899 100%);
  border: none;
  height: 48px;
  border-radius: 16px;
  font-size: 16px;
  font-weight: 600;
  box-shadow: 0 8px 24px rgba(90, 110, 255, 0.4);
  transition: all 0.3s ease;
}

.submit-button:active {
  transform: scale(0.98);
  box-shadow: 0 4px 12px rgba(90, 110, 255, 0.3);
}

.submit-button :deep(.van-button__text) {
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.submit-button :deep(.van-icon) {
  color: #fff;
}

.features-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.feature-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.6);
  transition: all 0.3s ease;
}

.feature-card:active {
  transform: scale(0.98);
}

.feature-icon {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.feature-icon :deep(.van-icon) {
  color: #fff;
}

.feature-info {
  flex: 1;
  min-width: 0;
}

.feature-title {
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 4px;
}

.feature-desc {
  font-size: 13px;
  color: #94a3b8;
}

.picker-popup :deep(.van-picker__confirm) {
  color: #5a6eff;
  font-weight: 600;
}

.picker-popup :deep(.van-picker__cancel) {
  font-weight: 600;
}
</style>
