import { useEffect, useRef, useState } from 'react';

export interface DrawProps {
    ctx: CanvasRenderingContext2D;
    currentPoint: Point;
    prevPoint: Point | null;
}

export interface Point {
    x: number;
    y: number;
}

export const useDraw = (onDraw: (draw: DrawProps) => void) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const prevPoint = useRef<Point | null>(null);
    const [mouseDown, setMouseDown] = useState(false);

    const onMouseDown = () => setMouseDown(true);
    const onMouseUp = () => {
        setMouseDown(false);
        prevPoint.current = null;
    };

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (!mouseDown) return;
            const currentPoint = computePointInCanvas(e);

            const ctx = canvasRef.current?.getContext('2d');
            if (!ctx || !currentPoint) return;

            onDraw({ ctx, currentPoint, prevPoint: prevPoint.current });
            prevPoint.current = currentPoint;
        };

        const computePointInCanvas = (e: MouseEvent): Point | null => {
            const canvas = canvasRef.current;
            if (!canvas) return null;

            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            return { x, y };
        };

        const canvas = canvasRef.current;
        if (!canvas) return;

        canvas.addEventListener('mousemove', handler);
        window.addEventListener('mouseup', onMouseUp);

        return () => {
            canvas.removeEventListener('mousemove', handler);
            window.removeEventListener('mouseup', onMouseUp);
        };
    }, [onDraw, mouseDown]);

    return { canvasRef, onMouseDown };
};
