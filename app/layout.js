export const metadata = {
  title: "DeepSeek Chatbot",
  description: "AI Chatbot dengan streaming response",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-100">{children}</body>
    </html>
  );
}
