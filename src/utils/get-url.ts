const getUrl = (url: string): string => {
    if (import.meta.env.MODE === 'development') {
        return import.meta.env.VITE_APP_DEV_API_URL + '/' + url;
    } else {
        return window.webConfig.VITE_APP_PROD_API_URL + '/' + url;
    }
}

export default getUrl
