import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriaSchema } from './interfaces/categorias/categoria.schema';
import { JogadorSchema } from './interfaces/jogadores/jogador.schema';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

var connectionParams : object = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(
      'mongodb+srv://' +
      `${process.env.DB_USER}:` +
      `${process.env.DB_PASS}@` +
      `${process.env.DB_HOST}/` +
      `${process.env.DB_NAME}?retryWrites=true&w=majority`
      , connectionParams),
    MongooseModule.forFeature([
      { name: 'Categoria', schema: CategoriaSchema },
      { name: 'Jogador', schema: JogadorSchema }
    ])
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
