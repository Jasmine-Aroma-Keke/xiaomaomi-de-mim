import axios from 'axios';
import {USE_MOCK} from './config';
export const api = axios.create({baseURL: import.meta.env.VITE_API_BASE_URL || '/api', timeout: 30000});
// Existing Python baseline only; the planned FastAPI endpoints are not yet connected.
export async function legacyRequest(action: string, payload: Record<string, unknown>): Promise<Record<string, unknown>> {
  if(USE_MOCK) return (await import('@/mocks/lab')).mockRequest(action,payload);
  try { return (await api.post<Record<string, unknown>>(`/${action}`, payload)).data; }
  catch(error) {
    if (axios.isAxiosError<{error?: string}>(error)) {
      if(error.code==='ECONNABORTED')throw new Error('服务响应超时，请稍后重试');
      if(error.response?.status===404)throw new Error('当前后端尚未提供此接口，请检查服务版本与接口配置');
      throw new Error(error.response?.data?.error || (error.response ? `服务请求失败（${error.response.status}），请重试` : '无法连接服务，请检查后端是否启动'));
    }
    throw error;
  }
}
