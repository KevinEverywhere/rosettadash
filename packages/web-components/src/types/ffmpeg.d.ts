declare module '@ffmpeg/ffmpeg' {
  export class FFmpeg {
    loaded: boolean;
    on(event: 'progress', handler: (payload: { progress: number }) => void): void;
    load(options: { coreURL: string; wasmURL: string }): Promise<void>;
    writeFile(name: string, data: Uint8Array): Promise<void>;
    readFile(name: string): Promise<Uint8Array>;
    exec(args: string[]): Promise<void>;
  }
}

declare module '@ffmpeg/util' {
  export function fetchFile(file: File | Blob): Promise<Uint8Array>;
  export function toBlobURL(url: string, mimeType: string): Promise<string>;
}
