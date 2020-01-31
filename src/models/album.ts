import { User } from './user';
import { Photo } from './photo';
import { Model, ModelConfig, RelationType } from './model';

export class Album extends Model {
  title: string;
  userId: number;
  readonly user?: User | null;
  readonly photos?: Photo[];

  static config: ModelConfig = {
    endpoint: '/albums',
    relations: {
      user: {
        type: RelationType.BelongsTo,
        model: User,
        foreignKey: 'userId',
      },
      photos: {
        type: RelationType.HasMany,
        model: Photo,
        foreignKey: 'albumId',
      },
    },
  };

  constructor(album: Album) {
    super(album.id);
    this.title = album.title;
    this.userId = album.userId;
    this.user = album.user;
    this.photos = album.photos;
  }
}
