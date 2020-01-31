import { AlbumModel, PhotoModel, UserModel } from './models';
import { Model, QueryFilterOrder } from './models/model';
import { API_BASE_URL } from '../config';
// import { Album } from './models/album';
import { User } from './models/user';

async function run() {
  const album: AlbumModel = await AlbumModel.findById(4, { includes: ['user'] });
  // const data = await AlbumModel.find({
  //   where: {
  //     albumId: 5,
  //   },
  //   limit: 5,
  //   sort: 'id',
  //   order: QueryFilterOrder.Desc,
  // });
  // const data = await AlbumModel.create(new AlbumModel({
  //   id: 1302,
  //   title: 'LALALALALA',
  //   userId: 1,
  // }));
  // const data = await AlbumModel.updateById(album);
  // const data = await AlbumModel.deleteById(3);

  if ('user' in album && album.user) {
    const data = await album.user.save();
    console.log(data);
  }
}

run().catch((err) => {
  console.error(err);
});
