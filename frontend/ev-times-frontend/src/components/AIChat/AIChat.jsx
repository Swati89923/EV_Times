import { useState } from "react";
import "./AIChat.css";
import API from "../../services/api";

const AIChat = ({ isOpen, onClose }) => {

    const [message, setMessage] = useState("");

    const [messages, setMessages] = useState([
        {
            sender: "ai",
            text: "👋 Hello!\nI'm EV Times AI Assistant.\nAsk me anything related to Electric Vehicles."
        }
    ]);

    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const sendMessage = async () => {
console.log("Button clicked");
        if (message.trim() === "") return;

        const userMessage = message;

        setMessages(prev => [
            ...prev,
            {
                sender: "user",
                text: userMessage
            }
        ]);

        setMessage("");

        setLoading(true);

        try {

            const response = await API.get("/api/ai/chat", {
                params: {
                    message: userMessage
                }
            });

            setMessages(prev => [
                ...prev,
                {
                    sender: "ai",
                    text: response.data
                }
            ]);

        } catch (error) {

            setMessages(prev => [
                ...prev,
                {
                    sender: "ai",
                    text: "❌ Unable to connect with EV AI Assistant."
                }
            ]);

            console.log(error);

        } finally {

            setLoading(false);

        }

    };

    return (

        <div className="ai-chat">

            <div className="ai-chat-header">

                <h3>🤖 EV Times AI</h3>

                <button onClick={onClose}>✕</button>

            </div>

            <div className="ai-chat-body">

                {

                    messages.map((msg, index) => (

                        <div
                            key={index}
                            className={
                                msg.sender === "user"
                                    ? "user-message"
                                    : "ai-message"
                            }
                        >
                            {msg.text}
                        </div>

                    ))

                }

                {

                    loading &&

                    <div className="ai-message">

                        Thinking...

                    </div>

                }

            </div>

            <div className="ai-chat-footer">

                <input

                    type="text"

                    value={message}

                    placeholder="Ask about EV..."

                    onChange={(e) => setMessage(e.target.value)}

                    onKeyDown={(e) => {

                        if (e.key === "Enter") {

                            sendMessage();

                        }

                    }}

                />

                <button onClick={sendMessage}>

                    ➤

                </button>

            </div>

        </div>

    );

};

export default AIChat;