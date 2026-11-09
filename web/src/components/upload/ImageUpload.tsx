import {useRef,useState, type DragEvent} from 'react';
import {UploadCloud} from 'lucide-react';
export interface UploadedImage {png:string; url:string; name:string}
export function ImageUpload({onChange,label='选择 PNG 图片',disabled=false}:{onChange:(image:UploadedImage|null)=>void;label?:string;disabled?:boolean}) {
  const [error,setError]=useState('');const [name,setName]=useState('');const [busy,setBusy]=useState(false);const sequence=useRef(0);
  async function read(file?:File){const id=++sequence.current;onChange(null);setName('');setError('');setBusy(false);if(!file)return;
    if(file.size>5_500_000){setError('请选择不超过 5.5 MB 的 PNG');return}if(file.type!=='image/png'){setError('当前载体仅支持 PNG');return}
    setBusy(true);try{const url=await new Promise<string>((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(String(r.result));r.onerror=()=>reject(Error('文件读取失败'));r.readAsDataURL(file)});
      const image=new Image();image.src=url;await image.decode();if(image.width*image.height>4_000_000)throw Error('图片不能超过 400 万像素');
      if(id===sequence.current){setName(file.name);onChange({url,png:url.split(',')[1],name:file.name})}
    }catch(e){if(id===sequence.current)setError(e instanceof Error?e.message:'无法读取图片')}finally{if(id===sequence.current)setBusy(false)}}
  function drop(e:DragEvent<HTMLLabelElement>){e.preventDefault();if(!disabled)void read(e.dataTransfer.files[0])}
  return <div><label className={`upload-zone ${disabled?'opacity-50':''}`} onDragOver={e=>e.preventDefault()} onDrop={drop}><UploadCloud size={24} aria-hidden="true"/><strong>{busy?'正在读取图片…':name||label}</strong><span>拖拽到此处，或点击选择 · PNG，最多 5.5 MB</span><input type="file" accept="image/png" disabled={disabled} aria-label={label} onChange={e=>{void read(e.target.files?.[0]);e.target.value=''}}/></label>{error&&<p role="alert" className="mt-3 text-sm text-red-400">{error}</p>}</div>
}
