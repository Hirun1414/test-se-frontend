export default async function getHotel(id: string) {
  const isServer = typeof window === 'undefined';
  const base = isServer
    ? (process.env.BACKEND_URL || 'http://localhost:5000').replace(/\/$/, '')
    : '';

  const response = await fetch(`${base}/api/v1/hotels/${id}`, { cache: 'no-store' });
  if (!response.ok) throw new Error("Failed to fetch hotels");
  return await response.json();
}