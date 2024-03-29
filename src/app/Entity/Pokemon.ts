import { FormEnum } from "../Enum/FormEnum";
import { Gender } from "../Enum/Gender";

export class Pokemon {
  id: number;
  name: string;
  gender: Gender;
  sprite: string;
  addedDate: Date | null | string;
  count: number;
  form: FormEnum;
}
