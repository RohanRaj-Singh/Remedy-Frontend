declare module 'qrcode' {
    export interface QRCodeOptions {
        width?: number;
        height?: number;
        margin?: number;
        scale?: number;
        small?: boolean;
        color?: {
            dark?: string;
            light?: string;
        };
        type?: 'image/png' | 'image/jpeg' | 'image/webp';
        rendererOpts?: {
            quality?: number;
        };
    }

    export function toDataURL(text: string, options?: QRCodeOptions): Promise<string>;
    export function toCanvas(canvas: HTMLCanvasElement, text: string, options?: QRCodeOptions): Promise<void>;
}