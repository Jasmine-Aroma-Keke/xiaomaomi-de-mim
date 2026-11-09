export const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';
export const MODE_LABEL = USE_MOCK ? '演示模式' : '真实服务模式';
