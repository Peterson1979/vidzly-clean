export async function fetchTrendingVideos(): Promise<any> {
  const response = await fetch("/api/youtube", {
    method: "GET"
  });

  if (!response.ok) {
    throw new Error("YouTube proxy hívás sikertelen");
  }

  return await response.json();
}
