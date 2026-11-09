export type Algorithm = 'basic' | 'random' | 'adaptive';
export interface GenerateResult { png: string; capacity_bytes: number; scan_status: string }
export interface ExtractResult { status: 'passed' | 'failed' | 'unknown'; secret: string | null; detail: string }
