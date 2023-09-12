import https from "https";

const OpenAIEndpoint = "https://api.openai.com/v1/images/generations";
const headers = {
  "content-type": "application/json",
  Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
};

const generateImages = async (userInput, callback) => {
  const payLoad = JSON.stringify({
    prompt: userInput,
    n: 2,
  });

  const options = {
    hostname: "api.openai.com",
    path: "/v1/images/generations",
    method: "POST",
    headers: {
      ...headers,
      "Content-length": payLoad.length,
    },
  };

  const req = https.request(options, (res) => {
    let data = "";

    res.on("data", (chunk) => {
      data += chunk;
    });

    res.on("end", () => {
      callback(null, JSON.parse(data));
    });
  });

  req.on("error", (err) => {
    console.error("Error generating images", err);
    callback(err);
  });

  req.write(payLoad);
  req.end();
};

export default generateImages;
