import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar } from "@/components/ui/avatar";
import { AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, X, Send, Copy } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export function ChatDialog({ open, setOpen, prompt, setPrompt, getSummary }) {
  const notify = () => toast.success("Copied to clipboard");

  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!prompt.trim()) return;

    const newMessage = { role: "user", content: prompt };
    setMessages((prev) => [...prev, newMessage]);
    setPrompt("");
    setIsLoading(true);

  
      const res = await getSummary();
    


    console.log("response from getAIResponse ", res);
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: res?.response },
    ]);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-0 right-3 z-50">
      <Dialog open={open} onOpenChange={setOpen}>
        <Toaster />
        <DialogContent
          className="fixed bottom-[72px] right-4 !rounded-lg !p-0 !gap-0 bg-black text-white border-gray-800 w-[380px] max-h-[80vh] min-h-[400px] overflow-hidden overflow-y-auto 
          hide-scrollbar"
          style={{ transform: "translateX(0)" }}
        >
          <div className="flex flex-col h-full sticky top-0">
            <div className="sticky top-0 z-10 bg-black border-b border-gray-800 px-4 py-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Chat with AI</h2>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <ScrollArea className="flex-1 p-4 ">
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex items-start gap-2.5 ${
                      message.role === "user" ? "flex-row-reverse" : ""
                    }`}
                  >
                    <Avatar
                      className={`h-8 w-8 flex-shrink-0 ${
                        message.role === "assistant"
                          ? "bg-blue-600"
                          : "bg-gray-600"
                      }`}
                    >
                      <AvatarImage
                        src={
                          message.role === "assistant"
                            ? "https://api.dicebear.com/7.x/bottts/svg?seed=1"
                            : ""
                        }
                      />
                      <AvatarFallback>
                        {message.role === "user" ? "U" : "AI"}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={`rounded-lg px-3 py-2 break-words whitespace-pre-wrap max-w-[75%] text-sm ${
                        message.role === "user"
                          ? "bg-blue-600 text-white ml-auto"
                          : "bg-gray-800 text-white"
                      }`}
                      style={{
                        wordBreak: "break-word",
                        overflowWrap: "break-word",
                      }}
                    >
                      {message.role !== "user" && (
                        <div
                          onClick={() => {
                            navigator.clipboard.writeText(message.content);
                            notify();
                          }}
                          className="flex justify-end cursor-pointer"
                        >
                          <Copy className="hover:scale-95" size={15} />
                        </div>
                      )}

                      {message.content}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex items-start gap-2.5">
                    <Avatar className="h-8 w-8 flex-shrink-0 bg-blue-600">
                    
                      <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                    <div className="bg-gray-800 rounded-lg px-3 py-2 text-white text-sm">
                      <span className="animate-pulse">...</span>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            <div className="p-4 border-t border-gray-800 bg-black sticky bottom-0 left-0 right-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex gap-2"
              >
                <Input
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-gray-900 border-gray-700 text-white min-h-[40px] max-h-[120px] overflow-y-auto resize-none"
                  style={{
                    wordBreak: "break-word",
                    overflowWrap: "break-word",
                  }}
                />
                <Button
                  type="submit"
                  size="icon"
                  className="bg-blue-600 hover:bg-blue-700 flex-shrink-0 h-10 w-10"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

const GptAi = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gradient-to-br from-zinc-900 to-black">
      <ChatDialog open={open} setOpen={setOpen} />
    </div>
  );
};

export default GptAi;
