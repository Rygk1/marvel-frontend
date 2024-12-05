export class Favorite {
  constructor(
    public id: number,
    public userId: number,
    public comicId: number,
    public title: string,
    public thumbnail: string,
    public description: string,
    public createdAt: string
  ) {}
}
