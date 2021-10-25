import * as mongoose from "mongoose";

export const CategoriaSchema = new mongoose.Schema({
    categoria: {type: String, unique: true},
    descricao: String,
    eventos: [
        {
            nome: String,
            operacao: String,
            valor: Number
        }
    ]
}, {timestamps: true, collection: 'categorias'});