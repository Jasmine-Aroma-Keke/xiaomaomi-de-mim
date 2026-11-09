import {beforeEach,describe,it,expect,vi} from 'vitest';
import {attackImage,difference,histogram} from '../src/utils/experiments';
const contexts=new WeakMap<HTMLCanvasElement,{data:Uint8ClampedArray;drawImage:ReturnType<typeof vi.fn>;getImageData:()=>{data:Uint8ClampedArray};putImageData:(v:{data:Uint8ClampedArray})=>void;createImageData:()=>{data:Uint8ClampedArray};fillRect:ReturnType<typeof vi.fn>;translate:ReturnType<typeof vi.fn>;rotate:ReturnType<typeof vi.fn>}>();
beforeEach(()=>{
 Object.defineProperty(Image.prototype,'decode',{configurable:true,value:async function(this:HTMLImageElement){this.width=this.src.includes('different-size')?3:2;this.height=2;}});
 vi.spyOn(HTMLCanvasElement.prototype,'getContext').mockImplementation(function(this:HTMLCanvasElement){
  if(!contexts.has(this)){const ctx={data:new Uint8ClampedArray([100,100,100,255,100,100,100,255,100,100,100,255,100,100,100,255]),drawImage:vi.fn(),getImageData:()=>({data:ctx.data.slice()}),putImageData:(v:{data:Uint8ClampedArray})=>{ctx.data=v.data},createImageData:()=>({data:new Uint8ClampedArray(16)}),fillRect:vi.fn(),translate:vi.fn(),rotate:vi.fn()};ctx.drawImage.mockImplementation((img:HTMLImageElement)=>{if(img.src?.includes('one-change'))ctx.data[0]=101});contexts.set(this,ctx)}return contexts.get(this) as unknown as CanvasRenderingContext2D;
 } as HTMLCanvasElement['getContext']);
 vi.spyOn(HTMLCanvasElement.prototype,'toDataURL').mockImplementation(function(this:HTMLCanvasElement,type?:string,quality?:number){return JSON.stringify({width:this.width,height:this.height,type,quality,data:Array.from(contexts.get(this)?.data??[])})});
});
describe('像素实验规则（编码器使用测试替身）',()=>{
 it('RGB 直方图不计透明度',async()=>{const h=await histogram('sample');expect(h[100]).toBe(12);expect(h.reduce((a,b)=>a+b,0)).toBe(12)});
 it('能够发现一个通道的最低位变化',async()=>{const result=await difference('sample','one-change');expect(result.changed).toBe(1);expect(result.total).toBe(4);expect(result.max).toBe(1)});
 it('拒绝不同尺寸差异比较',async()=>{await expect(difference('sample','different-size')).rejects.toThrow('尺寸必须一致')});
 it.each(['jpeg','gaussian','salt','crop','rotate','occlude'] as const)('%s 零强度保持原像素',async attack=>{const result=JSON.parse(await attackImage('sample',attack,0));expect(result.width).toBe(2);expect(result.data[0]).toBe(100)});
 it('固定种子噪声可复现且改变实际像素',async()=>{const a=await attackImage('sample','gaussian',100);expect(a).toBe(await attackImage('sample','gaussian',100));expect(JSON.parse(a).data.slice(0,3)).not.toEqual([100,100,100])});
});
