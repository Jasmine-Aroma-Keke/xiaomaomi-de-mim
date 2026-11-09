import {lazy,Suspense} from 'react';
import { HashRouter, Link, Route, Routes } from 'react-router-dom';
import { LabLayout } from '@/components/layout/LabLayout';
const LegacyWorkbench=lazy(()=>import('@/pages/LegacyWorkbench'));
import { Button } from '@/components/ui/button';
const Home=lazy(()=>import('@/pages/Home'));
import Creation from '@/pages/Creation';
import Extraction from '@/pages/Extraction';
const Detection=lazy(()=>import('@/pages/Detection'));
const TamperDetection=lazy(()=>import('@/pages/TamperDetection'));
const Robustness=lazy(()=>import('@/pages/Robustness'));
const AlgorithmComparison=lazy(()=>import('@/pages/AlgorithmComparison'));

export default function App() {
  return <HashRouter><Routes><Route element={<LabLayout/>}>
    <Route index element={<Suspense fallback={<p role="status">正在载入首页…</p>}><Home/></Suspense>}/>
    <Route path="/qr" element={<Creation key="qr"/>}/>
    <Route path="/hide" element={<Creation key="hide" hide/>}/>
    <Route path="/extract" element={<Extraction/>}/>
    <Route path="/detect" element={<Suspense fallback={<p role="status">正在载入检测中心…</p>}><Detection/></Suspense>}/>
    <Route path="/tamper" element={<Suspense fallback={<p role="status">正在载入完整性验证…</p>}><TamperDetection/></Suspense>}/>
    <Route path="/robustness" element={<Suspense fallback={<p role="status">正在载入鲁棒性实验…</p>}><Robustness/></Suspense>}/>
    <Route path="/compare" element={<Suspense fallback={<p role="status">正在载入算法对比…</p>}><AlgorithmComparison/></Suspense>}/>
    <Route path="/workbench" element={<Suspense fallback={<p role="status">正在载入工作台…</p>}><LegacyWorkbench/></Suspense>}/>
    <Route path="*" element={<section><h1 className="mb-5 text-3xl">未找到这个页面</h1><Button asChild><Link to="/">返回实验室入口</Link></Button></section>}/>
  </Route></Routes></HashRouter>;
}
