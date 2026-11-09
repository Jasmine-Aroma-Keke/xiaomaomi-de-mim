import {useEffect,useRef} from 'react';
import {init,use,type EChartsCoreOption} from 'echarts/core';
import {BarChart,LineChart} from 'echarts/charts';
import {GridComponent,TooltipComponent,LegendComponent} from 'echarts/components';
import {CanvasRenderer} from 'echarts/renderers';
use([BarChart,LineChart,GridComponent,TooltipComponent,LegendComponent,CanvasRenderer]);
export function LabChart({option,label}:{option:EChartsCoreOption;label:string}){
 const ref=useRef<HTMLDivElement>(null);
 useEffect(()=>{if(!ref.current)return;const chart=init(ref.current);const render=()=>{const css=getComputedStyle(document.documentElement);const text=css.getPropertyValue('--muted-foreground').trim();chart.setOption({backgroundColor:'transparent',color:[css.getPropertyValue('--primary').trim(),css.getPropertyValue('--accent').trim()],textStyle:{color:text,fontFamily:'Microsoft YaHei, sans-serif'},tooltip:{trigger:'axis'},grid:{left:56,right:22,bottom:48,top:32},...option},true)};render();const resize=new ResizeObserver(()=>chart.resize());resize.observe(ref.current);const theme=new MutationObserver(render);theme.observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});return()=>{resize.disconnect();theme.disconnect();chart.dispose()}},[option]);
 return <div ref={ref} className="lab-chart" role="img" aria-label={label}/>;
}
