import { useRef, useEffect } from 'react';
import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { ChatMessage } from '@/components/chat/ChatMessage';
import { ChatInput } from '@/components/chat/ChatInput';
import { QuickReplies } from '@/components/chat/QuickReplies';
import { TypingIndicator } from '@/components/chat/TypingIndicator';
import { useChat } from '@/hooks/useChat';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function Chat() {
  const { messages, isTyping, sendMessage } = useChat();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <SidebarInset className="flex flex-col flex-1">
          {/* Header */}
          <header className="flex items-center gap-4 px-4 py-3 border-b border-border/50 bg-card">
            <SidebarTrigger className="-ml-1" />
            <div>
              <h1 className="text-lg font-semibold text-foreground">Chat with MindEase</h1>
              <p className="text-xs text-muted-foreground">Your supportive CBT companion</p>
            </div>
          </header>

          {/* Messages Area */}
          <ScrollArea ref={scrollRef} className="flex-1 p-4">
            <div className="max-w-3xl mx-auto space-y-4">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              {isTyping && <TypingIndicator />}
            </div>
          </ScrollArea>

          {/* Quick Replies */}
          <div className="border-t border-border/50 bg-muted/30">
            <div className="max-w-3xl mx-auto">
              <QuickReplies onSelect={sendMessage} disabled={isTyping} />
            </div>
          </div>

          {/* Input Area */}
          <div className="bg-card">
            <div className="max-w-3xl mx-auto">
              <ChatInput onSend={sendMessage} disabled={isTyping} />
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
