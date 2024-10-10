import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { MaterialTemplateTypeEnum } from '@src/utils/enums/order-type.enum';
import { InfinityFindAllDto } from '@src/utils/dto/infinity-query-all.dto';

export class FilterOrderMaterialTemplatesDto extends InfinityFindAllDto {
  @ApiProperty({
    type: String,
    enum: MaterialTemplateTypeEnum,
  })
  @IsOptional()
  templateType: string;
}
