const fetcher = async (url) => {
  const response = await fetch(url);
  if (response.ok) {
    const data = await response.json();
    return data.playlists;
  } else {
    throw new Error(`Server responded with status: ${response.status}`);
  }
};

export default fetcher;
