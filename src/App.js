import React, { useState } from "react";
import "./App.css";

const trainingData = require("./trainingData.json");

const GPT3 = () => {
  const [prompt, setPrompt] = useState("");
  const [trainingDataType, setTrainingDataType] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const dataToSend = trainingData[trainingDataType || "none"];

      const res = await fetch("http://localhost:3001/gpt3", {
        method: "POST",
        body: JSON.stringify({ dataToSend, prompt }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      setResponse(data.text);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h1>GPT-3 Assistant</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="prompt">Model:</label>
        <select
          id="type"
          name="type"
          onChange={(e) => setTrainingDataType(e.target.value)}
          value={trainingDataType}
        >
          <option>None</option>
          <option value="retention">Retention Bot</option>
          <option value="optimism">Optimism Bot</option>
          <option value="confidence">Confidence Bot</option>
          <option value="negotiation">Negotiation Bot</option>
          <option value="snarky">Snarky Bot</option>
        </select>
        <label htmlFor="prompt">Prompt:</label>
        <div>
          <textarea
            type="text"
            id="prompt"
            name="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          >
            {prompt}
          </textarea>
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Loading..." : "Send to GPT-3"}
        </button>
      </form>
      {response && <div className="response">{response}</div>}
    </div>
  );
};

export default GPT3;
