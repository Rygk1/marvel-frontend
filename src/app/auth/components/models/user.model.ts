export class User {
  constructor(
    public id: number,
    public email: number,
    public password: number,
    public name: string,
    public identification: string,
    public createdAt: string
  ) {}
}

//   {
//     "id": 2,
//     "email": "pepito.perez@email.com",
//     "password": "$2b$10$mnbipPerlIGFdfl4cErB4u.sq30.ZUhLOGc09C15gfTemKv.ADsAG",
//     "name": "pepito perez",
//     "identification": "1234567",
//     "createdAt": "2024-12-02T02:49:45.046Z"
// }
