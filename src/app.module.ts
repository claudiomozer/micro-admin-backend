import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriaSchema } from './categorias/interfaces/categoria.schema';
import { JogadorSchema } from './interfaces/jogadores/jogador.schema';
import { ConfigModule } from '@nestjs/config';
import { CategoriasModule } from './categorias/categorias.module';

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
    ]),
    CategoriasModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
