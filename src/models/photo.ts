import { Model, ModelConfig, RelationType } from './model';
import { Album } from '~/models/album';

export class Photo extends Model {
  albumId: number;
  thumbnailUrl: string;
  title: string;
  url: string;

  static config: ModelConfig = {
    endpoint: '/photos',
    relations: {
      album: {
        type: RelationType.BelongsTo,
        model: Album,
        foreignKey: 'albumId',
      },
    },
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
