<template>
  <div class="page-container">
    <div class="page-header">
      <van-nav-bar title="智能旅游助手" />
    </div>
    <div class="page-content">
      <van-notice-bar
        left-icon="info-o"
        text="基于AI的智能景点介绍与行程规划助手"
        style="margin-bottom: 16px"
      />
      <div class="card search-card">
        <div class="search-title" style="margin-bottom: 16px">规划你的旅程</div>
        <van-form @submit="onSubmit">
          <van-field
            v-model="formData.city"
            is-link
            readonly
            name="city"
            label="目的地"
            placeholder="点击选择城市"
            @click="showPicker = true"
            style="background: #f7f8fa; border-radius: 8px; margin-bottom: 12px"
          />
          <van-popup v-model:show="showPicker" position="bottom" round>
            <van-picker
              title="选择目的地"
              :columns="columns"
              @confirm="onConfirm"
              @cancel="showPicker = false"
            />
          </van-popup>
          <van-field
            v-model="formData.budget"
            type="number"
            name="budget"
            label="预算(元)"
            placeholder="请填写预算"
            :rules="[{ required: true, message: '请填写预算' }]"
            style="background: #f7f8fa; border-radius: 8px; margin-bottom: 12px"
          />
          <van-field
            v-model="formData.days"
            type="digit"
            name="days"
            label="天数"
            placeholder="请填写天数"
            :rules="[{ required: true, message: '请填写天数' }]"
            style="background: #f7f8fa; border-radius: 8px; margin-bottom: 12px"
          />
          <div style="margin: 16px">
            <van-button
              round
              block
              type="primary"
              native-type="submit"
              :loading="loading"
            >
              开始规划
            </van-button>
          </div>
        </van-form>
      </div>
      <div class="card search-card">
        <div class="search-title" style="margin-bottom: 16px">快捷入口</div>
        <van-grid clickable :column-num="2">
          <van-grid-item icon="chat-o" text="AI对话" to="/chat" />
          <van-grid-item icon="user-o" text="我的" to="/profile" />
        </van-grid>
      </div>
      <div class="card search-card">
        <div class="search-title" style="margin-bottom: 16px">热门目的地</div>
        <van-grid :column-num="4" :gutter="8" :border="false">
          <van-grid-item
            v-for="(item, index) in popularCities"
            :key="index"
            :text="item.text"
            @click="selectCity(item.text)"
          >
            <div
              class="city-tag"
              :class="{ active: formData.city === item.text }"
            >
              {{ item.text }}
            </div>
          </van-grid-item>
        </van-grid>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
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
  {
    text: "北京",
    value: "北京",
  },
  {
    text: "上海",
    value: "上海",
  },
  {
    text: "广州",
    value: "广州",
  },
  {
    text: "天津",
    value: "天津",
  },
  {
    text: "重庆",
    value: "重庆",
  },
  {
    text: "深圳",
    value: "深圳",
  },
  {
    text: "珠海",
    value: "珠海",
  },
  {
    text: "桂林",
    value: "桂林",
  },
  {
    text: "四川",
    value: "四川",
  },
]);
let popularCities = computed(() => {
  return columns.value.slice(0, 8);
});
function selectCity(city) {
  formData.city = city;
}
function onConfirm(values) {
  formData.city = values.selectedValues[0];
  showPicker.value = false;
}
function onSubmit() {
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
  formData = {
    city: "",
    budget: "",
    days: "",
  };
}
</script>

<style scoped>
.page-container {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.page-content {
  padding: 16px;
  padding-bottom: 100px;
}

.card {
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin-bottom: 16px;
  padding: 16px;
}

.search-card .search-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.city-tag {
  padding: 4px 8px;
  border-radius: 12px;
  background-color: #f7f8fa;
  color: #333;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.city-tag.active {
  background-color: #e3f2fd;
  color: #1989fa;
}
</style>
