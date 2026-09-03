import { useState, useRef, useEffect } from "react";
import { Bot, Send, Sparkles, User, Loader2, AlertCircle } from "lucide-react";

const AIAssistant = ({
  contractTitle = "this contract",
  onAsk,
  asking = false,
  error = "",
}) => {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([
    {
      id: "init",
      role: "assistant",
      content: `Hello! I'm ready to answer questions about ${contractTitle}. I have indexed and vectorized the clauses for semantic retrieval.`,
      time: "Just now",
    },
  ]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, asking]);

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!question.trim() || asking) return;

    const userPrompt = question.trim();
    const userMsg = {
      id: Date.now().toString(),
      role: "user",
      content: userPrompt,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setQuestion("");

    try {
      const response = await onAsk(userPrompt);
      if (response && response.answer) {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: response.answer,
            sources: response.sources || [],
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
      }
    } catch {
      // Error handled by parent
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-950/90 border border-zinc-200 dark:border-zinc-800/80 rounded-2xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-zinc-200 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-900/50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/30">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
              AI Assistant
            </h3>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
              <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium">
                RAG Active
              </span>
            </div>
          </div>
        </div>

        <div className="p-1 rounded-md text-zinc-400">
          <Sparkles className="w-4 h-4 text-blue-500 dark:text-blue-400" />
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 min-h-[300px] max-h-[520px] lg:max-h-[640px]">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-2.5 ${
              msg.role === "user" ? "flex-row-reverse" : "flex-row"
            }`}
          >
            {/* Avatar */}
            {msg.role === "assistant" ? (
              <div className="w-7 h-7 rounded-full bg-blue-600/15 border border-blue-500/30 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="w-3.5 h-3.5" />
              </div>
            ) : (
              <div className="w-7 h-7 rounded-full bg-linear-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">
                <User className="w-3.5 h-3.5" />
              </div>
            )}

            {/* Bubble */}
            <div
              className={`flex flex-col gap-1 max-w-[85%] ${
                msg.role === "user" ? "items-end" : "items-start"
              }`}
            >
              <div
                className={`p-3.5 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap break-words ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white rounded-tr-xs shadow-md shadow-blue-600/20"
                    : "bg-zinc-100 dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-200 rounded-tl-xs shadow-xs"
                }`}
              >
                {msg.content}

                {/* Sources list if provided */}
                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-zinc-200 dark:border-zinc-800/80 text-[10px] text-zinc-500 dark:text-zinc-400">
                    <span className="font-semibold block mb-1 text-zinc-700 dark:text-zinc-300">
                      Referenced Chunks:
                    </span>
                    <div className="space-y-1">
                      {msg.sources.slice(0, 2).map((s, idx) => (
                        <div
                          key={idx}
                          className="bg-white dark:bg-zinc-950/60 p-1.5 rounded text-[10px] border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 line-clamp-2"
                        >
                          {s.content}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <span className="text-[9px] text-zinc-400 dark:text-zinc-500 px-1">
                {msg.time}
              </span>
            </div>
          </div>
        ))}

        {/* Thinking Indicator */}
        {asking && (
          <div className="flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-full bg-blue-600/15 border border-blue-500/30 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="p-3.5 rounded-2xl rounded-tl-xs bg-zinc-100 dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-600 dark:text-zinc-400 flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-500 dark:text-blue-400" />
              <span>Thinking & analyzing contract...</span>
            </div>
          </div>
        )}

        {/* Error notification */}
        {error && (
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 dark:text-rose-400 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span className="line-clamp-2">{error}</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 border-t border-zinc-200 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-900/40 flex flex-col gap-1.5">
        <form onSubmit={handleSend} className="relative flex items-center">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={asking}
            placeholder="Ask a question about this contract..."
            className="w-full pr-11 pl-3.5 py-2.5 rounded-xl text-xs bg-white dark:bg-zinc-900/90 border border-zinc-300 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all disabled:opacity-50"
          />

          <button
            type="submit"
            disabled={!question.trim() || asking}
            className="absolute right-1.5 p-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-40 disabled:hover:bg-blue-600 transition-all cursor-pointer disabled:cursor-not-allowed shadow-xs shadow-blue-500/20"
            aria-label="Send question"
          >
            {asking ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
          </button>
        </form>

        <p className="text-[10px] text-center text-zinc-500 dark:text-zinc-400">
          AI can make mistakes. Verify important information.
        </p>
      </div>
    </div>
  );
};

export default AIAssistant;
