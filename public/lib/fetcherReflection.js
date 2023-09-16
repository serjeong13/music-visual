const fetcherReflection = async (url) => {
  const res = await fetch(url);
  if (res.status !== 200) {
    throw new Error("Failed to fetch data");
  }
  const data = await res.json();
  return data.reflection;
};

export default fetcherReflection;
