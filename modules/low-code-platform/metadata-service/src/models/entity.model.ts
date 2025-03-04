// modules/low-code-platform/metadata-service/src/models/entity.model.ts

import mongoose, { Schema, Document } from 'mongoose';

export interface IEntity extends Document {
    name: string;
    displayName: string;
    description?: string;
    tableName: string;
    isSystem: boolean;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const EntitySchema: Schema = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            validate: {
                validator: function(v: string) {
                    return /^[a-z][a-zA-Z0-9]*$/.test(v);
                },
                message: (props: any) => `${props.value} не є валідним ім'ям сутності. Ім'я повинно починатися з маленької літери та містити лише букви та цифри`
            }
        },
        displayName: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            trim: true
        },
        tableName: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        isSystem: {
            type: Boolean,
            default: false
        },
        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

// Індекси для оптимізації пошуку
EntitySchema.index({ name: 1 });
EntitySchema.index({ tableName: 1 });

// Віртуальне поле для отримання полів сутності
EntitySchema.virtual('fields', {
    ref: 'Field',
    localField: '_id',
    foreignField: 'entityId'
});

export default mongoose.model<IEntity>('Entity', EntitySchema);