import { Module } from '@nestjs/common';
import { JogadoresService } from './jogadores.service';
import { JogadoresController } from './jogadores.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriaSchema } from 'src/categorias/interfaces/categoria.schema';
import { JogadorSchema } from './interfaces/jogador.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Categoria', schema: CategoriaSchema },
      { name: 'Jogador', schema: JogadorSchema }
    ])
  ],
  providers: [JogadoresService],
  controllers: [JogadoresController]
})
export class JogadoresModule {}
