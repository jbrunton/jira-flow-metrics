import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { DomainsModule } from './domains/domains.module';
import { DataSetsModule } from './data-sets/data-sets.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'client', 'dist'),
      exclude: ['/api/(.*)'],
    }),
    DomainsModule,
    DataSetsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
