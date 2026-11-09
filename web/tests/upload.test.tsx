import {afterEach,describe,it,expect,vi} from 'vitest';
import {render,screen,fireEvent,cleanup,waitFor} from '@testing-library/react';
import {ImageUpload} from '../src/components/upload/ImageUpload';
afterEach(cleanup);
describe('图片上传输入约束',()=>{
 it('拒绝 JPEG，清除旧图，显示中文原因',async()=>{
  const change=vi.fn();render(<ImageUpload onChange={change}/>);fireEvent.change(screen.getByLabelText('选择 PNG 图片'),{target:{files:[new File(['x'],'cat.jpg',{type:'image/jpeg'})]}});expect(change).toHaveBeenCalledWith(null);expect(await screen.findByRole('alert')).toHaveProperty('textContent','当前载体仅支持 PNG');
 });
 it('拒绝超限文件且不提交图像',async()=>{
  const change=vi.fn();render(<ImageUpload onChange={change}/>);fireEvent.change(screen.getByLabelText('选择 PNG 图片'),{target:{files:[new File([new Uint8Array(5_500_001)],'big.png',{type:'image/png'})]}});expect((await screen.findByRole('alert')).textContent).toContain('5.5 MB');expect(change).toHaveBeenCalledTimes(1);
 });
 it('禁用状态拒绝拖入文件',()=>{
  const change=vi.fn();render(<ImageUpload disabled onChange={change}/>);fireEvent.drop(screen.getByText('选择 PNG 图片'),{dataTransfer:{files:[new File(['x'],'cat.png',{type:'image/png'})]}});expect(change).not.toHaveBeenCalled();
 });
 it('损坏 PNG 显示错误并退出读取状态',async()=>{
  Object.defineProperty(Image.prototype,'decode',{configurable:true,value:vi.fn().mockRejectedValue(Error('无法解码图片'))});render(<ImageUpload onChange={vi.fn()}/>);fireEvent.change(screen.getByLabelText('选择 PNG 图片'),{target:{files:[new File(['broken'],'cat.png',{type:'image/png'})]}});await waitFor(()=>expect(screen.getByRole('alert').textContent).toContain('无法解码'));expect(screen.queryByText('正在读取图片…')).toBeNull();delete (Image.prototype as unknown as {decode?:unknown}).decode;
 });
});
