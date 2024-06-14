"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const page = () => {
  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [conversationId, setConversationId] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [databaseId, setDatabaseId] = useState(null);
  const [databaseName, setDatabaseName] = useState(null);

  const router = useRouter();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setDatabaseId(urlParams.get('id'));
    setDatabaseName(urlParams.get('name'));
  }, []);
  useEffect(() => {
    fetchConversations();
    if (conversationId) {
      loadConversation(conversationId);
    }
  }, [conversationId]);

  const addMessageToChat = (message, isUser = false) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { content: message, isUser },
    ]);
  };

  const sendMessage = async (userMessage) => {
    const token = localStorage.getItem('token');

    const response = await fetch('https://web.tok2dbs.com/chatbot/api/ask/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify({
        message: userMessage,
        database_id: databaseId,
        conversation_id: conversationId,
      }),
    });

    if (response.headers.get('Content-Type').includes('image/png')) {
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      addMessageToChat({ type: 'image', content: url }, false);
    } else {
      const data = await response.json();
      setConversationId(data.conversation_id);
      addMessageToChat(data.response, false);
    }
  };

  const fetchConversations = async () => {
    const token = localStorage.getItem('token');
    const selectedDatabaseId = localStorage.getItem('selectedDatabaseId');

    if (!selectedDatabaseId) {
      console.error('No selectedDatabaseId found in localStorage');
      return;
    }

    const response = await fetch(
      `https://web.tok2dbs.com/chatbot/api/list_conversations/?database_id=${selectedDatabaseId}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Token ${token}`,
        },
      }
    );

    if (response.ok) {
      const fetchedConversations = await response.json();
      setConversations(fetchedConversations);
    } else {
      console.error('Failed to fetch conversations');
    }
  };

  const selectConversation = async (id) => {
    setConversationId(id);
    await loadConversation(id);
  };

  const loadConversation = async (id) => {
    const token = localStorage.getItem('token');

    const response = await fetch(
      `https://web.tok2dbs.com/chatbot/api/get_conversation/${id}/`,
      {
        method: 'GET',
        headers: {
          Authorization: `Token ${token}`,
        },
      }
    );

    if (response.ok) {
      const conversation = await response.json();
      setMessages([]);

      for (let i = 0; i < conversation.user_messages.length; i++) {
        addMessageToChat(conversation.user_messages[i], true);
        if (conversation.ai_responses[i]) {
          addMessageToChat(conversation.ai_responses[i], false);
        }
      }
    } else {
      console.error('Failed to fetch conversation');
    }
  };

  const handleLogout = async () => {
    const token = localStorage.getItem('token');

    const response = await fetch('https://web.tok2dbs.com/users/logout/', {
      method: 'POST',
      headers: {
        Authorization: `Token ${token}`,
      },
    });

    if (response.ok) {
      localStorage.removeItem('token');
      alert('Successfully logged out.');
      window.location.href = '/';
    } else {
      const data = await response.json();
      alert(data.message);
    }
  };

  const handleSendMessage = async () => {
    if (userInput.trim()) {
      addMessageToChat(userInput, true);
      setUserInput('');
      await sendMessage(userInput);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 md:flex-row">
      <div className="w-full md:w-64 bg-gray-900 text-gray-200 flex flex-col p-5">
        <h2 className="text-2xl mb-5">Conversations</h2>
        <div className="mb-5">
          {conversations.length === 0 ? (
            <div>No conversations yet.</div>
          ) : (
            conversations.map((conversation) => (
              <div
                key={conversation.id}
                className="bg-gray-700 p-3 rounded mb-3 cursor-pointer hover:bg-blue-900"
                onClick={() => selectConversation(conversation.id)}
              >
                Conversation with ID: {conversation.id}
              </div>
            ))
          )}
        </div>
        <button
          className="flex items-center bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          onClick={handleLogout}
        >
          <i className="fas fa-sign-out-alt mr-2"></i> Logout
        </button>
      </div>
      <div className="flex flex-col flex-grow">
        <div className="bg-white text-blue-900 border p-4 text-center text-xl">
          Chat with <span id="chat-database-name">{databaseName}</span>
        </div>
        <div className="flex-grow p-4 overflow-y-auto bg-white">
  <div className="flex flex-col space-y-4">
    {messages.map((message, index) => (
      <div
        key={index}
        className={`max-w-3xl ${
          message.isUser ? "self-end" : "self-start"
        }`}
      >
        <div
          className={`message p-3 rounded-lg ${
            message.isUser
              ? "bg-blue-900 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          {message.content}
        </div>
      </div>
    ))}
  </div>
</div>
        <div className="p-3 border-t justify-center border-gray-300 bg-white flex">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Type your message here..."
            className="w-full md:w-[600px] p-2 border border-gray-300 rounded-full text-sm"
          />
          <button
            onClick={handleSendMessage}
            className="ml-3 px-4 py-2 bg-blue-900 text-white rounded-full hover:bg-blue-700"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default page;