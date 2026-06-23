import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IMenuItem extends Document {
    name: {
        en: string;
        ar: string;
    };
    description: {
        en: string;
        ar: string;
    };
    price: number;
    category: Types.ObjectId;
    imageUrl: string;
    isAvailable: boolean;
    createdAt: Date;
}

const menuItemSchema = new Schema<IMenuItem>({
    name: {
        en: { type: String, required: true },
        ar: { type: String, required: true }
    },
    description: {
        en: { type: String, required: true },
        ar: { type: String, required: true }
    },
    price: { type: Number, required: true, min: 0 },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    imageUrl: { type: String, required: true },
    isAvailable: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

export const MenuItem = mongoose.model<IMenuItem>('MenuItem', menuItemSchema);
