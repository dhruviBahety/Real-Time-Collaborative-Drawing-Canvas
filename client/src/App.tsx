import { useEffect, useState } from 'react';
import { Canvas } from './components/Canvas';
import { Toolbar } from './components/Toolbar';
import { socket } from './socket';

function App() {
  const [color, setColor] = useState<string>('#000000');
  const [size, setSize] = useState<number>(5);
  const [activeUsers, setActiveUsers] = useState<number>(0);

  useEffect(() => {
    socket.on('active-users', (count: number) => {
      setActiveUsers(count);
    });

    return () => {
      socket.off('active-users');
    };
  }, []);

  const handleClear = () => {
    socket.emit('clear');
  };

  return (
    <div className="w-screen h-screen overflow-hidden bg-gray-50 flex flex-col">
      <Toolbar
        color={color}
        setColor={setColor}
        size={size}
        setSize={setSize}
        clear={handleClear}
        activeUsers={activeUsers}
      />
      <Canvas color={color} size={size} />
    </div>
  );
}

export default App;
