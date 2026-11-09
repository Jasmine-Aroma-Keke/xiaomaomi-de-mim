import { Link } from 'react-router-dom';
import { Construction } from 'lucide-react';
import { Button } from '@/components/ui/button';
export function StagePlaceholder({title, description}: {title: string; description: string}) {
  return <section className="max-w-3xl rounded-2xl border border-border bg-card p-6 sm:p-10">
    <Construction className="mb-6 size-8 text-accent" aria-hidden="true"/>
    <p className="mb-3 text-sm text-muted-foreground">页面结构已建立 · 功能待接入</p>
    <h1 className="mb-4 text-3xl font-semibold">{title}</h1>
    <p className="mb-4 leading-7 text-muted-foreground">{description}</p>
    <p className="mb-8 text-sm leading-7 text-muted-foreground">专用页面将在后续阶段实现。当前可以使用已有工作台完成真实二维码生成与秘密提取。</p>
    <Button asChild><Link to="/workbench">打开现有工作台</Link></Button>
  </section>;
}
