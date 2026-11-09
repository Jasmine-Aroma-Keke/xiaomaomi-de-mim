// Deterministic, session-only demonstration. This is not a steganography algorithm.
interface Entry {secret:string;keyDigest:string}
const entries=new Map<string,Entry>();
async function digest(value:string){return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value)))).map(v=>v.toString(16).padStart(2,'0')).join('');}
export async function mockRequest(action:string,payload:Record<string,unknown>):Promise<Record<string,unknown>>{
 if(action==='detect')return {status:'unavailable',detail:'演示模式：统计模块未实现，不提供检测分数或结论',is_mock:true};
 if(action==='generate'){
  const publicText=String(payload.public??''),secret=String(payload.secret??''),key=String(payload.key??'');
  if(!publicText||new TextEncoder().encode(publicText).length>1200)throw Error('公开信息应为 1–1200 字节');
  if(new TextEncoder().encode(secret).length>11960)throw Error('秘密超过 11960 字节容量');
  const keyDigest=await digest(key),hash=await digest(JSON.stringify([publicText,secret,keyDigest]));
  const canvas=document.createElement('canvas');canvas.width=520;canvas.height=320;const ctx=canvas.getContext('2d');if(!ctx)throw Error('浏览器无法创建演示图片');
  ctx.fillStyle='#ffffff';ctx.fillRect(0,0,520,320);ctx.fillStyle='#18233a';ctx.font='24px sans-serif';ctx.fillText('演示模式 · 非可扫码二维码',25,40);ctx.font='14px sans-serif';ctx.fillText('仅演示交互，不执行隐写算法',25,70);
  for(let i=0;i<hash.length;i++){ctx.fillStyle=parseInt(hash[i],16)>7?'#263358':'#a78bfa';ctx.fillRect(25+(i%16)*15,95+Math.floor(i/16)*15,10,10);}
  ctx.fillStyle='#a78bfa';ctx.beginPath();ctx.moveTo(340,230);ctx.lineTo(340,110);ctx.lineTo(380,145);ctx.lineTo(420,145);ctx.lineTo(460,110);ctx.lineTo(460,230);ctx.closePath();ctx.fill();ctx.fillStyle='#263358';ctx.fillRect(370,180,10,8);ctx.fillRect(420,180,10,8);ctx.font='12px monospace';ctx.fillText(hash.slice(0,32),25,280);
  const png=canvas.toDataURL('image/png').split(',')[1];entries.set(png,{secret,keyDigest});
  return {png,capacity_bytes:11960,scan_status:'unverified',is_mock:true};
 }
 if(action==='extract'){
  const entry=entries.get(String(payload.png));
  if(!entry||entry.keyDigest!==await digest(String(payload.key??'')))return {status:'unknown',secret:null,detail:'演示模式：非本次会话生成的原样图片，或密钥不一致；不执行真实提取',is_mock:true};
  return {status:'passed',secret:entry.secret,detail:'演示模式：仅从本会话内存取回文本，未执行真实提取或完整性认证',is_mock:true};
 }
 throw Error('演示模式没有实现此操作');
}
