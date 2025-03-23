import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { Document } from 'mongoose';


// export class Product {

//     const Product = new mongoose.Schema(
//         {
//             name: { 
//                 type: String, required: true 
//             },

//             description: { 
                
//                 type: String, required: true 
//             },

//             price: { 
//                 type: Number, required: true 
//             },

//             category: { 
//                 type: String, required: true 
//             },

//             createdAt: { 
//                 type: Date, default: Date.now 
//             },


//         }
//     ) 
// }

@Schema() 
export class Product extends Document {
  @Prop({ required: true }) 
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  category: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const Productschema = SchemaFactory.createForClass(Product);