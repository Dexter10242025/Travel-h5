<template>
  <div class="page-container profile-page">
    <div class="page-header">
      <van-nav-bar fixed title="我的" placeholder />
    </div>

    <div class="page-content">
      <!-- 用户信息区域 -->
      <div class="user-info-card">
        <div class="avatar-section">
          <div class="avatar">
            <van-icon name="friends-o" size="80" />
          </div>
          <div class="user-details">
            <div class="username">游客</div>
            <div class="welcome-text">欢迎使用智能旅游助手</div>
          </div>
        </div>
      </div>

      <!-- 功能菜单 -->
      <div class="menu-card">
        <van-cell-group :border="false">
          <van-cell icon="settings-o" title="设置" is-link />
          <van-cell icon="help-o" title="帮助与反馈" is-link />
        </van-cell-group>
      </div>

      <!-- 关于 -->
      <div class="about-card">
        <div class="section-title">关于</div>
        <van-cell-group :border="false">
          <van-cell title="关于我们" is-link />
          <van-cell title="版本信息" :value="'v1.0.0'" />
        </van-cell-group>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();
</script>

<style scoped>
.page-container {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.page-content {
  padding: 16px;
  /* padding-top: 60px; */
  padding-bottom: 100px;
}

/* 用户信息卡片 */
.user-info-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 16px;
}

.avatar-section {
  display: flex;
  align-items: center;
  gap: 16px;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid rgba(0, 0, 0, 0.5);
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-details {
  display: flex;
  flex-direction: column;
}

.username {
  font-size: 20px;
  font-weight: bold;
  color: #fff;
}

.welcome-text {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  margin-top: 4px;
}

/* 菜单卡片 */
.menu-card {
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin-bottom: 16px;
  overflow: hidden;
}

.menu-card :deep(.van-cell) {
  padding: 16px;
}

/* 关于卡片 */
.about-card {
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 16px;
}

.section-title {
  font-size: 14px;
  color: #999;
  margin-bottom: 12px;
}

.about-card :deep(.van-cell) {
  padding: 12px 0;
}
</style>
