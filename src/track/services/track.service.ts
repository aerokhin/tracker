import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Track, TrackDocument } from '../schemas/track.schema';
import { Model } from 'mongoose';
import { TrackDto } from '../dto/track.dto';

@Injectable()
export class TrackService {
  constructor(
    @InjectModel(Track.name) private trackModel: Model<TrackDocument>,
  ) {}

  async create(tracksDto: TrackDto[]): Promise<Track[]> {
    const tracks = tracksDto.map(trackDto => {
      const createdTrack = new this.trackModel(trackDto);
      return createdTrack.save();
    });

    return Promise.all(tracks);
  }
}
