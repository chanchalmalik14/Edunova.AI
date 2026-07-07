import React, { useState } from "react";

function AINotesPage() {
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [input, setInput] = useState("");
  const [image, setImage] = useState(null);

  const activeChat = chats.find((c) => c.id === activeChatId);

  const suggestions = [
    "Explain Photosynthesis",
    "AI in simple terms",
    "Newton's Laws",
    "Python basics",
    "Important exam questions",
    "Quantum physics",
  ];

  // create chat ONLY if needed (NO UI reset)
  const createChatIfNeeded = (title = "New Chat") => {
    const newChat = {
      id: Date.now(),
      title,
      messages: [],
    };

    setChats((prev) => [newChat, ...prev]);
    setActiveChatId(newChat.id);
    return newChat.id;
  };

  const handleSend = async (customText = null) => {
    const textToSend = typeof customText === "string" ? customText : input;
    if (!textToSend.trim()) return;

    setInput("");
    setImage(null);

    let chatId = activeChatId;

    if (!chatId) {
      chatId = createChatIfNeeded(textToSend.slice(0, 20));
    }

    const userMsg = {
      role: "user",
      text: textToSend,
      image,
    };

    const aiMsg = {
      role: "ai",
      text: "⌛ Generating AI Notes...",
    };

    setChats((prev) =>
      prev.map((chat) =>
        chat.id === chatId
          ? {
              ...chat,
              messages: [...chat.messages, userMsg, aiMsg],
              title:
                chat.title === "New Chat"
                  ? textToSend.slice(0, 25)
                  : chat.title,
            }
          : chat
      )
    );

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://127.0.0.1:8000/generate-summary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ text: textToSend })
      });

      const data = await response.json();

      if (response.ok && data.summary) {
        setChats((prev) =>
          prev.map((chat) => {
            if (chat.id === chatId) {
              const updatedMessages = [...chat.messages];
              const placeholderIndex = updatedMessages.length - 1;
              updatedMessages[placeholderIndex] = {
                role: "ai",
                text: data.summary,
              };
              return { ...chat, messages: updatedMessages };
            }
            return chat;
          })
        );
      } else {
        throw new Error(data.error || "Failed to generate summary");
      }
    } catch (err) {
      console.error(err);
      setChats((prev) =>
        prev.map((chat) => {
          if (chat.id === chatId) {
            const updatedMessages = [...chat.messages];
            const placeholderIndex = updatedMessages.length - 1;
            updatedMessages[placeholderIndex] = {
              role: "ai",
              text: `❌ Error: ${err.message || "Could not connect to AI service."}`,
            };
            return { ...chat, messages: updatedMessages };
          }
          return chat;
        })
      );
    }
  };

  const startFromSuggestion = (text) => {
    createChatIfNeeded(text);
    handleSend(text);
  };

  return (
    <div className="h-screen flex bg-gray-950 text-white">

      {/* ================= SIDEBAR ================= */}
      <div className="w-64 bg-black/40 border-r border-white/10 flex flex-col">

        <div className="p-4">
          <h1 className="text-lg font-light">
            Edunova<span className="text-blue-400 font-semibold">.AI</span>
          </h1>

          <button
            onClick={() => createChatIfNeeded()}
            className="mt-4 w-full bg-blue-500 hover:bg-blue-600 py-2 rounded-xl"
          >
            + New Chat
          </button>
        </div>

        {/* CHAT HISTORY (NEVER LOST) */}
        <div className="flex-1 overflow-y-auto px-2 space-y-2">

          {chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => setActiveChatId(chat.id)}
              className={`p-3 rounded-xl cursor-pointer text-sm truncate ${
                chat.id === activeChatId
                  ? "bg-blue-500/20"
                  : "hover:bg-white/10"
              }`}
            >
              {chat.title}
            </div>
          ))}

        </div>
      </div>

      {/* ================= MAIN AREA ================= */}
      <div className="flex-1 flex flex-col">

        {/* CHAT CONTENT */}
        <div className="flex-1 overflow-y-auto p-6">

          {/* ================= WELCOME SCREEN ================= */}
          {!activeChat || activeChat.messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">

              <h1 className="text-4xl font-light">
                Ask anything to <span className="text-blue-400">Edunova.AI</span>
              </h1>

              <p className="text-gray-400 mt-3">
                Your AI notes assistant for learning smarter 🚀
              </p>

              {/* suggestions */}
              <div className="grid grid-cols-2 gap-3 mt-10 max-w-2xl">

                {suggestions.map((s, i) => (
                  <div
                    key={i}
                    onClick={() => startFromSuggestion(s)}
                    className="bg-white/5 border border-white/10 hover:bg-white/10 p-4 rounded-xl cursor-pointer"
                  >
                    {s}
                  </div>
                ))}

              </div>

            </div>
          ) : (
            <>
              {/* ================= MESSAGES ================= */}
              {activeChat.messages.map((msg, i) => (
                <div key={i} className="mb-4">

                  <div
                    className={`max-w-2xl p-4 rounded-2xl whitespace-pre-line ${
                      msg.role === "user"
                        ? "bg-blue-500/20 ml-auto"
                        : "bg-white/5 border border-white/10"
                    }`}
                  >
                    {msg.text}

                    {/* IMAGE SUPPORT */}
                    {msg.image && (
                      <img
                        src={URL.createObjectURL(msg.image)}
                        className="mt-3 rounded-xl max-h-60"
                      />
                    )}
                  </div>

                </div>
              ))}
            </>
          )}

        </div>

        {/* ================= INPUT BAR ================= */}
        <div className="p-4 border-t border-white/10">

          <div className="max-w-3xl mx-auto flex items-center gap-3 bg-white/5 p-3 rounded-2xl">

            <label className="cursor-pointer text-xl px-2">
              📎
              <input
                type="file"
                hidden
                onChange={(e) => setImage(e.target.files[0])}
              />
            </label>

            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask your doubt..."
              className="flex-1 bg-transparent outline-none"
            />

            <button
              onClick={handleSend}
              className="bg-blue-500 px-5 py-2 rounded-xl hover:bg-blue-600"
            >
              Send
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}

export default AINotesPage;