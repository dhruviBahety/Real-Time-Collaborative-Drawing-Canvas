import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // In production, replace with specific client URL
        methods: ["GET", "POST"]
    }
});

interface DrawLine {
    prevPoint: Point | null;
    currentPoint: Point;
    color: string;
    width: number;
}


interface Point {
    x: number;
    y: number;
}

let activeUsers = 0;

io.on('connection', (socket) => {
    activeUsers++;
    io.emit('active-users', activeUsers);
    console.log(`User connected: ${socket.id}. Active users: ${activeUsers}`);

    // Handle client joining (could send initial state here if we persisted it)

    socket.on('draw-line', (data: DrawLine) => {
        // Broadcast to all other clients excluding sender
        socket.broadcast.emit('draw-line', data);
    });

    socket.on('clear', () => {
        io.emit('clear');
    });

    socket.on('disconnect', () => {
        activeUsers--;
        io.emit('active-users', activeUsers);
        console.log(`User disconnected: ${socket.id}. Active users: ${activeUsers}`);
    });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
