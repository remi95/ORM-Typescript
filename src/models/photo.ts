import { Model, ModelConfig } from './model';

export class Photo extends Model {
  albumId: number;
  thumbnailUrl: string;
  title: string;
  url: string;

  static config: ModelConfig = {
    endpoint: '/photos',
  };

  constructor(photo: Photo) {
    super(photo.id);
    this.albumId = photo.albumId;
    this.id = photo.id;
    this.thumbnailUrl = photo.thumbnailUrl;
    this.title = photo.title;
    this.url = photo.url;
  }
}
