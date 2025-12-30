<template>
  <div class="feedback-container">
    <!-- 反馈按钮 -->
    <div class="feedback-btn" @click="showFeedback">
      <ImageIcon type="feedback" class="icon" />
      <div class="text">文档反馈</div>
    </div>
 
    <!-- 反馈表单 -->
    <ElDialog
      title="意见反馈"
      v-model="isFormVisible"
      :closable="true"
      :close-on-click-modal="false"
      :show-close="true"
      class="feedback-dialog"
    >
      <div class="feedback-form">
        <ElCheckboxGroup v-model="feedbackTypes">
          <ElRow :gutter="12">
            <ElCol v-for="(label, idx) in FEEDBACK_OPTIONS" :key="idx" :span="8">
              <ElCheckbox :label="idx">{{ label }}</ElCheckbox>
            </ElCol>
          </ElRow>
        </ElCheckboxGroup>

        <div class="form-item">
          <div class="label">其他问题？请描述你遇到的问题或意见</div>
          <ElInput 
            v-model="feedbackContent"
            type="textarea"
            placeholder="例如：您期待什么搜索结果？您对我们的搜索功能有什么建议？"
            :rows="3"
          />
        </div>

        <div class="form-item" style="margin-top: 10px;">
          <div class="label">联系方式</div>
          <ElInput 
            v-model="contactInfo"
            placeholder="请填写您的称呼/电话/邮箱等，方便我们后续跟进处理"
          />
        </div>

        <ElCheckbox v-model="provideScreenshot" style="margin-top: 10px;">
          提供截图
        </ElCheckbox>

        <div 
          class="screenshot-wrapper"
          @click="openImageEditor"
          v-loading="screenshotLoading"
          element-loading-text="文章截图中"
        >
          <div class="screenshot-mask"></div>
          <div class="screenshot-overlay">
            <ImageIcon />
            <span>点击标记内容</span>
          </div>
          <img 
            v-if="screenshotData" 
            :src="screenshotData" 
            alt="截图预览"
            class="screenshot-preview-img"
          />
        </div>

        <div class="form-footer">
          <div class="footer-actions" style="justify-content: center; width: 100%;">
            <ElButton @click="closeForm">取消</ElButton>
            <ElButton type="primary" :loading="submitLoading" @click="submitFeedback">
              提交
            </ElButton>
          </div>
        </div>
      </div>
    </ElDialog>

    <!-- 图片标记编辑器 -->
    <ImageMarker 
      v-if="isImageEditorOpen && screenshotData"
      :key="imageEditorKey"
      v-model:visible="isImageEditorOpen"
      :image="screenshotData"
      @save="handleImageSave"
    />
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import { ElDialog, ElCheckbox, ElCheckboxGroup, ElRow, ElCol, ElInput, ElButton, ElMessage } from 'element-plus'
import html2canvas from 'html2canvas'
import ImageMarker from './ImgMarker.vue'
import ImageIcon from './ImageIcon.vue'

const ticketWebsite = 'https://ticket.example.com'

const isFormVisible = ref(false)
const feedbackTypes = ref([])
const feedbackContent = ref('')
const contactInfo = ref('')
const provideScreenshot = ref(true)
const screenshotData = ref(null)
const screenshotLoading = ref(false)
const isImageEditorOpen = ref(false)
const imageEditorKey = ref(0) // 新增
const submitLoading = ref(false)

const FEEDBACK_OPTIONS = [
  '描述错误',
  '代码错误',
  '限制问题',
  '未更新',
  '太复杂，看不懂',
  '其他'
]

const showFeedback = async () => {
  isFormVisible.value = true
  await nextTick() // 等待反馈窗口渲染完成
  takeScreenshot()
}

const takeScreenshot = async () => {
  try {
    screenshotLoading.value = true
    // 使用body全量截图，避免选中内容被弹窗遮挡
    document.body.classList.add('no-feedback-mask');
    // 只截取当前窗口可视区域
    let docContent = document.querySelector('.theme-hope-content')
    const rect = docContent.getBoundingClientRect();
    // rect.width/height 也可以进一步判断
    if (rect.height <= 100) {
      docContent = document.getElementById('main-content')
    }
    
    const canvas = await html2canvas(docContent, {
      x: 0,
      y: 0,
      width: docContent.width,
      height: docContent.height,
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
      scrollX: window.scrollX,
      scrollY: window.scrollY,
      backgroundColor: null,
      useCORS: true
    });
    document.body.classList.remove('no-feedback-mask');
    
    screenshotData.value = canvas.toDataURL('image/png')
    console.log('截图完成，数据大小:', screenshotData.value.length)
  } catch (error) {
    console.error('截图失败:', error)
  } finally {
    screenshotLoading.value = false
  }
}

const openImageEditor = async () => {
  if (!screenshotData.value) {
    console.warn('没有可用的截图数据')
    return
  }
  // 先关闭再打开，确保图片能刷新渲染
  isImageEditorOpen.value = false
  await nextTick()
  imageEditorKey.value++
  isImageEditorOpen.value = true
  await nextTick()
  // 此时 image-marker-container 应该已渲染
  const editor = document.querySelector('.image-marker-container')
  if (editor) {
    console.log('图片标记编辑器已加载')
  } else {
    console.error('无法找到图片标记编辑器')
  }
}

const handleImageSave = (image) => {
  screenshotData.value = image
}

const submitFeedback = async () => {
  try {
    submitLoading.value = true

    let file = null
    if (provideScreenshot.value && screenshotData.value) {
      try {
        const blob = await fetch(screenshotData.value).then(r => r.blob())
        file = new File([blob], 'screenshot.png', { type: 'image/png' })
      } catch (err) {
        file = null
        console.warn('截图转文件失败，继续无图提交', err)
      }
    }

    // 根据选择内容转为具体内容，使用 encodeURIComponent 转义
    const selectedTitles = feedbackTypes.value.map(idx => FEEDBACK_OPTIONS[idx])

    const formData = new FormData()
    if (file) formData.append('image', file)
    console.log('提交的反馈类型:', selectedTitles)
    formData.append('title', JSON.stringify(selectedTitles))
    formData.append('content', feedbackContent.value)
    formData.append('contact', contactInfo.value)
    formData.append('page', window.location.href)

    let response, result
    try {
      response = await fetch('https://doc-feedback.easemob.com/api/feedback', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      })
      result = await response.json()
    } catch (e) {
      isFormVisible.value = false
      // 网络错误或其他异常
      ElMessage.error('提交失败，请稍后再试')
      throw e
    }

    if (!response.ok || !result.success) {
      // 根据HTTP状态码显示不同的错误提示
      if (response.status === 429) {
        ElMessage.error('提交频率过快，请稍后再试')
      } else {
        ElMessage.error('提交失败，请稍后再试')
      }
      throw new Error(result.message || '提交失败')
    }
    
    // 提交成功后清理反馈内容
    clearFeedbackForm()
    isFormVisible.value = false
    ElMessage.success('提交成功，感谢您的反馈')
  } catch (e) {
    isFormVisible.value = false
    console.error(e)
  } finally {
    submitLoading.value = false
  }
}

// 添加清理反馈表单的方法
const clearFeedbackForm = () => {
  // 清空反馈类型选择
  feedbackTypes.value = []
  // 清空反馈内容
  feedbackContent.value = ''
  // 清空联系方式
  contactInfo.value = ''
  // 重置截图选项
  provideScreenshot.value = true
  // 清空截图数据
  screenshotData.value = null
  // 关闭图片编辑器
  isImageEditorOpen.value = false
  // 重置图片编辑器key
  imageEditorKey.value = 0
}

const closeForm = () => {
  isFormVisible.value = false
}
</script>

<style scoped>
.feedback-container {
  background-color: #155EEF;
  border-radius: 25px;
  position: fixed;
  right: 1rem;
  bottom: 11rem;
  width: 50px;
  left: unset;
  z-index: 1000;
}

.feedback-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 25px;
  padding: 10px;
  color: white;
  cursor: pointer;
  transition: all 0.3s;
  width: 50px;
  height: 9rem;
  box-sizing: border-box;
}

.feedback-btn:hover {
  background: #40a9ff;
}

.icon {
  margin-top: 5px;
  width: 20px;
  height: 20px;
}

.text {
  margin-top: 7px;
  font-size: 16px;
  font-weight: 600;
  writing-mode: vertical-rl;
  text-orientation: mixed;
  letter-spacing: 3px;
}

.feedback-form {
  padding: 20px;
  max-width: 680px;
  margin: 0 auto;
  box-sizing: border-box;
}

.form-item {
  margin-top: 24px;
}

.label {
  font-size: 14px;
  color: #333;
  margin-bottom: 12px;
}

.screenshot-wrapper {
  position: relative;
  height: 120px;
  margin-top: 12px;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
}

.screenshot-mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  transition: opacity 0.3s;
}

.screenshot-wrapper:hover .screenshot-mask {
  opacity: 0.8;
}

.screenshot-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  color: white;
  z-index: 10;
}

.screenshot-overlay span {
  margin-left: 8px;
  font-size: 14px;
}

.screenshot-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: left top;
}

.screenshot-preview-img {
  display: block;
  margin: 0 auto;
  width: 100%;
  max-width: 100%;
  height: auto;
  max-height: 300px;
  object-fit: contain;
}

.form-footer {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 24px;
}

.footer-actions {
  display: flex;
  gap: 24px;
  justify-content: center;
}

.footer-actions button:first-child {
  width: 120px;
  height: 32px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  color: #333;
}

.footer-actions button:last-child {
  width: 120px;
  height: 32px;
  font-size: 12px;
}

.feedback-dialog {
  max-width: 680px !important;
  width: 100% !important;
}

@media (max-width: 720px) {
  .feedback-dialog {
    max-width: 98vw !important;
    width: 98vw !important;
    min-width: unset !important;
    margin-left: 8px !important;
    margin-right: 8px !important;
  }
  .feedback-form {
    max-width: 98vw;
    padding: 10px 0;
  }
  /* FEEDBACK_OPTIONS 竖排展示 */
  .feedback-form .el-row {
    flex-direction: column !important;
  }
  .feedback-form .el-col {
    max-width: 100%;
    flex: 0 0 100%;
    width: 100%;
    margin-bottom: 0px;
  }
}
</style>
