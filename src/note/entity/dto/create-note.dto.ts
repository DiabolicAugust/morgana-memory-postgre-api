import { IsNotEmpty, IsString } from "class-validator";
import { Fields } from "../../../data/enums.js";
import { Strings } from "../../../data/strings.js";

export class CreateNoteDto {
  @IsString({ message: Strings.fieldMustBeString(Fields.Title) })
  @IsNotEmpty({ message: Strings.fieldCantBeEmpty(Fields.Title) })
  title: string;

  @IsString({ message: Strings.fieldMustBeString(Fields.Description) })
  @IsNotEmpty({ message: Strings.fieldCantBeEmpty(Fields.Description) })
  description: string;
}
