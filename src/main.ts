import { AlbumModel } from './models';

async function run() {
  const album: AlbumModel = await AlbumModel.findById(4, { includes: ['user'] });

  if ('user' in album && album.user) {
    const data = await album.user.save();
    console.log(data);
  }
}

run().catch((err) => {
  console.error(err);
});
