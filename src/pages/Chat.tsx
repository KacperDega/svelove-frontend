import React, { useEffect, useState, useRef } from "react";
import Navbar from "../components/Navbar";
import { apiRequest } from "../api";
import { Client } from "@stomp/stompjs";
import { useParams } from "react-router-dom";
import ErrorPopup from "../components/ErrorPopup";

const formatTimestamp = (timestamp: number) => {
  const date = new Date(timestamp);
  const today = new Date();

  const isToday =
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();

  if (isToday) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } else {
    return date.toLocaleDateString("pl-PL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }
};

interface ConversationDto {
  matchId: number;
  otherUserName: string;
  lastMessageContent: string;
  lastMessageTimestamp: string;
  photoUrl: string;
}

interface MessageResponseDto {
  messageId: number;
  content: string;
  writtenBy: number;
  timestamp: string;
}

interface MessageRequestDto {
  content: string;
  writtenBy: number;
  matchId: number;
}

const ChatPage: React.FC = () => {
  const [conversations, setConversations] = useState<ConversationDto[]>([]);
  const [messages, setMessages] = useState<MessageResponseDto[]>([]);
  const [activeConversation, setActiveConversation] = useState<ConversationDto | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [loadingConversations, setLoadingConversations] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showError, setShowError] = useState(true);
  const { matchId } = useParams<{ matchId: string }>();

  const clientRef = useRef<Client | null>(null);

  const currentUserId = localStorage.getItem("userId")
    ? parseInt(localStorage.getItem("userId")!)
    : 0;

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoadingConversations(true);
        const data = await apiRequest<ConversationDto[]>("/chat/conversations");
        // console.log("Fetched conversations:", data);
        setConversations(data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch conversations.");
      } finally {
        setLoadingConversations(false);
      }
    };

    fetchConversations();
  }, []);

  useEffect(() => {
    if (matchId) {
      const conv = conversations.find(c => c.matchId === Number(matchId));
      if (conv) {
        openConversation(conv);
      }
    }
  }, [matchId, conversations]);
  
  const openConversation = async (conv: ConversationDto) => {
    setActiveConversation(conv);
    setLoadingMessages(true);

    try {
      const data = await apiRequest<MessageResponseDto[]>(`/chat/${conv.matchId}`);
      setMessages(data);
      // console.log("Fetched messages:", data);

      if (clientRef.current) {
        clientRef.current.deactivate();
      }

      const client = new Client({
        brokerURL: "ws://localhost:8080/ws",
        reconnectDelay: 5000,
        connectHeaders: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
        debug: (str) => console.log(str),
      });

      client.onConnect = () => {
        console.log("Connected to WebSocket!");

        client.subscribe(`/topic/messages/${conv.matchId}`, (message) => {
          const body: MessageResponseDto = JSON.parse(message.body);
          setMessages((prev) => [...prev, body]);
        });
      };

      client.onStompError = (frame) => {
        console.error("STOMP error:", frame.headers["message"]);
        setError("Błąd połączenia WebSocket.");
      };

      client.activate();
      clientRef.current = client;
    } catch (err) {
      console.error(err);
      setError("Nie udało się pobrać wiadomości.");
    } finally {
      setLoadingMessages(false);
    }
  };

  const sendMessage = () => {
    if (!newMessage.trim() || activeConversation === null || !clientRef.current) return;

    const messageRequest: MessageRequestDto = {
      content: newMessage,
      writtenBy: currentUserId,
      matchId: activeConversation.matchId,
    };

    clientRef.current.publish({
      destination: `/app/chat/${activeConversation.matchId}`,
      body: JSON.stringify(messageRequest),
    });

    setNewMessage("");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">

        {/* lista konwersacji */}
        <div className="hidden md:flex flex-col w-1/5 border-r border-secondary overflow-y-auto">
          {loadingConversations ? (
            <div className="p-4 text-gray-400 flex items-center justify-center flex-1">Ładowanie...</div>
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

        {/* okno wiadomości */}
        <div className="flex flex-col flex-1">
          {activeConversation ? (
            <>
              <div className="flex-1 overflow-y-auto p-4 flex flex-col-reverse gap-3">
                {loadingMessages ? (
                  <div className="text-gray-400">Ładowanie wiadomości...</div>
                ) : (
                  messages.map((msg) => {
                    const isMe = msg.writtenBy === currentUserId;
                    return (
                      <div
                        key={msg.messageId}
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
                          title={new Date(msg.timestamp).toLocaleString()}
                          className={`chat-bubble ${
                            isMe
                              ? "bg-primary text-primary-content"
                              : "bg-secondary text-secondary-content"
                          }`}
                        >
                          <p>{msg.content}</p>
                          <span className="text-xs opacity-50 block">
                            {formatTimestamp(Number(msg.timestamp))}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
              {/* okno wpisywania wiadomości */}
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

      <ErrorPopup error={error} showError={showError} setShowError={setShowError}/>
    </div>
  );
};

export default ChatPage;
