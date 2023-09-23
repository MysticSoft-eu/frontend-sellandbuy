import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../UserContext';
import '../styles/Chat.css';
import uniqBy from 'lodash/uniqBy';

export default function Chat() {
  const messagesEndRef = useRef(null);

  // Get user information from context
  const { user } = useContext(UserContext);
  const { itemId } = useParams();

  // State variables to manage chats and messages
  const [chats, setChats] = useState([]);
  const [selectChat, setSelectChat] = useState();
  const [ws, setWs] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [recipient, setRecipient] = useState('');
  const [sender, setSender] = useState('');
  const navigate = useNavigate();
  const uniqueMessages = uniqBy(messages, '_id');
  let reconnectAttempts = 0;

  // Function to scroll to the bottom of the chat messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Scroll to the bottom when messages change
  useEffect(() => {
    scrollToBottom();
  });

  // Fetch messages for the selected chat
  useEffect(() => {
    if (!selectChat) return;
    fetchMessages();
  }, [selectChat]);

  async function fetchMessages() {
    try {
      const res = await axios.get(`/message/${selectChat}`);
      setMessages(res.data);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  }

  // Fetch chats when the user changes
  useEffect(() => {
    if (!user) return;
    fetchChats();
  }, [user]);

  let isRequestPending = false;

  // Fetch the list of chats for the user
  async function fetchChats() {
    if (isRequestPending) return;
    isRequestPending = true;
    try {
      const response = await axios.post('/chat', { itemId });
      setChats(response.data);
    } catch (e) {
      console.log(e);
    }
    isRequestPending = false;
  }

  // Set the selected chat and recipient when an item is selected
  useEffect(() => {
    const chatWithItemId = chats.find((chat) => chat.itemId === itemId);
    if (chatWithItemId) {
      setSelectChat(chatWithItemId._id);
      setRecipient(chatWithItemId.recipient);
      setSender(chatWithItemId.sender);
    }
  }, [chats]);

  // Establish a WebSocket connection
  useEffect(() => {
    connectToWebSocket();
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [selectChat]);

  // Function to establish a WebSocket connection
  function connectToWebSocket() {
    if (reconnectAttempts > 5) return;
    const wsConnection = new WebSocket('wss://backendsellandbuy-516d9183eb68.herokuapp.com');

    wsConnection.onopen = () => {
      console.log('WebSocket connection opened');
      wsConnection.send(JSON.stringify({ chatId: selectChat }));
      reconnectAttempts = 0;
    };

    setWs(wsConnection);

    wsConnection.addEventListener('message', handleMessage);

    wsConnection.addEventListener('close', () => {
      console.log('WebSocket closed. Attempting to reconnect...');
      reconnectAttempts++;
      setTimeout(() => {
        connectToWebSocket();
      }, 1000);
    });
  }

  // Handle incoming WebSocket messages
  function handleMessage(ev) {
    const messageData = JSON.parse(ev.data);
    if ('text' in messageData) {
      setMessages((prev) => [...prev, messageData]);
    }
  }

  // Send a new message
  const sendMessage = (ev) => {
    ev.preventDefault();
    if (!selectChat || !ws) return;

    let recipientId = recipient;

    if (recipientId === user._id) {
      recipientId = sender;
    }

    const messageData = {
      text: newMessage,
      recipient: recipientId,
      sender: user._id,
      chatId: selectChat,
    };

    ws.send(JSON.stringify(messageData));

    setNewMessage('');
  };

  return (
    <div className="chatPage">
      <div className={`chatList ${itemId ? 'hidden' : 'visible'}`}>
        {chats.map((chat) => (
          <Link
            key={chat._id}
            to={`/chatpage/${chat.itemId}`}
            className="chatListItem"
            onClick={() => setSelectChat(chat._id)}
          >
            {chat.title}
          </Link>
        ))}
      </div>
      <div className={`chatWindow ${itemId ? 'visible' : 'hidden'}`}>
        <div className="chatMessages">
          {uniqueMessages.map((message) => (
            <div
              key={message._id}
              className={`chatMessage ${message.sender === user._id ? 'sent' : 'received'}`}
            >
              <span className="messageSender">
                {message.sender === user._id ? 'Me:' : 'User:'}
              </span>
              {message.text}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="chatInputContainer">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}
