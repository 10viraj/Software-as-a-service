import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import { Send, User, ArrowLeft, Phone, Video, Paperclip, Image, FileText, Download } from 'lucide-react';

import { format } from 'date-fns';

const socket = io('http://localhost:5000');

const Chat = () => {
  const { userId: otherUserId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [otherUser, setOtherUser] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const fetchChatData = async () => {
      try {
        const { data: userData } = await axios.get(`http://localhost:5000/api/auth/user/${otherUserId}`);
        setOtherUser(userData);
        
        const { data: chatMessages } = await axios.get(`http://localhost:5000/api/messages/${otherUserId}`);
        setMessages(chatMessages);
      } catch (error) {
        console.error('Error fetching chat:', error);
      }
    };


    fetchChatData();

    socket.emit('join', user._id);

    socket.on('receiveMessage', (message) => {
      if (message.senderId === otherUserId) {
        setMessages((prev) => [...prev, message]);
      }
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, [otherUserId, user._id]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('image', file); // The backend /api/upload expects 'image'

    try {
      const { data: uploadData } = await axios.post('http://localhost:5000/api/upload', formData);
      const fileUrl = `http://localhost:5000${uploadData.imageUrl}`;
      const fileType = file.type.startsWith('image/') ? 'image' : 'document';

      // Send the message with the file
      const { data } = await axios.post('http://localhost:5000/api/messages', {
        receiverId: otherUserId,
        message: '',
        fileUrl,
        fileType,
      });

      setMessages((prev) => [...prev, data]);
      socket.emit('sendMessage', {
        receiverId: otherUserId,
        senderId: user._id,
        message: '',
        fileUrl,
        fileType,
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file');
    } finally {
      setUploading(false);
    }
  };


  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const { data } = await axios.post('http://localhost:5000/api/messages', {
        receiverId: otherUserId,
        message: newMessage,
      });

      setMessages((prev) => [...prev, data]);
      socket.emit('sendMessage', {
        receiverId: otherUserId,
        senderId: user._id,
        message: newMessage,
      });
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-blue-600 text-white">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
            {otherUser?.profilePic ? (
              <img src={otherUser.profilePic} alt="" className="w-full h-full object-cover" />
            ) : (
              <User className="w-6 h-6" />
            )}
          </div>
          <div>
            <h3 className="font-bold">{otherUser?.name || 'Chat Session'}</h3>
            <p className="text-xs text-blue-100 font-medium capitalize">{otherUser?.role || 'Online'}</p>
          </div>

        </div>
        <div className="flex items-center space-x-2">
          <button className="p-2 hover:bg-white/10 rounded-xl cursor-pointer">
            <Phone className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-white/10 rounded-xl cursor-pointer">
            <Video className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50">
        {messages.map((msg, index) => {
          const isMe = msg.senderId === user._id;
          return (
            <div key={index} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] p-4 rounded-2xl shadow-sm ${
                isMe ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
              }`}>
                {msg.fileUrl && (
                  <div className="mb-2">
                    {msg.fileType === 'image' ? (
                      <img 
                        src={msg.fileUrl} 
                        alt="Shared" 
                        className="rounded-xl max-h-64 w-full object-cover cursor-pointer hover:opacity-90 transition-opacity" 
                        onClick={() => window.open(msg.fileUrl, '_blank')}
                      />
                    ) : (
                      <a 
                        href={msg.fileUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={`flex items-center p-3 rounded-xl border ${
                          isMe ? 'bg-blue-700 border-blue-500' : 'bg-gray-50 border-gray-100'
                        }`}
                      >
                        <FileText className="w-5 h-5 mr-2" />
                        <span className="text-xs font-bold truncate">Document</span>
                        <Download className="w-4 h-4 ml-auto" />
                      </a>
                    )}
                  </div>
                )}
                {msg.message && <p className="text-sm font-medium leading-relaxed">{msg.message}</p>}
                <p className={`text-[10px] mt-2 font-bold ${isMe ? 'text-blue-200' : 'text-gray-400'}`}>
                  {format(new Date(msg.createdAt), 'HH:mm')}
                </p>
              </div>
            </div>

          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-100 flex items-center space-x-3">
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          onChange={handleFileUpload}
          accept="image/*,.pdf,.doc,.docx"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current.click()}
          disabled={uploading}
          className="p-3 bg-gray-50 text-gray-500 rounded-2xl hover:bg-gray-100 hover:text-blue-600 transition-all cursor-pointer"
        >
          {uploading ? (
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent animate-spin rounded-full" />
          ) : (
            <Paperclip className="w-6 h-6" />
          )}
        </button>
        <input
          type="text"
          placeholder="Type your medical concern..."
          className="flex-1 px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-medium"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button
          type="submit"
          className="p-4 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all transform hover:scale-105 cursor-pointer"
        >
          <Send className="w-6 h-6" />
        </button>
      </form>

    </div>
  );
};

export default Chat;
