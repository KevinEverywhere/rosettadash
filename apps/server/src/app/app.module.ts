import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthController } from './health.controller';
import { PreviewModule } from './preview/preview.module';
import { ProjectsModule } from './projects/projects.module';

@Module({
  imports: [ProjectsModule, PreviewModule],
  controllers: [AppController, HealthController],
  providers: [AppService],
})
export class AppModule {}
