import Dexie, { Table } from 'dexie';

interface Track {
  id?: number;
  userId: string;
  fileName: string;
  cloudinaryUrl: string;
  createdAt: Date;
}

class MusicAppDB extends Dexie {
  tracks!: Table<Track>;

  constructor() {
    super('MusicAppDB');
    this.version(1).stores({
      tracks: '++id, userId, fileName, cloudinaryUrl, createdAt',
    });
  }
}

const db = new MusicAppDB();
export default db;