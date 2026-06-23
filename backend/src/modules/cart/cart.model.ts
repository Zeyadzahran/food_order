import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ICartItem {
    menuItem: Types.ObjectId;
    quantity: number;
    price: number;
    name: {
        en: string;
        ar: string;
    };
}

export interface ICart extends Document {
    user: Types.ObjectId;
    items: ICartItem[];
    totalPrice: number;
    createdAt: Date;
    updatedAt: Date;
}

const cartItemSchema = new Schema<ICartItem>({
    menuItem: { type: Schema.Types.ObjectId, ref: 'MenuItem', required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true },
    name: {
        en: { type: String, required: true },
        ar: { type: String, required: true }
    }
});

const cartSchema = new Schema<ICart>({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    items: [cartItemSchema],
    totalPrice: { type: Number, default: 0 }
}, { timestamps: true });

cartSchema.pre<ICart>('save', function (next) {
    this.totalPrice = this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    next();
});

export const Cart = mongoose.model<ICart>('Cart', cartSchema);
