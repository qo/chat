// Подключаем зависимости для создания сервера io
const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");

// Подключаем cors для легкой инициализации сервера io
const cors = require("cors");
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});

// Подключение к серверу через сокет
io.on("connection", (socket) => {

    console.log(`Подключен пользователь: ${socket.id}`);

    // При получении запроса типа "join_room"
    socket.on("join_room", (room) => {
        console.log(`Получен запрос на присоединение пользователя ${socket.id} к комнате ${room}`);
        // Привязываем пользователя к этой комнате
        socket.join(room);
    });

    // При получении запроса типа "send_message"
    socket.on("send_message", (data) => {
        console.log(`Получен запрос на бродкаст сообщения: ${data.message} в комнату ${data.room}`);
        // Отправляем запрос "receive_message" в комнату, откуда отправлялось сообщение
        socket.to(data.room).emit("receive_message", data);
    });
});

// Сервер слушает порт 3001
server.listen(3001, () => {
    console.log("Сервер запущен на порту 3001");
});