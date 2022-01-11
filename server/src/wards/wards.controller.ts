import { Controller, Get, Res } from '@nestjs/common';
import { WardsService } from './wards.service';
import { Response } from 'express';

@Controller('wards')
export class WardsController {
  constructor(private readonly wardsService: WardsService) {}

  @Get()
  async getRouteCount(@Res() res: Response) {
    const result = this.wardsService.getRouteCount();
    res.status(200).json({ result: result, message: '잘 전달되었습니다.' });
  }
}
