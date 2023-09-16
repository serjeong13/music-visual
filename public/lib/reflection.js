export const sendUserInput = async (userInput) => {
  const res = await fetch(`/api/userInput`, {
    method: "POST",
    body: JSON.stringify({ userInput }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return await res.json();
};

export const sendReflection = async (payload) => {
  await fetch("/api/reflection", {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json",
    },
  });
};
