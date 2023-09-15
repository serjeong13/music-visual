import https from "https";

export const generateImages = async (userInput) => {
  return new Promise((resolve, reject) => {
    const payLoad = JSON.stringify({
      prompt: userInput,
      n: 1,
      response_format: "b64_json",
      size: "256x256",
    });

    const options = {
      hostname: "api.openai.com",
      path: "/v1/images/generations",
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-length": payLoad.length,
      },
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        resolve(JSON.parse(data));
      });

      res.on("error", (err) => {
        console.error("Error generating images", err);
        reject(err);
      });
    });

    req.on("error", (err) => {
      console.error("Error generating images", err);
      callback(err);
    });

    req.write(payLoad);
    req.end();
  });
};

export default generateImages;
