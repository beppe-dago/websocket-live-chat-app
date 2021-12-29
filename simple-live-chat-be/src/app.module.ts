import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { EventsModule } from './events/events.module';

@Module({
  imports: [
    EventsModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'simple-live-chat-fe'),
    }),],
  controllers: [],
  providers: [],
})
export class AppModule {}
