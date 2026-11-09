import { Link } from 'react-router-dom';
import { ArrowUpRight, QrCode, LockKeyhole, ScanSearch, ShieldCheck, SlidersHorizontal, ChartNoAxesCombined, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LayerExplorer } from '@/components/qr/LayerExplorer';

const modules = [
  {path:'/qr', title:'猫咪二维码', detail:'让公开信息拥有一张猫咪面孔。', icon:QrCode},
  {path:'/hide', title:'秘密通信', detail:'写入秘密，并用对应密钥恢复消息。', icon:LockKeyhole},
  {path:'/detect', title:'隐写检测', detail:'观察图像统计特征，理解检测边界。', icon:ScanSearch},
  {path:'/tamper', title:'完整性验证', detail:'检查校验覆盖的数据是否发生修改。', icon:ShieldCheck},
  {path:'/robustness', title:'鲁棒性实验', detail:'在压缩、噪声与遮挡中观察变化。', icon:SlidersHorizontal},
  {path:'/compare', title:'算法对比', detail:'用有来源的数据比较质量与性能。', icon:ChartNoAxesCombined},
];
export default function Home() {
  return <div>
    <div className="home-hero">
      <div className="hero-copy">
        <p className="mb-6 flex items-center gap-2 text-sm text-muted-foreground"><span className="size-2 rounded-full bg-primary" aria-hidden="true"/>信息安全课程 · 交互实验室</p>
        <h1 className="hero-title">一只猫咪，<br/>两个秘密世界。</h1>
        <p className="mt-6 max-w-md text-base leading-8 text-muted-foreground">扫码读到公开的信息，在像素深处找回隐藏的消息。探索图像隐写、完整性校验与抗干扰实验。</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild><Link to="/hide"><LockKeyhole size={17} aria-hidden="true"/>开始隐藏秘密</Link></Button>
          <Button asChild variant="outline"><Link to="/detect"><ScanSearch size={17} aria-hidden="true"/>检测隐藏信息</Link></Button>
        </div>
        <Link to="/workbench" className="mt-6 inline-flex items-center gap-2 text-sm text-muted-foreground underline decoration-border underline-offset-4 hover:text-foreground">体验已接入的生成与提取工作台<ArrowUpRight size={15} aria-hidden="true"/></Link>
      </div>
      <LayerExplorer/>
    </div>
    <section className="mt-16 sm:mt-24" aria-labelledby="modules-heading">
      <div className="mb-7 flex flex-wrap items-end justify-between gap-3"><h2 id="modules-heading" className="text-2xl font-semibold">选择你的实验</h2><p className="text-sm text-muted-foreground">真实图像处理与实验 · 算法能力按接口接入</p></div>
      <div className="module-grid">{modules.map(({path,title,detail,icon:Icon})=><Link key={path} to={path} className="module-entry group">
        <Icon className="size-6 text-accent" strokeWidth={1.6} aria-hidden="true"/>
        <div><h3 className="mb-2 font-medium">{title}</h3><p className="text-sm leading-6 text-muted-foreground">{detail}</p></div><ArrowUpRight size={18} className="module-arrow text-muted-foreground group-hover:text-primary" aria-hidden="true"/>
      </Link>)}</div>
      <p className="mt-4 text-sm text-muted-foreground">已有含密图片？<Link to="/extract" className="ml-2 text-primary underline underline-offset-4">前往秘密提取</Link></p>
    </section>
    <section className="workflow-section" aria-labelledby="workflow-heading">
      <div><h2 id="workflow-heading" className="text-2xl font-semibold">从一句话，到一张图</h2><p className="mt-3 text-sm leading-7 text-muted-foreground">每一步都有独立的验证依据。</p></div>
      <ol className="workflow-list">{[
        ['准备载体','选择猫咪图像，设置公开信息。'],
        ['写入秘密','按容量、算法与密钥嵌入文本。'],
        ['分别验证','验证公开扫码、秘密恢复与消息完整性。'],
      ].map(([title,description],i)=><li key={title}><span className="workflow-number">{i+1}</span><div><h3 className="mb-2 font-medium">{title}</h3><p className="text-sm leading-6 text-muted-foreground">{description}</p></div>{i<2&&<ArrowRight size={16} className="workflow-arrow" aria-hidden="true"/>}</li>)}</ol>
    </section>
  </div>;
}
