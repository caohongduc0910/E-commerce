import { ApiProperty } from '@nestjs/swagger';

/* eslint-disable @typescript-eslint/no-unused-expressions */
export class ResponseData {
  @ApiProperty()
  data: any;
  @ApiProperty()
  statusCode: number;
  @ApiProperty()
  message: string;

  constructor(data: any, statusCode: number, message: string) {
    (this.data = data),
      (this.statusCode = statusCode),
      (this.message = message);
  }
}
