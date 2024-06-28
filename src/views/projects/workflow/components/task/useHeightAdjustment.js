import { onMounted, onBeforeUnmount } from 'vue';

export function useHeightAdjustment( ifRun ) {
    onMounted(() => {
        const isIframe = window.webConfig.VITE_APP_PROD_IS_IFRAME === 1;
        if (isIframe) {
            if(ifRun) {
                document.documentElement.style.setProperty('--run-box-height-adjustment', '36px');
            } else {
                document.documentElement.style.setProperty('--save-box-height-adjustment', '20px');
            }
        } else {
            if(ifRun) {
                document.documentElement.style.setProperty('--run-box-height-adjustment', '100px');
            } else {
                document.documentElement.style.setProperty('--save-box-height-adjustment', '100px');
            }
        }
    });
}
