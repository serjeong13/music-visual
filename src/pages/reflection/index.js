import { useRouter } from "next/router";
import useSWR from "swr";
import { fetcherReflection } from "../../../public/lib/fetcher";

export default function Reflection() {
  const router = useRouter();
  const { email, trackId } = router.query;

  const listenTrackAgain = () => {
    // Navigate to the track page
    router.push(`/track/${trackId}`);
  };

  // Using SWR to fetch the reflections for the track
  const { data: reflections, error } = useSWR(
    email && trackId
      ? `/api/reflection?email=${email}&trackId=${trackId}`
      : null,
    fetcherReflection
  );

  if (error)
    return (
      <div className="text-red-600 font-medium">Error: {error.message}</div>
    );
  if (!reflections)
    return <div className="text-gray-500 font-medium">Loading...</div>;

  return (
    <div className="mt-16 text-center font-bold">
      {reflections.map((reflection, index) => (
        <div key={index}>
          {reflection.userInput.map((input, i) => (
            <div key={i}>
              <p>{input}</p>
              {reflection.imageUrl[i] && (
                <div className="flex justify-center items-center mb-6">
                  <img
                    src={`data:image/jpeg;base64,${reflection.imageUrl[i]}`}
                    alt="userInput image"
                    width={300}
                    height={300}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
      <button className="mb-8" onClick={listenTrackAgain}>
        Listen this track again
      </button>
    </div>
  );
}
