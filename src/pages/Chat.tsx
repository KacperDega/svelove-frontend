import React, { useEffect, useState, useRef } from "react";
import Navbar from "../components/Navbar";
import { apiRequest } from "../api";

interface ConversationDto {
  matchId: number;
  otherUserName: string;
  lastMessageContent: string;
  lastMessageTimestamp: string;
  photoUrl: string;
}

interface MessageResponseDto {
  id: number;
  content: string;
  writtenBy: string;
  createdAt: string;
}

const ChatPage: React.FC = () => {
  const [conversations, setConversations] = useState<ConversationDto[]>([]);
  const [activeConversation, setActiveConversation] = useState<ConversationDto | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<MessageResponseDto[]>([]);
  const [loadingConversations, setLoadingConversations] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showError, setShowError] = useState(true);

  const currentUserId = localStorage.getItem("userId") ? parseInt(localStorage.getItem("userId")!) : 0;

  useEffect(() => {
    if (error) {
      setShowError(true);
      const startFadeTimer = setTimeout(() => setShowError(false), 4500);
      return () => clearTimeout(startFadeTimer);
    }
  }, [error]);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoadingConversations(true);
        const data = await apiRequest<ConversationDto[]>("/chat/conversations");
        //console.log("Pobrane konwersacje:", data);
        setConversations(data);
      } catch (err) {
        console.error(err);
        setError("Nie udało się pobrać konwersacji.");
      } finally {
        setLoadingConversations(false);
      }
    };

    fetchConversations();
  }, []);

  const openConversation = async (conv: ConversationDto) => {
    setActiveConversation(conv);
    setLoadingMessages(true);

    setMessages([]);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      throw new Error("Simulated fetch error");
    } catch (err) {
      console.error(err);
      setError("Nie udało się pobrać wiadomości.");
    } finally {
      setLoadingMessages(false);
    }
  };

  const sendMessage = () => {
    setNewMessage("");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        {/* lewa kolumna - konwersacje */}
        <div className="hidden md:flex flex-col w-1/5 border-r border-secondary overflow-y-auto">
          {loadingConversations ? (
            <div className="p-4 text-gray-400">Ładowanie...</div>
          ) : (
            conversations.map((conv) => (
              <button
                key={conv.matchId}
                onClick={() => openConversation(conv)}
                className={`flex items-center gap-3 p-4 text-left hover:bg-base-200 border border-neutral ${
                  activeConversation?.matchId === conv.matchId ? "bg-base-300" : ""
                }`}
              >
                <img
                  src={conv.photoUrl}
                  alt={conv.otherUserName}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex flex-col overflow-hidden">
                  <p
                    className={`text-primary truncate ${
                      activeConversation?.matchId === conv.matchId
                        ? "font-bold"
                        : "font-semibold"
                    }`}
                  >
                    {conv.otherUserName}
                  </p>
                  <p
                    className={`text-sm text-gray-300 truncate ${
                      activeConversation?.matchId === conv.matchId ? "font-semibold" : ""
                    }`}
                  >
                    {conv.lastMessageContent}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>

        {/* prawa kolumna - wiadomości */}
        <div className="flex flex-col flex-1">
          {activeConversation ? (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {loadingMessages ? (
                  <div className="text-gray-400">Ładowanie wiadomości...</div>
                ) : (
                  messages.map((msg) => {
                    const isMe = msg.writtenBy === String(currentUserId);
                    return (
                      <div
                        key={msg.id}
                        className={`chat ${isMe ? "chat-end" : "chat-start"}`}
                      >
                        {!isMe && (
                          <div className="chat-image avatar">
                            <div className="w-10 rounded-full">
                              <img
                                src={activeConversation.photoUrl}
                                alt={activeConversation.otherUserName}
                              />
                            </div>
                          </div>
                        )}
                        <div
                          className={`chat-bubble ${
                            isMe
                              ? "bg-primary text-primary-content"
                              : "bg-secondary text-secondary-content"
                          }`}
                        >
                          <p>{msg.content}</p>
                          <span className="text-xs opacity-50 block">
                            {new Date(msg.createdAt).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
              <div className="p-4 border-t border-secondary flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Napisz wiadomość..."
                  className="input input-bordered flex-1"
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                />
                <button className="btn btn-primary" onClick={sendMessage}>
                  Wyślij
                </button>
              </div>
            </>
          ) : (
            <div
              className={`flex items-center justify-center flex-1 ${
                error ? "text-lg text-base-content" : "text-gray-500"
              }`}
            >
              {error ? (
                <p className="text-lg text-base-content text-center">
                  {error} <br />
                  Spróbuj ponownie za jakiś czas.
                </p>
              ) : (
                "Wybierz konwersację"
              )}
            </div>
          )}
        </div>
      </div>

      {error && (
        <div
          className={`fixed top-4 left-1/2 transform -translate-x-1/2 alert alert-error max-w-md mx-auto mt-8 z-50
                        transition-all duration-500 ease-in-out  ${
                          showError
                            ? "opacity-100 scale-100"
                            : "opacity-0 scale-90"
                        }`}
        >
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
