import './App.css';
import io from 'socket.io-client'
import { useState, useEffect } from 'react'

// Создаем клиентский сокет на порту 3001
const socket = io.connect("http://localhost:3001")

function App() {

    // Состояние комнаты (комната и сеттер комнаты)
    const [room, setRoom] = useState("");

    // Состояние сообщения
    const [message, setMessage] = useState("");

    // Состояние полученного сообщения
    const [messageReceived, setMessageReceived] = useState("");

    // Присоединение к комнате
    const joinRoom = () => {
        if (room !== "") {
            console.log(`Присоединились к комнате ${room}`);
            // Отправляем на сервер запрос типа "join_room"
            socket.emit("join_room", room);
        }
    };

    // Отправление сообщения
    const sendMessage = () => {
        console.log(`Сообщение "${message}" отправлено в комнату ${room}`);
        // Отправляем на сервер запрос типа "send_message"
        socket.emit("send_message", { message, room });
    };

    // Используем useEffect для обновления полученного сообщения каждый раз, когда меняется объект socket
    useEffect(() => {
        socket.on("receive_message", (data) => {
            console.log(`Получено сообщение: "${data.message}"`);
            setMessageReceived(data.message);
        });
    }, [socket]);

  return (
      <div className="App">
          <input
              placeholder="Номер комнаты..."
              onChange={(event) => {
                  setRoom(event.target.value);
              }}
          />
          <button onClick={joinRoom}> Подключиться</button>
          <input
              placeholder="Сообщение..."
              onChange={(event) => {
                  setMessage(event.target.value);
              }}
          />
          <button onClick={sendMessage}> Отправить</button>
          <h1> Сообщение: </h1>
          {messageReceived}
      </div>
  );
}

export default App;
