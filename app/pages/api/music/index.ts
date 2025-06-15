import type { NextApiRequest, NextApiResponse } from 'next';
import { Music } from '../../../../types/music';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('UPSTASH_REST_API_URL:', process.env.UPSTASH_REST_API_URL);
  console.log('UPSTASH_REST_API_TOKEN:', process.env.UPSTASH_REST_API_TOKEN);
  if (req.method === 'GET') {
    try {
      const response = await fetch(`${process.env.UPSTASH_REST_API_URL}/keys?match=music:*`, {
        headers: { Authorization: `Bearer ${process.env.UPSTASH_REST_API_TOKEN}` },
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const keys = await response.json();
      console.log('Keys response:', keys);
      const musicList: Music[] = [];
      if (keys.result) {
        for (const key of keys.result) {
          const valueResponse = await fetch(`${process.env.UPSTASH_REST_API_URL}/get/${key}`, {
            headers: { Authorization: `Bearer ${process.env.UPSTASH_REST_API_TOKEN}` },
          });
          if (!valueResponse.ok) throw new Error(`Failed to get ${key}`);
          const music = await valueResponse.json();
          musicList.push(JSON.parse(music.result));
        }
      }
      res.status(200).json(musicList);
    } catch (error) {
      console.error('Error fetching music:', error);
      res.status(500).json({ error: 'Failed to fetch music' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}