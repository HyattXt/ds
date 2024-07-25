import getUrl from "@/utils/get-url";

const formatTimestamp = (timestamp) => {
    // 创建一个新的Date对象
    let date = new Date(timestamp);

    let year = date.getFullYear();
    let month = String(date.getMonth() + 1).padStart(2, '0');
    let day = String(date.getDate()).padStart(2, '0');
    let hours = String(date.getHours()).padStart(2, '0');
    let minutes = String(date.getMinutes()).padStart(2, '0');
    let seconds = String(date.getSeconds()).padStart(2, '0');

    // 拼接成最终的字符串
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export default formatTimestamp
