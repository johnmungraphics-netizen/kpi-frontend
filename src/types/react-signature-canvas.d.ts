declare module 'react-signature-canvas' {
  import { Component } from 'react';

  export interface SignatureCanvasProps {
    canvasProps?: React.CanvasHTMLAttributes<HTMLCanvasElement>;
    clearOnResize?: boolean;
    backgroundColor?: string;
    penColor?: string;
    velocityFilterWeight?: number;
    minWidth?: number;
    maxWidth?: number;
    minDistance?: number;
    dotSize?: number | (() => number);
    onEnd?: (() => void) | undefined;
    onBegin?: () => void;
    throttle?: number;
  }

  export default class SignatureCanvas extends Component<SignatureCanvasProps> {
    clear(): void;
    fromDataURL(dataURL: string): void;
    toDataURL(type?: string, encoderOptions?: number): string;
    fromData(dataPoints: Array<{ x: number; y: number; time: number; pressure?: number }>): void;
    toData(): Array<{ x: number; y: number; time: number; pressure?: number }>;
    isEmpty(): boolean;
    getCanvas(): HTMLCanvasElement | null;
    getTrimmedCanvas(): HTMLCanvasElement | null;
  }
}

