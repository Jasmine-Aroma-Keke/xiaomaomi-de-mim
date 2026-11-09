import {afterEach,beforeEach,describe,it,expect,vi} from 'vitest';
import {webcrypto} from 'node:crypto';
import {mockRequest} from '../src/mocks/lab';
beforeEach(()=>{
 vi.stubGlobal('crypto',webcrypto);
 const records=new WeakMap<HTMLCanvasElement,unknown[]>();
 vi.spyOn(HTMLCanvasElement.prototype,'getContext').mockImplementation(function(this:HTMLCanvasElement){const log:unknown[]=[];records.set(this,log);return {fillRect:(...v:unknown[])=>log.push(v),fillText:(...v:unknown[])=>log.push(v),beginPath:()=>{},moveTo:()=>{},lineTo:()=>{},closePath:()=>{},fill:()=>{}} as unknown as CanvasRenderingContext2D} as HTMLCanvasElement['getContext']);
 vi.spyOn(HTMLCanvasElement.prototype,'toDataURL').mockImplementation(function(this:HTMLCanvasElement){return 'data:image/png;base64,'+btoa(unescape(encodeURIComponent(JSON.stringify(records.get(this)))))});
});
afterEach(()=>vi.unstubAllGlobals());
describe('确定性的会话演示（Canvas 测试替身）',()=>{
 it('相同输入相同预览，不同消息不同预览；原样图与密钥可取回原文',async()=>{
  const input={public:'公开文本',secret:'中文🐱',key:'test'};const a=await mockRequest('generate',input),b=await mockRequest('generate',input),c=await mockRequest('generate',{...input,secret:'另一个消息'});expect(a.png).toBe(b.png);expect(a.png).not.toBe(c.png);expect(a.is_mock).toBe(true);
  const result=await mockRequest('extract',{png:a.png,key:'test'});expect(result.secret).toBe('中文🐱');expect(result.detail).toContain('未执行真实提取');
 });
 it('错误密钥或修改后的图片不声称提取成功',async()=>{
  const image=await mockRequest('generate',{public:'test',secret:'secret',key:'key'});expect((await mockRequest('extract',{png:image.png,key:'wrong'})).status).toBe('unknown');expect((await mockRequest('extract',{png:'changed',key:'key'})).status).toBe('unknown');
 });
});
