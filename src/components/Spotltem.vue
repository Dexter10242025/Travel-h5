<template>
  <div class="spot-item" v-if="data">
    <div class="spot-name">{{ data.spot || data.name || '待定' }}</div>
    <div class="spot-details" v-if="data.duration || data.ticket || data.transportation">
      <div class="detail-row" v-if="data.duration">
        <van-icon name="clock-o" size="14" />
        <span>{{ data.duration }}</span>
      </div>
      <div class="detail-row" v-if="data.ticket">
        <van-icon name="ticket-o" size="14" />
        <span>{{ data.ticket }}</span>
      </div>
      <div class="detail-row" v-if="data.transportation">
        <van-icon name="logistics" size="14" />
        <span>{{ data.transportation }}</span>
      </div>
    </div>
    <div class="spot-desc" v-if="data.description">{{ data.description }}</div>
  </div>
  <div class="spot-item empty" v-else>
    <van-empty description="暂无安排" :image-size="40" />
  </div>
</template>

<script setup>
// 接收父组件传递的 data 数据
defineProps({
  data: {
    type: Object,
    default: null
  }
})
</script>

<style scoped>
.spot-item {
  padding: 12px 16px;
  background: #fff;
  border-radius: 8px;
  margin: 8px 0;
}
.spot-name {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
}
.spot-details {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 8px;
  font-size: 14px;
  color: #666;
}
.detail-row {
  display: flex;
  align-items: center;
  gap: 4px;
}
.spot-desc {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
}
.spot-item.empty {
  padding: 20px;
  text-align: center;
}
</style>