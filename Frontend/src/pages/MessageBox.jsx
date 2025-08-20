import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { io } from "socket.io-client";

// Deduplication helper for messages by _id
function addUniqueMessages(existingMessages, newMessages) {
  const existingIds = new Set(existingMessages.map(m => m._id));
  return [...existingMessages, ...newMessages.filter(m => !existingIds.has(m._id))];
}

const socket = io("https://globalconnect-aatv.onrender.com"); // backend URL

export default function ChatApp() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [selectedChat, setSelectedChat] = useState(null);
  const [chats, setChats] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const currentUserId = localStorage.getItem("userId");

  // Ref to track selected chat inside socket listener
  const selectedChatRef = useRef(selectedChat);
  useEffect(() => {
    selectedChatRef.current = selectedChat;
  }, [selectedChat]);

  // Fetch all accepted connections once at mount
  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await API.get("/users/connections/accepted", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setChats(res.data);
      } catch (err) {
        console.error("Error fetching connections:", err);
      }
    };
    fetchConnections();
  }, []);

  // Socket listener for real-time messages (with cleanup)
  useEffect(() => {
    if (!currentUserId) return;

    socket.emit("join", currentUserId);

    const handleReceive = (msg) => {
      // Only add if message belongs to the currently selected chat
      if (
        selectedChatRef.current &&
        (msg.senderId === selectedChatRef.current._id ||
          msg.receiverId === selectedChatRef.current._id)
      ) {
        setChatMessages((prev) => addUniqueMessages(prev, [msg]));
      }
    };

    socket.on("receive_message", handleReceive);

    return () => {
      socket.off("receive_message", handleReceive);
    };
  }, [currentUserId]);

  // Fetch messages for selected chat
  const handleSelectChat = async (chatUser) => {
    setSelectedChat(chatUser);
    setChatMessages([]); // Clear previous messages!
    try {
      const token = localStorage.getItem("token");
      const res = await API.get(`/messages/${chatUser._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Only load messages from DB, do not append to old state
      setChatMessages(res.data);
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  // Send message
  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim() || !selectedChat) return;

    try {
      const token = localStorage.getItem("token");
      const res = await API.post(
        "/messages",
        {
          receiverId: selectedChat._id,
          content: message,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const savedMsg = res.data;
      socket.emit("send_message", savedMsg);
      setChatMessages((prev) => addUniqueMessages(prev, [savedMsg]));
      setMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  return (
    <div className="h-screen flex bg-[#f9f9f4]">
      {/* Sidebar */}
      <div className="w-1/4 bg-[#f5f5ec] border-r border-[#d8d6c1] flex flex-col">
        <div className="p-4 font-bold text-xl border-b border-[#d8d6c1] text-[#556b2f]">
          Chats
        </div>
        <div className="flex-1 overflow-y-auto">
          {chats.map((chat) => (
            <div
              key={chat._id}
              onClick={() => handleSelectChat(chat)}
              className={`p-4 cursor-pointer border-b border-[#e0e0d1] hover:bg-[#e6e6d5] ${
                selectedChat?._id === chat._id ? "bg-[#d9ddc8]" : ""
              }`}
            >
              <div className="font-semibold text-[#3e4c2f]">{chat.name}</div>
              <div className="text-sm text-gray-500 truncate">{chat.email}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Message Box */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between bg-[#6b8e23] text-white p-4 font-bold">
          <span>{selectedChat ? selectedChat.name : "Select a Chat"}</span>
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-white text-[#6b8e23] px-3 py-1 rounded hover:bg-[#f0f0e6] text-sm"
          >
            Back to Dashboard
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          {chatMessages.map((msg, i) => (
            <div
              key={msg._id || i}
              className={`flex ${
                msg.senderId === currentUserId ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`p-3 rounded-2xl max-w-[70%] ${
                  msg.senderId === currentUserId
                    ? "bg-[#6b8e23] text-white"
                    : "bg-[#e5e5d1] text-[#2f3b1f]"
                }`}
              >
                <p>{msg.content}</p>
                <span className="text-xs opacity-70 block mt-1">
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        {selectedChat && (
          <form
            onSubmit={handleSend}
            className="p-4 flex items-center gap-2 border-t border-[#d8d6c1] bg-[#f5f5ec]"
          >
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 p-3 border border-[#c5c5b2] rounded-xl focus:ring-2 focus:ring-[#6b8e23] focus:outline-none bg-white"
            />
            <button
              type="submit"
              className="px-5 py-2 bg-[#6b8e23] text-white rounded-xl hover:bg-[#5e7b1e]"
            >
              Send
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
