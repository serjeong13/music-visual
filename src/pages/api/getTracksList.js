import Reflection from "../../../db/models/Reflection";
import dbConnect from "../../../db/connect";

export default async function handler(req, res) {
  await dbConnect();
  if (req.method === "GET") {
    try {
      const reflections = await Reflection.find();
      return res.status(200).json({ success: true, data: reflections });
    } catch (error) {
      return res.status(500).json({ success: false, error: "Server Error" });
    }
  }
}
