import { Metadata } from "next"
import { ChatList } from "./_components/chat-list"
import { ChatWindow } from "./_components/chat-window"
import { ChatHeader } from "./_components/chat-header"

export const metadata: Metadata = {
  title: "Messages | DevPortfolio",
  description: "Chat with clients and team members",
}

export default function ChatPage() {
  return (
    <div className="flex h-[calc(100vh-8rem)] gap-4">
      {/* Chat List Sidebar */}
      <div className="w-80 border-r hidden md:block">
        <ChatHeader />
        <ChatList />
      </div>

      {/* Main Chat Window */}
      <div className="flex-1">
        <ChatWindow />
      </div>
    </div>
  )
}
