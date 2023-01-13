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

    setPrompt("");

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
          {Object.keys(trainingData).map((key) => (
            <option value={key}>{key}</option>
          ))}
        </select>
        <label htmlFor="prompt">Prompt:</label>
        <div>
          <input
            type="text"
            id="prompt"
            name="prompt"
            value={prompt}
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                e.target.form.dispatchEvent(
                  new Event("submit", { cancelable: true })
                );
              }
            }}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </div>
      </form>
      {response && <div className="response">{response}</div>}
    </div>
  );
};

export default GPT3;
