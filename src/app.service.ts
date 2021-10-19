import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Categoria } from './interfaces/categorias/categoria,interface';
import { Model } from 'mongoose';
import { Jogador } from './interfaces/jogadores/jogador.interface';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class AppService
{

  private readonly logger = new Logger(AppService.name);

  constructor(
    @InjectModel('Categoria') private readonly categoriaModel: Model<Categoria>,
    @InjectModel('Jogador') private readonly jogadorModel: Model<Jogador>,
  ){}

  async criarCategoria (categoria: Categoria): Promise<Categoria>
  {
     try {
        const categoriaCriada = new this.categoriaModel(categoria);
        return await categoriaCriada.save();
      } catch (error) {
        this.logger.error(`error: ${JSON.stringify(error.message)}`);
        throw new RpcException(error.message);
      }
  }

  async consultarTodasCategorias (): Promise<Categoria[]>
  {
      try {
        return await this.categoriaModel.find().populate("jogadores").exec();
      } catch (err) {
        this.logger.error(`Error: ${JSON.stringify(err.message)}`);
        throw new RpcException(err.message);
      }
  }

  async consultarCategoriaPeloId (categoria: string) : Promise<Categoria>
  {
    try {
      return await this.buscaPeloIdOuExcessao(categoria);
    } catch (err) {
      this.logger.error(`Error: ${JSON.stringify(err.message)}`);
      throw new RpcException(err.message);
    }
  }

  private async buscaPeloIdOuExcessao(categoria: string): Promise<Categoria>
  {
      const categoriaEncontrada = await this.categoriaModel.findOne({categoria}).exec();
      
      if(!categoriaEncontrada) {
          throw new NotFoundException(`Categoria ${categoria} não encontrada!`);
      }

      return categoriaEncontrada;
  }


}
