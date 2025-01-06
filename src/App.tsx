import React, { useState, useEffect } from "react";
import "./App.css";
import Cewekk from "./assets/Cewekk.jpg";

// Replace with your actual API key
const API_KEY = "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";

// Define the system message
const systemMessage = {
  role: "system",
  content: "Be a good girlfriend",
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

  // Initialize the conversation
  async function promptInitialization() {
    setIsTyping(true);
    const apiRequestBody = {
      model: "gpt-3.5-turbo",
      messages: [
        systemMessage,
        {
          role: "user",
          content: `Kamu jadi pacar perempuan aku, tanya kabar aku dari ${props.interview_prompt}. Gunakan kata kata yang informal dan ngobrol layaknya manusia. kalimat tidak perlu terlalu panjang`,
        },
      ],
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
      console.error("Error initializing prompt:", error);
    } finally {
      setIsTyping(false);
    }
  }

  useEffect(() => {
    promptInitialization();
  }, []);

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
    <div className="App h-screen flex flex-col justify-between bg-white text-black">

      <div className="w-[20px] mt-5" style={{backgroundColor:"red"}}>Halo</div>
      {/* <div className="w-1/3 p-4">
        <img src={Cewekk} className="h-screen" />
      </div>
  
      <div className="w-2/3 p-4">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.direction}`}>
            <div className={`bubble ${msg.direction}`}>
              <strong>{msg.sender}:</strong> {msg.message}
            </div>
          </div>
        ))}
        {isTyping && <div className="typing-indicator">Pacar Aku is typing...</div>}
      </div>
  
      <div className="input-container p-4 border-t">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Type your message here..."
          className="border rounded px-2 py-1 w-full mb-2"
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleSend();
            }
          }}
        />
        <button
          onClick={handleSend}
          disabled={isTyping}
          className="bg-blue-500 text-white rounded px-4 py-2"
        >
          Send
        </button>
      </div> */}
    </div>
  );
  
};

export default App;
