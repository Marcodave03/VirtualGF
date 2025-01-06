import React, { useState, useEffect } from "react";
import Cewekk from "./assets/Cewekk.jpg";

// Replace with your actual API key
const API_KEY = "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";

// Define the system message
const systemMessage = {
  role: "system",
  content: "Kamu jadi pacar perempuan aku, tanya kabar aku dari ${props.interview_prompt}. Gunakan kata kata yang informal dan ngobrol layaknya manusia. kalimat tidak perlu terlalu panjang",
};

// Define the message type
type Message = {
  message: string;
  sender: string;
  direction: "incoming" | "outgoing";
};

// Define the props type
type InterviewProps = {
  interview_prompt: string | undefined;
};

const App: React.FC<InterviewProps> = (props) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [userInput, setUserInput] = useState("");

  // Handle sending a message
  const handleSend = async () => {
    if (!userInput.trim()) return;

    const newMessage: Message = {
      message: userInput,
      direction: "outgoing",
      sender: "Aku",
    };

    const newMessages = [...messages, newMessage];

    setMessages(newMessages);
    setUserInput("");
    setIsTyping(true);
    await processMessageToChatGPT(newMessages);
  };

  // Process messages for ChatGPT
  async function processMessageToChatGPT(chatMessages: Message[]) {
    const apiMessages = chatMessages.map((messageObject) => {
      const role = messageObject.sender === "Pacar Aku" ? "assistant" : "user";
      return { role, content: messageObject.message };
    });

    const apiRequestBody = {
      model: "gpt-3.5-turbo",
      messages: [systemMessage, ...apiMessages],
    };

    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(apiRequestBody),
        }
      );
      const data = await response.json();
      console.log(data);

      setMessages((prevMessages) => [
        ...prevMessages,
        {
          message: data.choices[0].message.content,
          sender: "Pacar Aku",
          direction: "incoming",
        },
      ]);
    } catch (error) {
      console.error("Error processing message:", error);
    } finally {
      setIsTyping(false);
    }
  }

  return (
    <div className="h-screen w-[100%] flex overflow-hidden">
      <div className="w-[30vw] bg-pink-300">
        <img src={Cewekk} className="m-10 h-[90%] object-cover" />
      </div>

      <div className="w-[70vw] bg-pink-200 overflow-hidden">
        <div className="m-4 h-[85vh] text-black space-between">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.direction}`}>
              <div className={`bubble ${msg.direction} text-[30px]`}>
                <strong>{msg.sender}:</strong> {msg.message}
              </div>
            </div>
          ))}
          
        </div>

        <div className="input-container p-4 border-t-4 border-t-pink-900 h-[10vh] flex flex-row">
        {isTyping && <div className="typing-indicator text-[30px]">Pacar Aku is typing...</div>}
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Type your message here..."
            className="border rounded px-2 py-1 w-[78vw] h-[6vh] mb-2 mr-4 text-[20px]"
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleSend();
              }
            }}
          />
          <button
            onClick={handleSend}
            disabled={isTyping}
            className="bg-blue-500 text-[20px] text-white rounded px-4 py-2 w-[18vw] h-[6vh]"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
