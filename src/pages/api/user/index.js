import dbConnect from "../../../../db/connect";
import User from "../../../../db/models/User";

export default async function handler(req, res) {
  await dbConnect();

  console.log("req", req.body);

  if (req.method === "POST") {
    try {
      const { email, name, image } = req.body;
      const user = await User.findOne({ email: email });
      console.log("user", email, name, image);
      if (!!user) {
        res.status(200).json({ user });
      } else {
        const newUser = await User.create({
          email: email,
          name: name,
          image: image,
        });
        res.status(200).json({ newUser });
      }
    } catch (error) {
      res.status(400).json({ success: false });
    }
  }
}
