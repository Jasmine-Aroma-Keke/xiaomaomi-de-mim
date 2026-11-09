export interface LabRoute { path: string; title: string; description: string; }
export const labRoutes: LabRoute[] = [
  {path:'/qr', title:'猫咪二维码', description:'配置公开信息、猫咪图像与二维码参数。'},
  {path:'/hide', title:'秘密信息隐藏', description:'选择算法，将秘密文本写入图像。'},
  {path:'/extract', title:'秘密提取', description:'从含密图像恢复消息并检查校验状态。'},
  {path:'/detect', title:'隐写检测', description:'查看统计特征、检测方法与适用范围。'},
  {path:'/tamper', title:'完整性验证', description:'基于参考图像或可信元数据分析修改。'},
  {path:'/robustness', title:'鲁棒性实验', description:'分别观察干扰对扫码、恢复和校验的影响。'},
  {path:'/compare', title:'算法对比', description:'对比有来源的实验记录并导出数据。'},
];
