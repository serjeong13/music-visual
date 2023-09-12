import generateImages from "./submitUserInput";

export default async function handler(req, res) {
  console.log(req.body);
  const userInput = req.body.userInput;
  generateImages(userInput, (err, data) => {
    if (err) {
      res.status(500).json({ error: "failed to generate images" });
    } else {
      res.status(200).json(data);
    }
  });
}
