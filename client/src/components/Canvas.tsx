import React, { useEffect } from 'react';
import { useDraw, type DrawProps, type Point } from '../hooks/useDraw';
import { socket } from '../socket';

interface CanvasProps {
    color: string;
    size: number;
}

type DrawLineArgs = {
    prevPoint: Point | null;
    currentPoint: Point;
    color: string;
    width: number;
};

export const Canvas: React.FC<CanvasProps> = ({ color, size }) => {
    const { canvasRef, onMouseDown } = useDraw(createLine);

    useEffect(() => {
        const ctx = canvasRef.current?.getContext('2d');

        socket.on('draw-line', ({ prevPoint, currentPoint, color, width }: DrawLineArgs) => {
            if (!ctx) return;
            drawLine({ prevPoint, currentPoint, ctx, color, width });
        });

        socket.on('clear', () => {
            if (!ctx || !canvasRef.current) return;
            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        });

        return () => {
            socket.off('draw-line');
            socket.off('clear');
        };
    }, [canvasRef]);

    function createLine({ prevPoint, currentPoint, ctx }: DrawProps) {
        socket.emit('draw-line', { prevPoint, currentPoint, color, width: size });
        drawLine({ prevPoint, currentPoint, ctx, color, width: size });
    }

    function drawLine({ prevPoint, currentPoint, ctx, color, width }: DrawLineArgs & { ctx: CanvasRenderingContext2D }) {
        const { x: currX, y: currY } = currentPoint;
        const lineColor = color;
        const lineWidth = width;

        let startPoint = prevPoint ?? currentPoint;
        ctx.beginPath();
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = lineColor;
        ctx.lineCap = 'round'; // Smooth drawing
        ctx.moveTo(startPoint.x, startPoint.y);
        ctx.lineTo(currX, currY);
        ctx.stroke();

        ctx.fillStyle = lineColor;
        ctx.beginPath();
        ctx.arc(startPoint.x, startPoint.y, 2, 0, 2 * Math.PI);
        ctx.fill();
    }

    // Handle Resize
    useEffect(() => {
        const resize = () => {
            if (canvasRef.current) {
                // Optional: Save canvas content before resize and restore
                // For now just resize (content might be lost)
                // Better approach: set width/height to window size
                canvasRef.current.width = window.innerWidth;
                canvasRef.current.height = window.innerHeight;
            }
        }
        window.addEventListener('resize', resize);
        resize(); // Init size

        return () => window.removeEventListener('resize', resize);
    }, []);

    return (
        <canvas
            ref={canvasRef}
            onMouseDown={onMouseDown}
            className="absolute top-0 left-0 w-full h-full bg-white cursor-crosshair touch-none"
        />
    );
};
