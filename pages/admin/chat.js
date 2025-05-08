import dynamic from "next/dynamic";

const AdminChatBot = dynamic(() => import("@/components/chatbot/AdminChatBot"), { ssr: false });

export default function AdminChatPage() {
  return <AdminChatBot />;
}
