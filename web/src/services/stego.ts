import { legacyRequest } from './api';
import type { GenerateResult, ExtractResult } from '@/types/stego';
export async function generate(publicText: string, secret: string, key: string): Promise<GenerateResult> {
  const data = await legacyRequest('generate', { public: publicText, secret, key });
  if(typeof data.png !== 'string' || !data.png || typeof data.capacity_bytes !== 'number' || !Number.isFinite(data.capacity_bytes) || data.capacity_bytes<0 || typeof data.scan_status!=='string') throw Error('生成服务返回格式异常');
  return {png:data.png, capacity_bytes:data.capacity_bytes, scan_status:String(data.scan_status)};
}
export async function extract(png: string, key: string): Promise<ExtractResult> {
  const data = await legacyRequest('extract',{png,key});
  if(!['passed','failed','unknown'].includes(String(data.status)) || typeof data.detail !== 'string' || (data.status==='passed' && typeof data.secret!=='string')) throw Error('提取服务返回格式异常');
  return {status:data.status as ExtractResult['status'], secret:typeof data.secret==='string'?data.secret:null, detail:data.detail};
}
