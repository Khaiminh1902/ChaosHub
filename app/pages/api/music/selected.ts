/* eslint-disable @typescript-eslint/no-unused-vars */
import type { NextApiRequest, NextApiResponse } from 'next';
import { Music } from '../../../../types/music';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { userId } = req.query as { userId: string };
    try {
      const response = await fetch(`${process.env.UPSTASH_REST_API_URL}/get/user:${userId}:selected`, {
        headers: { Authorization: `Bearer ${process.env.UPSTASH_REST_API_TOKEN}` },
      });
      const selected = await response.json();
      res.status(200).json(selected.result ? (JSON.parse(selected.result) as Music) : null);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch selected music' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}