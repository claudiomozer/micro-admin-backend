import { Module } from '@nestjs/common';
import { CategoriasService } from './categorias.service';
import { CategoriasController } from './categorias.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriaSchema } from './interfaces/categoria.schema';
import { JogadorSchema } from 'src/jogadores/interfaces/jogador.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Categoria', schema: CategoriaSchema },
      { name: 'Jogador', schema: JogadorSchema }
    ])
  ],
  providers: [CategoriasService],
  controllers: [CategoriasController]
})
export class CategoriasModule {}
