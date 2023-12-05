import { ApiProperty } from "@nestjs/swagger";

export class PaginationDto {
  @ApiProperty({ required: false })
  readonly page?: number;
  @ApiProperty({ required: false })
  readonly limit?: number;
  @ApiProperty({ required: false })
  readonly search?: string;
}
