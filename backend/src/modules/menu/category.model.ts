import mongoose, { Document, Schema } from 'mongoose';

export interface ICategory extends Document {
    name: {
        en: string;
        ar: string;
    };
    description: {
        en: string;
        ar: string;
    };
    createdAt: Date;
}

const categorySchema = new Schema<ICategory>({
    name: {
        en: { type: String, required: true },
        ar: { type: String, required: true }
    },
    description: {
        en: { type: String, required: true },
        ar: { type: String, required: true }
    },
    createdAt: { type: Date, default: Date.now }
});

export const Category = mongoose.model<ICategory>('Category', categorySchema);
