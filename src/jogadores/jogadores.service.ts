import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Jogador } from './interfaces/jogador.interface';

@Injectable()
export class JogadoresService {

    private readonly logger = new Logger(JogadoresService.name);
    constructor(@InjectModel('Jogador') private readonly jogadorModel: Model<Jogador>) {}

    async criarJogador (jogador: Jogador): Promise<Jogador>{
        const { email } = jogador;
        const jogadorEncontrado = await this.jogadorModel.findOne({email}).exec();

        if (jogadorEncontrado) {
            throw new RpcException(`Jogador com o e-mail ${email}, já cadastrado`);
        }

        try {
            const jogadorCriado = new this.jogadorModel(jogador);
            return await jogadorCriado.save();
        } catch (error) {
            this.logger.error(`error: ${JSON.stringify(error.message)}`);
            throw new RpcException(error.message);
        }
    }

    async atualizarJogador (id: string, jogador: Jogador): Promise<Jogador>{
        try {
            return await this.jogadorModel.findOneAndUpdate(
                {_id: id}, 
                {$set: jogador}
            ).exec();
        } catch (error) {
            this.logger.error(`error: ${JSON.stringify(error.message)}`);
            throw new RpcException(error.message);
        }
    }

    async consultarTodosJogadores() : Promise<Jogador[]> 
    {
        try {
            return await this.jogadorModel.find().exec();
        } catch (error) {
            this.logger.error(`error: ${JSON.stringify(error.message)}`);
            throw new RpcException(error.message);
        }
    }

    async consultarJogadorPeloId(id: string) :  Promise<Jogador>
    {
        try {
            return await this.buscaPeloIdOuExcessao(id);
        } catch (error) {
            this.logger.error(`error: ${JSON.stringify(error.message)}`);
            throw new RpcException(error.message);
        }
    }

    async deletarJogador(id: string): Promise<any>
    {
        try {
            return await this.jogadorModel.deleteOne({_id: id}).exec();
        } catch (error) {
            this.logger.error(`error: ${JSON.stringify(error.message)}`);
            throw new RpcException(error.message);
        }
    }

    private async buscaPeloIdOuExcessao(id: string): Promise<Jogador>
    {
        const jogadorEncontrado = await this.jogadorModel.findOne({_id: id}).exec();
        
        if(!jogadorEncontrado) {
            throw new NotFoundException(`Jogador ${id} não encontrado!`);
        }
  
        return jogadorEncontrado;
    }
}
