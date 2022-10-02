import {
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { TrackerValidatorGuard } from '../../core/guards/tracker-validator.guard';
import { BackService } from '../services/back.service';
import { TrackService } from '../../track/services/track.service';
import { TrackDto } from "../../track/dto/track.dto";

@Controller()
export class BackController {
  constructor(
    private backService: BackService,
    private trackService: TrackService,
  ) {}

  @Get()
  getTrackerJs(@Res() res) {
    res.sendFile('tracker.js', {
      root: 'assets/js',
    });
  }

  @Post('track')
  @UseGuards(TrackerValidatorGuard)
  @HttpCode(200)
  async postTrack(@Req() req) {
    const { buffer } = req;
    await this.backService.simulateLongCall();

    this.trackService.create(buffer as TrackDto[]).then(() => {});
  }
}
