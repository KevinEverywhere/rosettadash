import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { HealthController } from './health.controller';
import { ExportModule } from './export/export.module';
import { PreviewModule } from './preview/preview.module';
import { ProjectsModule } from './projects/projects.module';

@Module({
  imports: [AuthModule, ProjectsModule, PreviewModule, ExportModule],
  controllers: [AppController, HealthController],
  providers: [AppService],
})
export class AppModule {}
