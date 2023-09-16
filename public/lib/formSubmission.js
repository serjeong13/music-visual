import { mutate } from "swr";
import { sendUserInput, sendReflection } from "./reflection";

const submitForm = async (userInput, session, props) => {
  const data = await sendUserInput(userInput);

  const payload = {
    email: session.session.user.email,
    trackId: props.track.id,
    trackName: props.track.name,
    artistName: props.track.artists[0].name,
    trackImage: props.track.album.images[0].url,
    userInput: userInput,
    imageUrl: data.data[0].b64_json,
  };

  mutate(
    `/api/reflection?email=${session.session.user.email}&trackId=${props.track.id}`,
    { ...retrievedReflection, ...payload },
    false
  );

  if (data.data) {
    setImageUrl(data.data[0].b64_json);
    payload.imageUrl = data.data[0].b64_json;
  }

  await sendReflection(payload);

  mutate(
    `/api/reflection?email=${session.session.user.email}&trackId=${props.track.id}`
  );
};

export default submitForm;
