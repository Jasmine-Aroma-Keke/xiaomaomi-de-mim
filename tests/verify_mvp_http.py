"""真实 HTTP 验收：先启动 python app.py 和 web 的 npm run dev。"""
import sys, json, base64, io, urllib.request, urllib.error
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'.deps'))
from PIL import Image
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from core.baseline import positions

results=[]
def check(name, action):
    try:
        action(); results.append({'case':name,'status':'passed'})
    except Exception as e:
        results.append({'case':name,'status':'failed','error':str(e)})
def post(route,data,expected=200,base='http://127.0.0.1:5173'):
    req=urllib.request.Request(base+'/api/'+route,data=json.dumps(data).encode(),headers={'Content-Type':'application/json'})
    try: response=urllib.request.urlopen(req,timeout=30)
    except urllib.error.HTTPError as e: response=e
    assert response.code==expected,(response.code,expected)
    raw=response.read()
    return json.loads(raw) if expected!=404 else {}
def get(url):
    assert urllib.request.urlopen(url,timeout=10).status==200
for port in (8000,5173): check(f'HTTP 页面 {port}',lambda p=port:get(f'http://127.0.0.1:{p}/'))
for page in ('Home','Creation','Extraction','Detection','TamperDetection','Robustness','AlgorithmComparison'):
    check('前端模块 '+page,lambda p=page:get(f'http://127.0.0.1:5173/src/pages/{p}.tsx'))
def flow(key,text):
    result=post('generate',{'public':'https://example.com','secret':text,'key':key})
    image=Image.open(io.BytesIO(base64.b64decode(result['png'])))
    assert image.format=='PNG'
    # Real PNG disk save/load, not just a JSON roundtrip.
    path=Path(__file__).resolve().parents[1]/'outputs'/'mvp_validation.png';path.parent.mkdir(exist_ok=True);image.save(path)
    png=base64.b64encode(path.read_bytes()).decode()
    out=post('extract',{'png':png,'key':key})
    assert out['status']=='passed' and out['secret']==text
    assert post('extract',{'png':png,'key':key+'wrong'})['status']=='unknown'
    assert post('detect',{'png':png})['status']=='unavailable'
    x,y,c=positions(image,key)[320];rgb=list(image.getpixel((x,y)));rgb[c]^=1;image.putpixel((x,y),tuple(rgb))
    b=io.BytesIO();image.save(b,format='PNG')
    if text: assert post('extract',{'png':base64.b64encode(b.getvalue()).decode(),'key':key})['status']=='failed'
check('基础模式：PNG落盘/重读、中文emoji、错误密钥、消息位篡改、检测未接入',lambda:flow('','今天的验收🐱'))
check('随机模式：PNG落盘/重读、中文emoji、错误密钥、消息位篡改',lambda:flow('验收测试密钥','随机隐藏🐱'))
check('最大11960字节恢复',lambda:flow('','a'*11960))
def empty():
    p=post('generate',{'public':'hello','secret':'','key':''});assert post('extract',{'png':p['png'],'key':''})['secret']==''
check('空消息',empty)
for name,route,payload in [('容量超限','generate',{'public':'x','secret':'a'*11961}),('公开文本为空','generate',{'public':''}),('无效Base64','extract',{'png':'@@@'}),('损坏图片','extract',{'png':base64.b64encode(b'broken').decode()})]:
    check(name,lambda r=route,p=payload:post(r,p,400))
check('未知接口404',lambda:post('does-not-exist',{},404))
root=Path(__file__).resolve().parents[1];out=root/'outputs'/'mvp_http_results.json';out.write_text(json.dumps(results,ensure_ascii=False,indent=2),encoding='utf-8')
for row in results: print(row['status'],row['case'],row.get('error',''))
sys.exit(1 if any(r['status']=='failed' for r in results) else 0)
