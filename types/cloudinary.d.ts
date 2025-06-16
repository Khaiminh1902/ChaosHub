declare module 'cloudinary-core' {
  export class Cloudinary {
    constructor(config: { cloud_name: string; api_key: string; api_secret: string; secure: boolean });
  }
}