import Reflection from "../../../../db/models/Reflection";
import dbConnect from "../../../../db/connect";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method !== "GET") {
    res.status(405).end(); // Method Not Allowed
    return;
  }

  try {
    const reflections = await Reflection.find();
    if (reflections.length === 0) {
      return res.status(404).json({ success: false, message: "No data found" });
    }
    return res.status(200).json({ success: true, data: reflections });
  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({ success: false, error: "Server Error" });
  }
}
