import {useEffect,useRef} from 'react';
import {NavLink,Outlet,useLocation} from 'react-router-dom';
import {Cat,Menu,X,Moon} from 'lucide-react';
import {useTheme} from '@/hooks/use-theme';
import {Switch} from '@/components/ui/switch';
import {USE_MOCK,MODE_LABEL} from '@/services/config';
import {labRoutes} from '@/types/navigation';
function Navigation(){return <nav aria-label="实验室导航" className="side-links">{[{path:'/',title:'实验室入口'},...labRoutes,{path:'/workbench',title:'现有工作台'}].map(r=><NavLink end key={r.path} to={r.path} className={({isActive})=>isActive?'active':''}>{r.title}</NavLink>)}</nav>}
export function LabLayout(){
 const {theme,setTheme}=useTheme();const location=useLocation();const main=useRef<HTMLElement>(null);const dialog=useRef<HTMLDialogElement>(null);
 useEffect(()=>{document.title=(labRoutes.find(r=>r.path===location.pathname)?.title||(location.pathname==='/workbench'?'现有工作台':'实验室入口'))+' · 小猫咪的秘密';dialog.current?.close();main.current?.focus({preventScroll:true});window.scrollTo(0,0)},[location.pathname]);
 const brand=<NavLink to="/" className="flex items-center gap-3 font-semibold"><Cat className="text-primary"/>小猫咪的秘密</NavLink>;
 return <div className="lab-shell"><button className="skip-link" onClick={()=>main.current?.focus()}>跳到主要内容</button><aside className="desktop-sidebar">{brand}<p className="mt-2 mb-8 text-xs text-muted-foreground">图像里的双重世界</p><Navigation/><p className="mt-auto pt-8 text-xs leading-6 text-muted-foreground">课程实验平台<br/>公开扫码与秘密恢复分别验证</p></aside><div className="lab-content"><header className="lab-topbar"><button className="mobile-menu" onClick={()=>dialog.current?.showModal()} aria-label="打开实验导航"><Menu size={20}/></button><span className="text-sm text-muted-foreground">{labRoutes.find(r=>r.path===location.pathname)?.title||'实验室入口'}</span><label className="ml-auto flex items-center gap-2 text-sm text-muted-foreground"><Moon size={16} aria-hidden="true"/>浅色主题<Switch checked={theme==='light'} onCheckedChange={c=>setTheme(c?'light':'dark')} aria-label="浅色主题"/></label></header><main id="main" ref={main} tabIndex={-1} className="lab-main outline-none">{USE_MOCK&&<div className="mode-banner" role="status"><strong>演示模式</strong><span>仅演示交互；图片有演示标记，文本从当前会话内存取回，检测及指标不作为算法实验结论。刷新后需重新生成。</span></div>}<Outlet/></main><footer className="px-6 pb-8 text-xs leading-6 text-muted-foreground">{MODE_LABEL} · 统计检测与改进算法按模块接入</footer></div><dialog ref={dialog} className="nav-drawer" aria-label="实验室导航" onClick={e=>{if(e.target===e.currentTarget)dialog.current?.close()}}><div className="mb-8 flex items-center justify-between">{brand}<button onClick={()=>dialog.current?.close()} aria-label="关闭导航"><X/></button></div><Navigation/></dialog></div>
}
