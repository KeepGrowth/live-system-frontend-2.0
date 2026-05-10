// src/directives/preventReClick.js
export default {
  mounted(el, binding) {
    // 存储定时器，方便清理
    let timer = null;

    // 1. 点击防重复逻辑
    const handleClick = () => {
      if (!el.disabled) {
        el.disabled = true;

        // 清除旧定时器
        if (timer) clearTimeout(timer);

        timer = setTimeout(() => {
          el.disabled = false;
        }, binding.value || 2000);
      }
    };

    // 2. 监听外部 disabled 属性变化（关键！）
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'disabled') {
          // 外部把按钮禁用了 → 清除防重复点击的定时器
          if (el.disabled && timer) {
            clearTimeout(timer);
            timer = null;
          }
        }
      });
    });

    // 开始监听 disabled 属性
    observer.observe(el, { attributes: true });

    // 绑定点击事件
    el.addEventListener('click', handleClick);

    // 3. 指令销毁时清理
    el._observer = observer;
    el._clickHandler = handleClick;
  },

  // 指令销毁时清除监听和定时器
  unmounted(el) {
    if (el._clickHandler) {
      el.removeEventListener('click', el._clickHandler);
    }
    if (el._observer) {
      el._observer.disconnect();
    }
    if (el._timer) clearTimeout(el._timer);
  }
};
