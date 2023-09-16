const fetcher = async (url) => {
  const response = await fetch(url);
  if (response.ok) {
    const data = await response.json();
    return data.playlists;
  } else {
    throw new Error(`Server responded with status: ${response.status}`);
  }
};

export const fetcherToken = async (url, refreshToken) => {
  try {
    const res = await fetch(url, refreshToken);
    if (!res.ok) {
      throw new Error("An error occurred while fetching the data");
    }
    return res.json();
  } catch (error) {
    throw new Error("Network response was not ok");
  }
};

export const fetcherReflection = async (url) => {
  const res = await fetch(url);
  if (res.status !== 200) {
    throw new Error("Failed to fetch data");
  }
  const data = await res.json();
  return data.reflection;
};

export default fetcher;
