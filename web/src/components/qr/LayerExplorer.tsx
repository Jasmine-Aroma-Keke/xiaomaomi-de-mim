import { useState } from 'react';
import { Cat, Eye, LockKeyhole } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';

export function LayerExplorer() {
  const [layer, setLayer] = useState<'public' | 'secret'>('public');
  const reduceMotion = useReducedMotion();
  return <section className="layer-explorer" aria-label="双层信息原理演示">
    <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
      <span className="flex items-center gap-2 text-sm"><Cat size={18} className="text-accent" aria-hidden="true"/>双层信息观察窗</span>
      <span className="text-xs text-muted-foreground">原理演示</span>
    </div>
    <div className="flex gap-2 px-5 pt-5" role="group" aria-label="选择信息层">
      {(['public', 'secret'] as const).map(value => <button key={value} type="button" aria-pressed={layer === value} onClick={() => setLayer(value)} className={`layer-tab ${layer === value ? 'is-selected' : ''}`}>
        {value === 'public' ? <Eye size={16} aria-hidden="true"/> : <LockKeyhole size={16} aria-hidden="true"/>}{value === 'public' ? '公开层' : '秘密层'}
      </button>)}
    </div>
    <div className="specimen-stage">
      <motion.div animate={{rotate: layer === 'secret' ? 0 : -3}} transition={{duration: reduceMotion ? 0 : 0.25}} className={`specimen ${layer === 'secret' ? 'specimen-secret' : ''}`}>
        <svg viewBox="0 0 240 240" role="img" aria-label="猫咪与二维码图案示意，不能扫码">
          <rect width="240" height="240" rx="8" fill="#fff"/>
          {[ [18,18],[174,18],[18,174] ].map(([x,y])=><g key={`${x}-${y}`}><rect x={x} y={y} width="48" height="48" fill="#18233a"/><rect x={x+8} y={y+8} width="32" height="32" fill="white"/><rect x={x+16} y={y+16} width="16" height="16" fill="#18233a"/></g>)}
          {Array.from({length:144},(_,i)=>{const x=18+(i%12)*17;const y=18+Math.floor(i/12)*17;const reserved=(x<70&&y<70)||(x>165&&y<70)||(x<70&&y>165)||(x>65&&x<165&&y>65&&y<170);return !reserved&&(i*7+i%5)%3!==0?<rect key={i} x={x} y={y} width="10" height="10" fill="#18233a"/>:null;})}
          <path d="M78 146 L78 82 L104 98 Q120 92 136 98 L162 82 L162 146 Q153 171 120 173 Q87 171 78 146" fill={layer==='secret'?'#a78bfa':'#d5d0ec'}/>
          <path d="M94 126 L103 126 M137 126 L146 126 M115 142 L120 147 L125 142 M120 147 L120 153" stroke="#27304c" strokeWidth="5" strokeLinecap="round" fill="none"/>
          {layer==='secret'&&<g fill="#5d398d">{[0,1,2,3,4,5].map(i=><rect key={i} x={89+i*11} y="157" width="5" height="5"/>)}</g>}
        </svg>
      </motion.div>
      <span className="specimen-caption">图案示意 · 非可扫码二维码</span>
    </div>
    <div className="mx-5 mb-5 rounded-xl bg-background p-4" role="status" aria-live="polite">
      <p className="mb-2 text-sm font-medium">{layer === 'public' ? '手机看到的世界' : '专用程序读取的世界'}</p>
      <p className="text-sm leading-6 text-muted-foreground">{layer === 'public' ? '公开文本由二维码承载，普通扫码工具即可读取。' : '在约定像素区域按算法与密钥恢复消息，随后单独验证完整性。'}</p>
      {layer === 'secret' && <p className="mt-3 font-mono text-xs text-accent">像素通道：1011010<span className="rounded bg-accent px-1 text-background">1</span>　最低位承载信息</p>}
    </div>
  </section>;
}
