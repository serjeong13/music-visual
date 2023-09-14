import generateImages from "./submitUserInput";

export default async function handler(req, res) {
  try {
    const userInput = req.body.userInput;
    if (!userInput) {
      // Return an error if userInput is not provided
      return res.status(400).json({ error: "User input is missing" });
    }

    generateImages(userInput, (err, data) => {
      if (err) {
        console.error("Failed to generate images: ", err);
        return res.status(500).json({ error: "Failed to generate images" });
      } else {
        return res.status(200).json(data);
      }
    });
  } catch (error) {
    console.error("An error occurred: ", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
