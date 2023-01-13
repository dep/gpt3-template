const express = require("express");
const bodyParser = require("body-parser");
const { Configuration, OpenAIApi } = require("openai");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const configuration = new Configuration({
  apiKey: "YOUR_API_KEY"
});
const openai = new OpenAIApi(configuration);

let lastSentTrainingDataType = "";

let ongoingPrompt = "";

app.post("/gpt3", async (req, res) => {
  const currentTrainingDataType = req.body.dataToSend;
  let prompt = "";

  if (currentTrainingDataType === lastSentTrainingDataType) {
    ongoingPrompt = ongoingPrompt + "User: " + req.body.prompt + "\nYou: ";
    prompt = ongoingPrompt;
  } else {
    ongoingPrompt = req.body.dataToSend;
    prompt = ongoingPrompt + "User: " + req.body.prompt + "\nYou: ";
  }

  lastSentTrainingDataType = currentTrainingDataType;

  await openai
    .createCompletion({
      model: "text-davinci-003",
      prompt,
      max_tokens: 1000,
      temperature: 0.5,
    })
    .then((response) => {
      res.json({
        text: response.data.choices[0].text
          .replace(/You:/g, "")
          .replace(/User:.*$/g, ""),
      });
      ongoingPrompt = ongoingPrompt + "\nYou: " + response.data.choices[0].text;
    })
    .catch((err) => {
      console.log(err);
      res.json({
        error: err,
      });
    });
});

app.listen(3001, () => {
  console.log("Server started on port 3001");
});
