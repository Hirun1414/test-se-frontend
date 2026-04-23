export default async function getHotel(id: string) {
  const isServer = typeof window === 'undefined';
  
  const url = isServer
    ? `${(process.env.BACKEND_URL || 'http://localhost:5000').replace(/\/$/, '')}/api/v1/hotels/${id}`
    : `/api/hotels/${id}`;

  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) throw new Error("Failed to fetch hotels");
  return await response.json();
}