// src/composables/useMediaQuery.ts

import { onMounted, onUnmounted, ref, Ref, watchEffect } from 'vue';

/**
 * A Vue composable that tracks the state of a CSS media query.
 * 
 * @param query - The media query string to evaluate.
 * @returns A Ref<boolean> that indicates if the media query matches.
 */
export default function useMediaQuery(query: string): Ref<boolean> {
    const matches = ref(false);
    let mediaQueryList: MediaQueryList;

    const updateMatches = () => {
        matches.value = mediaQueryList.matches;
    };

    onMounted(() => {
        mediaQueryList = window.matchMedia(query);
        updateMatches(); // 初始化时检查当前匹配状态
        mediaQueryList.addEventListener('change', updateMatches); // 监听媒体查询的变化
    });

    onUnmounted(() => {
        mediaQueryList.removeEventListener('change', updateMatches); // 清理监听器
    });

    watchEffect((onInvalidate) => {
        onInvalidate(() => {
            if (mediaQueryList) {
                mediaQueryList.removeEventListener('change', updateMatches);
            }
        });
    });

    return matches;
}
