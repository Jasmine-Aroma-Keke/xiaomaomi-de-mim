import {afterEach,describe,it,expect,vi} from 'vitest';
afterEach(()=>{vi.unstubAllEnvs();vi.resetModules()});
describe('服务模式与错误状态',()=>{
 it('Mock 模式不发送 HTTP 请求',async()=>{
  vi.stubEnv('VITE_USE_MOCK','true');vi.resetModules();
  const {api,legacyRequest}=await import('../src/services/api');const spy=vi.spyOn(api,'post');
  const result=await legacyRequest('detect',{});expect(result.is_mock).toBe(true);expect(result.status).toBe('unavailable');expect(spy).not.toHaveBeenCalled();
 });
 it('真实模式使用当前基线接口',async()=>{
  vi.stubEnv('VITE_USE_MOCK','false');vi.resetModules();const {api,legacyRequest}=await import('../src/services/api');
  const spy=vi.spyOn(api,'post').mockResolvedValue({data:{status:'unknown'}});expect(await legacyRequest('extract',{png:'x',key:''})).toEqual({status:'unknown'});expect(spy).toHaveBeenCalledWith('/extract',{png:'x',key:''});
 });
 it.each([['ECONNABORTED',undefined,'服务响应超时'],['ERR_BAD_REQUEST',404,'尚未提供此接口'],['ERR_NETWORK',undefined,'无法连接服务']])('处理 %s',async(code,status,message)=>{
  vi.stubEnv('VITE_USE_MOCK','false');vi.resetModules();const {api,legacyRequest}=await import('../src/services/api');vi.spyOn(api,'post').mockRejectedValue({isAxiosError:true,code,response:status?{status,data:{}}:undefined});await expect(legacyRequest('extract',{})).rejects.toThrow(String(message));
 });
 it('拒绝格式异常的成功响应',async()=>{
  vi.stubEnv('VITE_USE_MOCK','false');vi.resetModules();const {api}=await import('../src/services/api');vi.spyOn(api,'post').mockResolvedValue({data:{status:'passed'}});const {extract}=await import('../src/services/stego');await expect(extract('x','')).rejects.toThrow('格式异常');
 });
});
