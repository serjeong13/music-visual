import axios from "axios";

export default async function handler(req, res) {
  try {
    const userInput = req.body.userInput;

    if (!userInput) {
      return res.status(400).json({ error: "User input is missing" });
    }

    const payLoad = {
      prompt: userInput,
      n: 1,
      response_format: "b64_json",
      size: "256x256",
    };

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    };

    const response = await axios.post(
      "https://api.openai.com/v1/images/generations",
      payLoad,
      { headers }
    );

    return res.status(200).json(response.data);
  } catch (error) {
    console.error("An error occurred: ", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
