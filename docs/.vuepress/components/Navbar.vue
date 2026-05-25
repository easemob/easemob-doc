<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { ElMessage } from "element-plus";
import Navbar from "vuepress-theme-hope/modules/navbar/components/Navbar.js";
import { useThemeLocaleData } from "vuepress-theme-hope/composables/index";

const themeData = useThemeLocaleData();
const extraNavList = computed(() => themeData.value.extra_nav || []);

const SESSION_COOKIE_NAME = "u_session_name";
const SESSION_COOKIE_DOMAIN = ".easemob.com";

const userName = ref("");
const isLoggedIn = computed(() => userName.value !== "");
const isMobileAccountMenuOpen = ref(false);

const getCookieValue = (name) => {
  const cookiePairs = document.cookie.split("; ");

  for (const cookiePair of cookiePairs) {
    if (!cookiePair) continue;

    const separatorIndex = cookiePair.indexOf("=");
    const cookieName =
      separatorIndex === -1 ? cookiePair : cookiePair.slice(0, separatorIndex);

    if (cookieName !== name) continue;

    const rawValue =
      separatorIndex === -1 ? "" : cookiePair.slice(separatorIndex + 1);
    return decodeURIComponent(rawValue);
  }

  return "";
};

const clearCookie = (name) => {
  const expires = "Thu, 01 Jan 1970 00:00:00 GMT";

  document.cookie = `${name}=; expires=${expires}; path=/`;
  document.cookie = `${name}=; expires=${expires}; path=/; domain=${SESSION_COOKIE_DOMAIN}`;
};

const syncUserSession = () => {
  userName.value = getCookieValue(SESSION_COOKIE_NAME);
};

const handleSearch = () => {
  const keyword = document.getElementById("meta-category")?.innerText;
  const url = keyword
    ? `/form/search.html?s=${encodeURIComponent(keyword)}`
    : "/form/search.html";

  window.open(url, "_blank");
};

const handleCopyClick = (event) => {
  const target = event.target;

  if (!(target instanceof HTMLElement)) return;

  if (
    isMobileAccountMenuOpen.value &&
    window.matchMedia("(max-width: 1300px)").matches &&
    !target.closest(".account-wrapper")
  ) {
    isMobileAccountMenuOpen.value = false;
  }

  if (target.className === "header-anchor") {
    setTimeout(() => {
      navigator.clipboard.writeText(window.document.location.href);
    }, 300);
    ElMessage.success("已复制链接");
    return;
  }

  if (target.tagName === "CODE" && target.parentElement?.tagName !== "PRE") {
    navigator.clipboard.writeText(target.textContent || "");
    ElMessage.success("已复制");
  }
};

onMounted(() => {
  syncUserSession();
  window.addEventListener("click", handleCopyClick);
});

onBeforeUnmount(() => {
  window.removeEventListener("click", handleCopyClick);
});

const toggleAccountMenu = () => {
  if (!window.matchMedia("(max-width: 1300px)").matches) {
    return;
  }

  isMobileAccountMenuOpen.value = !isMobileAccountMenuOpen.value;
};

const openConsole = () => {
  window.location.href = "https://console.easemob.com/index";
};

const handleLogout = () => {
  clearCookie(SESSION_COOKIE_NAME);
  window.location.reload();
};

const handleLogin = () => {
  window.location.href = "https://console.easemob.com/user/login";
};

const handleRegister = () => {
  window.location.href = "https://console.easemob.com/user/register";
};
</script>

<template>
  <Navbar>
    <template #endBefore>
      <div class="search-box" @click="handleSearch">
        <div class="search-input-wrapper">
          <div class="search-icon"></div>
          <div class="search-input">搜索关键词</div>
        </div>
      </div>

      <el-link v-for="item in extraNavList" :key="item.text" class="extra-link" :type="item.type" :href="item.link"
        :underline="false">
        {{ item.text }}
      </el-link>

      <div v-if="isLoggedIn" class="account-wrapper" :class="{ 'is-mobile-open': isMobileAccountMenuOpen }">
        <button type="button" class="account-trigger" @click.stop="toggleAccountMenu">
          <span class="account-name">{{ userName }}</span>
          <svg class="account-arrow" width="20" height="20" xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
            <path fill='currentColor' d='M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z' />
          </svg>
        </button>

        <div class="account-dropdown">
          <button type="button" class="account-dropdown-item" @click="openConsole">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path
                d="M10.4575 16.2905C9.9207 16.2905 9.48535 15.8552 9.48535 15.3184V11.916C9.48546 11.3793 9.92077 10.9444 10.4575 10.9443H15.3179C15.8547 10.9443 16.2899 11.3792 16.29 11.916V15.3184C16.29 15.8552 15.8547 16.2905 15.3179 16.2905H10.4575ZM10.8853 14.8906H14.8901V12.3442H10.8853V14.8906ZM3.10889 14.8906H7.11377V9.42773H3.10889V14.8906ZM10.8853 8.57227H14.8901V3.10938H10.8853V8.57227ZM7.5415 1.70947C8.07832 1.70953 8.51367 2.14481 8.51367 2.68164V6.08398C8.51357 6.62072 8.07825 7.05561 7.5415 7.05566H2.68115C2.14436 7.05566 1.70909 6.62075 1.70898 6.08398V2.68164C1.70898 2.14478 2.14429 1.70947 2.68115 1.70947H7.5415ZM3.10889 5.65576H7.11377V3.10938H3.10889V5.65576ZM8.51367 15.3184C8.51367 15.8552 8.07832 16.2905 7.5415 16.2905H2.68115C2.14429 16.2905 1.70898 15.8552 1.70898 15.3184V9C1.70898 8.46314 2.14429 8.02783 2.68115 8.02783H7.5415C8.07832 8.02788 8.51367 8.46317 8.51367 9V15.3184ZM16.29 9C16.29 9.53686 15.8547 9.97217 15.3179 9.97217H10.4575C9.9207 9.97212 9.48535 9.53683 9.48535 9V2.68164C9.48535 2.14481 9.9207 1.70953 10.4575 1.70947H15.3179C15.8547 1.70947 16.29 2.14478 16.29 2.68164V9Z"
                fill="currentColor" fill-opacity="0.85" />
            </svg>
            <span>我的控制台</span>
          </button>
          <button type="button" class="account-dropdown-item" @click="handleLogout">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path fill-rule="evenodd" clip-rule="evenodd"
                d="M9.0459 2.75C9.46011 2.75 9.7959 3.08579 9.7959 3.5C9.7959 3.91421 9.46011 4.25 9.0459 4.25H8.2998C7.44746 4.25 6.85322 4.25127 6.39062 4.28906C5.93685 4.32615 5.67601 4.3945 5.47852 4.49512C5.05515 4.71083 4.71083 5.05515 4.49512 5.47852C4.3945 5.67601 4.32615 5.93685 4.28906 6.39062C4.25127 6.85322 4.25 7.44745 4.25 8.2998V10.2002C4.25 11.0525 4.25127 11.6468 4.28906 12.1094C4.32614 12.5632 4.3945 12.824 4.49512 13.0215C4.71083 13.4448 5.05515 13.7892 5.47852 14.0049C5.67602 14.1055 5.93683 14.1748 6.39062 14.2119C6.85322 14.2497 7.44748 14.25 8.2998 14.25H9.0459C9.46011 14.25 9.7959 14.5858 9.7959 15C9.7959 15.4142 9.46011 15.75 9.0459 15.75H8.2998C7.47222 15.75 6.80638 15.751 6.26855 15.707C5.72216 15.6624 5.24191 15.5679 4.79785 15.3418C4.09254 14.9824 3.51871 14.4084 3.15918 13.7031C2.93284 13.2589 2.83861 12.7781 2.79395 12.2314C2.75 11.6936 2.75 11.0278 2.75 10.2002V8.2998C2.75 7.4722 2.75 6.80639 2.79395 6.26855C2.8386 5.72201 2.93291 5.24201 3.15918 4.79785C3.51869 4.09234 4.09234 3.51869 4.79785 3.15918C5.24201 2.93291 5.72201 2.8386 6.26855 2.79395C6.80639 2.75 7.4722 2.75 8.2998 2.75H9.0459ZM11.3945 5.64453C11.6874 5.35176 12.1622 5.35168 12.4551 5.64453L15.5303 8.71973C15.583 8.77251 15.6235 8.83304 15.6572 8.89551C15.6693 8.91777 15.6826 8.93934 15.6924 8.96289C15.7034 8.98952 15.7099 9.01743 15.7178 9.04492C15.7232 9.06409 15.7304 9.08278 15.7344 9.10254C15.7353 9.10706 15.7355 9.11168 15.7363 9.11621C15.7442 9.15972 15.75 9.20423 15.75 9.25C15.75 9.29505 15.7449 9.33897 15.7373 9.38184C15.728 9.43448 15.713 9.48607 15.6924 9.53613C15.6843 9.55562 15.6727 9.57318 15.6631 9.5918C15.6284 9.65904 15.5866 9.72391 15.5303 9.78027L12.4551 12.8564C12.1623 13.1491 11.6874 13.1489 11.3945 12.8564C11.1017 12.5636 11.1017 12.0888 11.3945 11.7959L13.1895 10H7.5C7.08579 10 6.75 9.66421 6.75 9.25C6.75 8.83579 7.08579 8.5 7.5 8.5H13.1895L11.3945 6.70508C11.1016 6.41218 11.1016 5.93742 11.3945 5.64453Z"
                fill="currentColor" />
            </svg>
            <span>退出登录</span>
          </button>
        </div>
      </div>

      <div v-else class="auth-actions">
        <button type="button" @click="handleLogin" class="auth-link">登录</button>
        <button type="button" @click="handleRegister" class="auth-link auth-link-primary">注册</button>
      </div>
    </template>
  </Navbar>
</template>

<style scoped>
.search-box {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  border-radius: 6px;
  padding: 0 0.75em;
  border: 1px solid #dce2e6;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 14.625rem;
  height: 1.875rem;
}

.search-box:hover {
  border-color: var(--theme-color);
}

.search-input-wrapper {
  display: flex;
  align-items: center;
}

.search-input {
  user-select: none;
  background-color: transparent;
  color: #a8abb2;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.375rem;
  width: fit-content;
  margin-left: 6px;
  cursor: pointer;
  white-space: nowrap;
}

.search-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 0.875rem;
  height: 0.875rem;
  background-image: url(/icon-search.svg);
  background-repeat: no-repeat;
  cursor: pointer;
}

.extra-link {
  padding: 0.3125rem 1rem;
  margin: 0 !important;
  color: #606466;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.375rem;
}

.extra-link:not(:last-of-type):hover {
  color: var(--theme-color);
}

.extra-link:last-of-type {
  padding: 0.25rem 0.9375rem;
  color: var(--theme-color);
  border-radius: 0.375rem;
  border: 1px solid var(--theme-color);
  background: #ecf8ff;
}

.extra-link:last-of-type:hover {
  color: #fff;
  background: var(--theme-color);
}

.extra-link.is-underline:hover:after {
  border-bottom: 0;
}

.auth-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-left: 1rem;
}

.account-wrapper {
  position: relative;

  &::after {
    content: "";
    position: absolute;
    top: 100%;
    right: 0;
    width: 164px;
    height: 1rem;
  }

  &:hover {
    .account-trigger {
      color: var(--theme-color);
    }

    .account-dropdown {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
      pointer-events: auto;
    }

    .account-arrow {
      transform: rotate(180deg);
    }
  }
}

.auth-link {
  border: 0;
  background: transparent;
  color: #606466;
  font-size: 0.875rem;
  line-height: 1.375rem;
  cursor: pointer;
}

.auth-link:hover {
  color: var(--theme-color);
}

.auth-link-primary {
  height: 2.125rem;
  padding: 0 0.9375rem;
  color: var(--theme-color) !important;
  border-radius: 0.375rem;
  border: 1px solid var(--theme-color);
  background: #ecf8ff;
}

.auth-link-primary:hover {
  color: #fff !important;
  background: var(--theme-color);
}

.account-trigger {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
  color: #303233;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 22px;

  &:hover {
    color: var(--theme-color);
  }
}

.account-name {
  max-width: 11rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.account-arrow {
  flex-shrink: 0;
  transform-origin: center;
  transition: transform 0.22s ease;
  will-change: transform;
}

.account-dropdown {
  position: absolute;
  top: calc(100% + 1rem);
  right: 0;
  display: flex;
  width: 164px;
  padding: 4px 0;
  flex-direction: column;
  align-items: flex-start;
  overflow: hidden;
  border-radius: 6px;
  background: #fff;
  box-shadow:
    0 3px 6px -4px rgba(0, 106, 172, 0.12),
    0 6px 16px 0 rgba(0, 0, 0, 0.08),
    0 9px 28px 8px rgba(0, 0, 0, 0.05);
  opacity: 0;
  visibility: hidden;
  transform: translateY(0.5rem);
  pointer-events: none;
  transition:
    opacity 0.2s ease,
    visibility 0.2s ease,
    transform 0.2s ease;
}

.account-dropdown-item {
  display: flex;
  align-items: center;
  align-self: stretch;
  gap: 8px;
  padding: 5px 12px;
  border: 0;
  background: #fff;
  color: #2f3437;
  text-align: left;
  cursor: pointer;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 22px;

  &:hover {
    color: var(--theme-color);
  }
}

.account-dropdown-item+.account-dropdown-item {
  border-top: 1px solid #f0f3f5;
}

.account-dropdown-item:hover {
  background: #f5f5f5;
}

@media (max-width: 1380px) {
  .search-box {
    width: 10rem;
  }

  .search-input {
    font-size: 13px;
    width: auto;
  }

  .extra-link {
    width: auto;
    padding: 0 0.6rem;
  }

  .account-name {
    max-width: 8.5rem;
  }
}

@media (max-width: 1300px) {
  .search-box {
    width: 36px;
    min-width: 36px;
    height: 36px;
    padding: 0;
    justify-content: center;
    border: none;
    background-color: transparent;
  }

  .search-input {
    display: none;
  }

  .search-input-wrapper {
    width: 100%;
    justify-content: center;
  }

  .search-icon {
    width: 18px;
    font-size: 14px;
  }

  .extra-link {
    width: auto;
    min-width: auto;
    padding: 0 0.5rem;
    font-size: 13px;
  }

  .auth-actions {
    gap: 0.25rem;
  }

  .auth-link {
    font-size: 13px;
  }

  .auth-link-primary {
    height: 1.875rem;
    padding: 0 0.75rem;
  }

  .account-trigger {
    min-width: 3.25rem;
    height: 2rem;
    gap: 0.4rem;
    padding: 0 0.625rem;
    border-radius: 999px;
  }

  .account-name {
    display: inline;
    max-width: 5.5rem;
    font-size: 13px;
    line-height: 20px;
  }

  .account-dropdown {
    right: -0.5rem;
    top: calc(100% + 0.5rem);
    width: 9.5rem;
  }

  .account-wrapper::after {
    display: none;
  }

  .account-wrapper:hover .account-dropdown {
    opacity: 0;
    visibility: hidden;
    transform: translateY(0.5rem);
    pointer-events: none;
  }

  .account-wrapper:hover .account-arrow {
    transform: none;
  }

  .account-wrapper.is-mobile-open .account-trigger {
    color: var(--theme-color);
  }

  .account-wrapper.is-mobile-open .account-dropdown {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
    pointer-events: auto;
  }

  .account-wrapper.is-mobile-open .account-arrow {
    transform: rotate(180deg);
  }
}

@media (max-width: 419px) {
  .search-box {
    width: 32px;
    min-width: 32px;
    height: 32px;
    border: none;
    background-color: transparent;
  }

  .search-icon {
    width: 16px;
    font-size: 13px;
  }

  .extra-link {
    padding: 0 0.4rem;
    font-size: 12px;
  }

  .auth-link {
    font-size: 12px;
  }

  .auth-link-primary {
    padding: 0 0.65rem;
  }

  .account-name {
    max-width: 4.5rem;
    font-size: 12px;
  }

  .account-trigger {
    min-width: 3rem;
    height: 1.875rem;
    padding: 0 0.5rem;
  }

  .account-dropdown {
    right: -0.75rem;
    width: 8.75rem;
  }
}
</style>

<style>
.back-to-top {
  bottom: 3rem;
  width: 50px;
  height: 50px;
  border-radius: 25px;
}
</style>
