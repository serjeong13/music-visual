// pages/reflectionPage.jsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function ReflectionPage() {
  const [reflections, setReflections] = useState([]);
  const router = useRouter();
  const { email, trackId } = router.query;

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
    <div>
      {reflections.map((reflection, index) => (
        <div key={index}>
          {reflection.userInput.map((input, i) => (
            <div key={i}>
              {/* Display userInput */}
              <p>{input}</p>

              {/* Display corresponding image */}
              {reflection.imageUrl[i] && (
                <img
                  src={`data:image/jpeg;base64,${reflection.imageUrl[i]}`}
                  alt={`User image ${i}`}
                  width={200}
                  height={200}
                />
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
