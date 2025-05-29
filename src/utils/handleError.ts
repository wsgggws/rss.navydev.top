import { ElMessage } from "element-plus";

/**
 * 通用的错误处理函数，用于展示后端返回的错误信息。
 * @param err 后端返回的 error 对象（通常是 AxiosError）
 * @param fallbackMessage 默认错误提示信息
 */
export function handleApiError(err: any, fallbackMessage = "操作失败") {
  const detail = err?.response?.data?.detail || err?.message || fallbackMessage;

  if (typeof detail === "string") {
    if (detail.includes("has been subscribed")) {
      ElMessage.info("你已订阅过该源");
    } else {
      ElMessage.error(detail);
    }
  } else {
    ElMessage.error(fallbackMessage);
  }
}
