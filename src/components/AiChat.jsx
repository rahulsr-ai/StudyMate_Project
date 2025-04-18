import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, X } from 'lucide-react';
import { cn } from '@/lib/utils';



const AIChatDialog = ({ open, setOpen }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const chatContainerRef = useRef(null);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages((prevMessages) => [...prevMessages, { text: newMessage, isUser: true }]);
      // Simulate AI response (replace with actual API call)
      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: `AI: You said "${newMessage}"`, isUser: false },
        ]);
      }, 500);
      setNewMessage('');
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px] border rounded-md shadow-md">
        <DialogHeader className="pt-6 pb-4">
          <DialogTitle>Chat with AI</DialogTitle>
        </DialogHeader>
        <div className="p-4 space-y-4">
          <div
            ref={chatContainerRef}
            className="h-64 overflow-y-auto scroll-smooth p-2 bg-gray-100 rounded-md"
          >
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  'mb-2 p-2 rounded-md',
                  message.isUser ? 'bg-blue-500 text-white self-end' : 'bg-gray-200 text-gray-800 self-start'
                )}
              >
                {message.text}
              </div>
            ))}
          </div>
          <div className="flex items-center space-x-2">
            <Input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Message AI..."
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <Button onClick={handleSendMessage} size="sm">
              <Send className="h-4 w-4 mr-2" />
              Send
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};



export const OpenChatButton = ({ open, setOpen }) => {
  return (
    <Button onClick={() => setOpen(!open)}>
      {open ? <X className="h-4 w-4" /> : <Send className="h-4 w-4" />}
      {open ? 'Close Chat' : 'Open Chat'}
    </Button>
  );
};

const ExampleUsage = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  return (
    <div>
      <OpenChatButton open={isChatOpen} setOpen={setIsChatOpen} />
      <AIChatDialog open={isChatOpen} setOpen={setIsChatOpen} />
      <div className="p-4">
      <Button onClick={() => setChatOpen(true)} className="bg-blue-500">
        Open AI Chat
      </Button>

      <AIChatDialog
        open={chatOpen}
        setOpen={setChatOpen}
        context="Video title: How to Learn React | Description: Beginner guide to React."
        title="Study Assistant"
      />
    </div>



    </div>
  );
};

export default ExampleUsage;