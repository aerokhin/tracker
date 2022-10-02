import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TrackDocument = Track & Document;

@Schema()
export class Track {
  @Prop({ required: true })
  event: string;

  @Prop({ required: true, type: [String] })
  tags: string[];

  @Prop({ required: true })
  url: string;

  @Prop({ required: true })
  ts: Date;
}

export const TrackSchema = SchemaFactory.createForClass(Track);
