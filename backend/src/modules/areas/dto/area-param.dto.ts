import { IsMongoId, IsNotEmpty } from 'class-validator';

export class AreaParamDto {
  @IsMongoId()
  @IsNotEmpty()
  areaId!: string;
}
