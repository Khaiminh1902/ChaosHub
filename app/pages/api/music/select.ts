/* eslint-disable @typescript-eslint/no-unused-vars */
import type { NextApiRequest, NextApiResponse } from 'next';
import { Music } from '../../../../types/music';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { musicId, userId } = req.body as { musicId: string; userId: string };
    try {
      const valueResponse = await fetch(`${process.env.UPSTASH_REST_API_URL}/get/music:${musicId}`, {
        headers: { Authorization: `Bearer ${process.env.UPSTASH_REST_API_TOKEN}` },
      });
      const music = await valueResponse.json();
      if (!music.result) {
        return res.status(404).json({ error: 'Music not found' });
      }
      await fetch(`${process.env.UPSTASH_REST_API_URL}/set/user:${userId}:selected`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.UPSTASH_REST_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: music.result,
      });
      res.status(200).json({ message: 'Music selected', music: JSON.parse(music.result) as Music });
    } catch (error) {
      res.status(500).json({ error: 'Failed to select music' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}