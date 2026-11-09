import {Component,type ReactNode} from 'react';
import {Button} from '@/components/ui/button';
export class ErrorBoundary extends Component<{children:ReactNode},{failed:boolean}>{
 state={failed:false};
 static getDerivedStateFromError(){return {failed:true};}
 render(){if(this.state.failed)return <section className="lab-panel m-6"><h1 className="text-2xl mb-4">页面暂时无法加载</h1><p className="text-muted-foreground mb-6">请刷新页面重试。未提交的输入可能需要重新填写。</p><Button onClick={()=>window.location.reload()}>刷新页面</Button></section>;return this.props.children;}
}
