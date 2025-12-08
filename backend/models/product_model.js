import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
    default: '',
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },

  slug: {
    type: String,
    required: false,
    unique: true,
  },

  category: {
    type: String,
    required: true,
    enum: [
      "Wing Chair",
      "Wooden Chair",
      "Desk Chair",
      "Park Bench",
      "Office Chair",
      "Dining Chair",
      "Recliner",
    ],


  },

 images:[
    {
        url:{type:String, required:true},
        altText:{type:String, required:true},
        public_id:{type:String, required:true}
    }
 ],

  reviews: [

    {
        user:{
            type: mongoose.Schema.Types.ObjectId,
            ref:'ComfortyUser'
        },
        rating: { type: Number, required: true, min: 1, max: 5 },
            comment: { type: String, required: true },
            createdAt: { type: Date, default: Date.now }
    }
  ],
      averageRating: { type: Number, default: 0 },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
},
isAvailable: {
    type: Boolean,
    default: true
}


    

},
{ timestamps: true });


export const Product = mongoose.model("ComfortyProduct", productSchema);