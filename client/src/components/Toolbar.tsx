import React from 'react';
import { Trash2, Eraser, Pencil } from 'lucide-react';

interface ToolbarProps {
    color: string;
    setColor: (color: string) => void;
    size: number;
    setSize: (size: number) => void;
    clear: () => void;
    activeUsers: number;
}

export const Toolbar: React.FC<ToolbarProps> = ({ color, setColor, size, setSize, clear, activeUsers }) => {
    const colors = ['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FFFFFF'];

    return (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-white p-4 rounded-xl shadow-xl flex items-center gap-6 z-10 border border-gray-200">
            <div className="flex gap-2">
                {colors.map((c) => (
                    <button
                        key={c}
                        className={`w-8 h-8 rounded-full border border-gray-300 transition-transform hover:scale-110 ${color === c ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
                        style={{ backgroundColor: c }}
                        onClick={() => setColor(c)}
                        aria-label={`Select color ${c}`}
                    />
                ))}
            </div>

            <div className="h-8 w-px bg-gray-300 mx-2"></div>

            <div className="flex items-center gap-2">
                <input
                    type="range"
                    min="1"
                    max="20"
                    value={size}
                    onChange={(e) => setSize(Number(e.target.value))}
                    className="w-24 accent-blue-600"
                />
                <span className="text-xs text-gray-500 w-4">{size}px</span>
            </div>

            <div className="h-8 w-px bg-gray-300 mx-2"></div>

            <div className="flex gap-2">
                <button onClick={() => setColor('#ffffff')} className={`p-2 rounded hover:bg-gray-100 ${color === '#ffffff' ? 'bg-blue-100 text-blue-600' : 'text-gray-700'}`}>
                    <Eraser size={20} />
                </button>
                <button onClick={() => setColor('#000000')} className={`p-2 rounded hover:bg-gray-100 ${color === '#000000' ? 'bg-blue-100 text-blue-600' : 'text-gray-700'}`}>
                    <Pencil size={20} />
                </button>
            </div>

            <div className="h-8 w-px bg-gray-300 mx-2"></div>

            <div className="flex gap-2">
                <button onClick={clear} className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors" title="Clear Canvas">
                    <Trash2 size={20} />
                </button>
                {/* Undo is trickier with raw canvas without full history stack tracking. 
             If required, we'd implement history in App or useDraw. 
             For now, leaving placeholder or implementing basic reload? 
             Actually req says "Undo/Redo: Support for at least 10 levels".
             I need to implement this in useDraw/Canvas. 
             Ideally saving image data snapshots.
          */}
            </div>

            <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-xs whitespace-nowrap">
                {activeUsers} Active Users
            </div>
        </div>
    );
};
