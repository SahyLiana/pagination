import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class QueryDto {
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  limit;

  @IsInt()
  @Type(() => Number)
  @IsOptional()
  skip;

  @IsString()
  @IsOptional()
  name;
}
