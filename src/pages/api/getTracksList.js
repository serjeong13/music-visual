import Reflection from "../../../db/models/Reflection";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const reflections = await Reflection.find({}, "trackId").distinct(
        "trackId"
      );
      return res.status(200).json({ success: true, data: reflections });
    } catch (error) {
      return res.status(500).json({ success: false, error: "Server Error" });
    }
  }
}
