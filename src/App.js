import axios from "axios";
import React, { useEffect, useState } from "react";
import { TbSend } from "react-icons/tb";
import { AiTwotoneMessage } from "react-icons/ai";
import { RiSunLine } from "react-icons/ri";

export default function App() {
  const [chatbotmessageList, setChatbotMessageList] = useState([]);
  const [usermessageList, setUserMessageList] = useState([]);
  const [message, setMessage] = useState("");
  const chatbotreadList = async () => {
    const { data } = await axios("http://localhost:9000/chatbot");
    setChatbotMessageList(data);
  };
  const userreadList = async () => {
    const { data } = await axios("http://localhost:9000/user");
    setUserMessageList(data);
  };

  const resetDB = async () => {
    const useridList = await axios("http://localhost:9000/user").then(
      ({ data }) => data.map((item) => item.id)
    );
    const chatbotidList = await axios("http://localhost:9000/chatbot").then(
      ({ data }) => data.map((item) => item.id)
    );
    await Promise.all(
      useridList.map((id) => axios.delete(`http://localhost:9000/user/${id}`)),
      chatbotidList.map((id) =>
        axios.delete(`http://localhost:9000/chatbot/${id}`)
      )
    );
  };

  useEffect(() => {
    (async () => {
      await chatbotreadList();
      await userreadList();
    })();
  }, []);

  const handleSubmit = async () => {
    axios.post("http://localhost:9000/user", {
      message,
    });
    const { data } = await axios.post(
      "https://main-chatbot-api-ainize-team.endpoint.ainize.ai/v1/bot/chat",
      {
        message,
      }
    );
    await axios.post("http://localhost:9000/chatbot", {
      message: data,
    });
    userreadList();
    chatbotreadList();
    setMessage("");
  };

  const handleClear = () => {
    resetDB();
    userreadList();
    chatbotreadList();
    setMessage("");
  };

  return (
    <div className="holebox">
      <div style={{ color: "#A56BEE" }}>
        <AiTwotoneMessage />
        AI chat
      </div>
      <div className="container">
        <div className="chattings">
          <span>
            {chatbotmessageList.map((msg1) => (
              <div key={msg1.id}>Chatbot: {msg1.message}</div>
            ))}
          </span>
          <br />
          <span>
            {usermessageList.map((msg2) => (
              <div key={msg2.id}>Human: {msg2.message}</div>
            ))}
          </span>
        </div>
        <div className="footer">
          <input
            className="bottominput"
            placeholder="Write Your Message..."
            type="text"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
          />
          <TbSend onClick={handleSubmit} className="sendicon" />
        </div>
      </div>
      <span onClick={handleClear} style={{ cursor: "pointer" }}>
        <RiSunLine />
        Clear Conversation
      </span>
    </div>
  );
}
