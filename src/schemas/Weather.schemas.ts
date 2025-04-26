import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class Weather {

    @Prop({ required: false })
    description: string;

    @Prop({ required: false })
    temperature?: string;

    @Prop({ required: false })
    humidity?: string;

    @Prop({ required: false })
    windSpeed?: string;

    @Prop({ required: false })
    place?: string;

    @Prop({ required: false })
    visibility?: string;

    @Prop({ default: Date.now })
    createdAt: Date;

}

export const WeatherSchema = SchemaFactory.createForClass(Weather);