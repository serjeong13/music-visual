// pages/reflectionPage.jsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function ReflectionPage() {
  const [reflections, setReflections] = useState([]);
  const router = useRouter();
  const { email, trackId } = router.query;

  const listenToTrackAgain = () => {
    // Navigate to the track page
    router.push(`/track/${trackId}`);
  };

  useEffect(() => {
    if (email && trackId) {
      // Fetch reflections for this track
      const fetchData = async () => {
        const res = await fetch(
          `/api/reflection?email=${email}&trackId=${trackId}`
        );
        const data = await res.json();
        if (res.status === 200) {
          setReflections(data.reflection);
        }
      };
      fetchData();
    }
  }, [email, trackId]);

  return (
    <div className="mt-16 text-center">
      {reflections.map((reflection, index) => (
        <div key={index}>
          {reflection.userInput.map((input, i) => (
            <div key={i}>
              {/* Display userInput */}
              <p>{input}</p>

              {/* Display corresponding image */}
              {reflection.imageUrl[i] && (
                <div className="flex justify-center items-center mb-6">
                  {" "}
                  <img
                    src={`data:image/jpeg;base64,${reflection.imageUrl[i]}`}
                    alt={`User image ${i}`}
                    width={300}
                    height={300}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
      <button className="mb-8" onClick={listenToTrackAgain}>
        Listen to the Track Again
      </button>
    </div>
  );
}
