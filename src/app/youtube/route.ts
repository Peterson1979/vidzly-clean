import type { NextRequest } from 'next/server';

const YOUTUBE_API_BASE_URL = 'https://www.googleapis.com/youtube/v3'; 

export async function POST(request: NextRequest) {
  const { searchTerm, pageToken, count = 8 } = await request.json();
  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey || apiKey === 'YOUR_YOUTUBE_API_KEY_NOT_SET') {
    return Response.json({ error: 'YouTube API key not set', videos: [] }, { status: 500 });
  }

  let searchUrl = `${YOUTUBE_API_BASE_URL}/search?part=snippet&type=video&q=${encodeURIComponent(searchTerm)}&key=${apiKey}&maxResults=${count}`;
  if (pageToken) searchUrl += `&pageToken=${pageToken}`;

  try {
    const res = await fetch(searchUrl);
    const data = await res.json();

    const videos = data.items?.map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnailUrl: item.snippet.thumbnails.high.url,
      videoUrl: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      channelTitle: item.snippet.channelTitle,
      publishDate: item.snippet.publishedAt,
    })) || [];

    return Response.json({
      videos,
      nextPageToken: data.nextPageToken,
      hasMore: !!data.nextPageToken,
    });
  } catch (error) {
    console.error('[YouTube API Error]', error);
    return Response.json({ videos: [] }, { status: 500 });
  }
}