import { IUser } from 'app/core/user/user.model';

export interface IBenefit {
  id?: number;
  name?: string;
  isUsedBies?: IUser[];
}

export class Benefit implements IBenefit {
  constructor(public id?: number, public name?: string, public isUsedBies?: IUser[]) {}
}
