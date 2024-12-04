export class Favorite {
  constructor(
    public userId: number,
    public comicId: number,
    public title: string,
    public thumbnail: string,
    public description: string
  ) {}
}
