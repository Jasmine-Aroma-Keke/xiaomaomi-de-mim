import {useRef,useState, type ChangeEvent, type FormEvent} from 'react';
import {legacyRequest as request} from '@/services/api';
type ResultProps = {onResult: (message: string) => void};
function Generator({onResult}: ResultProps){
 const [publicText,setPublic]=useState('https://example.com');
 const [secret,setSecret]=useState('来自喵星人的问候');
 const [key,setKey]=useState('');const [preview,setPreview]=useState('');const [busy,setBusy]=useState(false);
 async function generate(e: FormEvent<HTMLFormElement>){e.preventDefault();setBusy(true);try{const data=await request('generate',{public:publicText,secret,key});setPreview('data:image/png;base64,'+String(data.png));onResult('PNG 已生成。普通扫码状态：待验证。')}catch(e){onResult(e instanceof Error ? e.message : '操作失败')}finally{setBusy(false)}}
 return <section><h2>制作秘密载体</h2><form onSubmit={generate}>
 <label htmlFor="public">公开信息</label><textarea id="public" required value={publicText} onChange={e=>setPublic(e.target.value)}/>
 <label htmlFor="secret">秘密文本</label><textarea id="secret" value={secret} onChange={e=>setSecret(e.target.value)}/>
 <label htmlFor="key">密钥（可留空）</label><input id="key" type="password" autoComplete="off" value={key} onChange={e=>setKey(e.target.value)}/>
 <button disabled={busy}>{busy?'正在生成…':'生成 PNG'}</button>{preview&&<a className="download" href={preview} download="cat-secret.png">下载图片</a>}
 </form>{preview&&<img id="preview" src={preview} alt="生成的猫咪二维码"/>}<p className="note">密钥控制位置及消息校验，不提供内容加密。下载后请用手机扫码验证公开信息。</p></section>
}
function Inspector({result,onResult}: ResultProps & {result: string}){
 const [png,setPng]=useState('');const [key,setKey]=useState('');const [reading,setReading]=useState(false);const [busy,setBusy]=useState('');const readerRef=useRef<FileReader | null>(null);
 function select(e: ChangeEvent<HTMLInputElement>){readerRef.current?.abort();setPng('');setReading(false);const file=e.target.files?.[0];if(!file)return;
 if(file.size>5500000)return onResult('图片不能超过 5.5 MB');if(file.type!=='image/png')return onResult('请选择 PNG 无损图片');
 const reader=new FileReader();readerRef.current=reader;setReading(true);reader.onload=()=>{setPng(String(reader.result).split(',')[1]);setReading(false);onResult('图片已就绪，可以提取或检测。')};reader.onerror=()=>{setReading(false);onResult('读取失败，请重新选择')};reader.readAsDataURL(file)}
 async function inspect(action: 'extract' | 'detect'){setBusy(action);try{onResult(JSON.stringify(await request(action,{png,key}),null,2))}catch(e){onResult(e instanceof Error ? e.message : '操作失败')}finally{setBusy('')}}
 return <section><h2>读取与检查</h2><label htmlFor="file">选择本系统生成的 PNG</label><input id="file" type="file" accept="image/png" onChange={select} disabled={!!busy}/>
 <label htmlFor="readkey">提取密钥</label><input id="readkey" type="password" autoComplete="off" value={key} onChange={e=>setKey(e.target.value)}/>
 <button disabled={!png||reading||!!busy} onClick={()=>inspect('extract')}>{busy==='extract'?'正在提取…':'提取并校验'}</button>
 <button disabled={!png||reading||!!busy} onClick={()=>inspect('detect')}>{busy==='detect'?'正在检测…':'统计检测'}</button>
 <div id="result" role="status" aria-live="polite">{reading?'正在读取图片…':result}</div><p className="note">秘密恢复、消息完整性、统计检测分别报告。统计模块与实验图表等待成员提交真实结果。</p></section>
}
export default function LegacyWorkbench(){const [result,setResult]=useState('选择图片后开始检查。');return <div className="legacy"><header><h1>小猫咪的秘密</h1><p>一张图，两层信息。扫码阅读公开内容，用密钥取回猫咪藏好的秘密。</p><p className="note">集成基线 v1 · PNG 无损载体 · 猫咪与二维码并置，完整保留二维码静区</p></header><article><Generator onResult={setResult}/><Inspector result={result} onResult={setResult}/></article><footer className="note">实验约定：二维码在 JPEG 压缩后可扫码，也需要单独验证秘密信息能否恢复。</footer></div>}
