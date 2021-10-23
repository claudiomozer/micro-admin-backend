import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Categoria } from 'src/categorias/interfaces/categoria,interface';
import { Jogador } from 'src/interfaces/jogadores/jogador.interface';

@Injectable()
export class CategoriasService {

    private readonly logger = new Logger(CategoriasService.name);

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
  
    async atualizarCategoria (id: string, categoria: Categoria): Promise<void>
    {
       try {
          await this.categoriaModel.findOneAndUpdate({ categoria: id }, { $set: categoria }).exec();
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
