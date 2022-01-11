import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { RoutesModule } from './routes/routes.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WardsController } from './wards/wards.controller';
import { WardsService } from './wards/wards.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(),
    UsersModule,
    RoutesModule,
  ],
  controllers: [AppController, WardsController],
  providers: [AppService, WardsService],
})
export class AppModule {}
