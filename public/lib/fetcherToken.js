const fetcherToken = async (url, refreshToken) => {
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

export default fetcherToken;
