import dbConnect from "../../../../db/connect";
import Reflection from "../../../../db/models/Reflection";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "POST") {
    try {
      const {
        email,
        trackId,
        trackName,
        artistName,
        trackImage,
        userInput,
        imageUrl,
      } = req.body;
      let reflection = await Reflection.findOne({ email, trackId });

      if (reflection) {
        await Reflection.updateOne(
          { email, trackId },
          {
            $push: {
              userInput: userInput,
              imageUrl: imageUrl,
            },
          }
        );
        reflection = await Reflection.findOne({ email, trackId });
      } else {
        reflection = await Reflection.create({
          email: email,
          trackId: trackId,
          trackName: trackName,
          artistName: artistName,
          trackImage: trackImage,
          userInput: [userInput],
          imageUrl: [imageUrl],
        });
      }
      res.status(200).json({ reflection });
    } catch (error) {
      console.error("Database Error: ", error);
      res.status(400).json({ success: false, error: error.toString() });
    }
  }

  if (req.method === "GET") {
    const { email, trackId } = req.query;
    try {
      const reflection = await Reflection.find({ email, trackId });

      if (!reflection) {
        res.status(400).json({ success: false, error: "Reflection not found" });
      }
      res.status(200).json({ reflection });
    } catch (error) {
      console.error("Database Error: ", error);
      res.status(400).json({ success: false, error: error.toString() });
    }
  }
}
