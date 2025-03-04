// modules/low-code-platform/metadata-service/src/models/field.model.ts

import mongoose, { Schema, Document, Types } from 'mongoose';

// Enum для типів полів
export enum FieldType {
    TEXT = 'text',
    NUMBER = 'number',
    DATE = 'date',
    DATETIME = 'datetime',
    BOOLEAN = 'boolean',
    SELECT = 'select',
    MULTISELECT = 'multiselect',
    LOOKUP = 'lookup',
    PHONE = 'phone',
    EMAIL = 'email',
    URL = 'url',
    FILE = 'file',
    IMAGE = 'image',
    TEXTAREA = 'textarea',
    MONEY = 'money',
    PERCENT = 'percent',
    JSON = 'json'
}

// Інтерфейс для опцій вибору (для типів SELECT та MULTISELECT)
export interface ISelectOption {
    value: string;
    label: string;
    color?: string;
}

// Інтерфейс для валідаційних правил
export interface IValidationRule {
    type: 'required' | 'min' | 'max' | 'pattern' | 'unique' | 'custom';
    value?: any;
    message: string;
    enabled: boolean;
}

// Інтерфейс для поля
export interface IField extends Document {
    entityId: Types.ObjectId;
    name: string;
    displayName: string;
    description?: string;
    type: FieldType;
    isRequired: boolean;
    isReadOnly: boolean;
    isSystem: boolean;
    isActive: boolean;
    defaultValue?: any;
    order: number;
    options?: ISelectOption[];
    validationRules?: IValidationRule[];
    lookupEntity?: Types.ObjectId;
    lookupField?: string;
    createdAt: Date;
    updatedAt: Date;
}

// Схема для опцій вибору
const SelectOptionSchema = new Schema({
    value: {
        type: String,
        required: true
    },
    label: {
        type: String,
        required: true
    },
    color: {
        type: String
    }
}, { _id: false });

// Схема для валідаційних правил
const ValidationRuleSchema = new Schema({
    type: {
        type: String,
        enum: ['required', 'min', 'max', 'pattern', 'unique', 'custom'],
        required: true
    },
    value: {
        type: Schema.Types.Mixed
    },
    message: {
        type: String,
        required: true
    },
    enabled: {
        type: Boolean,
        default: true
    }
}, { _id: false });

// Схема для поля
const FieldSchema: Schema = new Schema(
    {
        entityId: {
            type: Schema.Types.ObjectId,
            ref: 'Entity',
            required: true
        },
        name: {
            type: String,
            required: true,
            trim: true,
            validate: {
                validator: function(v: string) {
                    return /^[a-z][a-zA-Z0-9]*$/.test(v);
                },
                message: (props: any) => `${props.value} не є валідним ім'ям поля. Ім'я повинно починатися з маленької літери та містити лише букви та цифри`
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
        type: {
            type: String,
            enum: Object.values(FieldType),
            required: true
        },
        isRequired: {
            type: Boolean,
            default: false
        },
        isReadOnly: {
            type: Boolean,
            default: false
        },
        isSystem: {
            type: Boolean,
            default: false
        },
        isActive: {
            type: Boolean,
            default: true
        },
        defaultValue: {
            type: Schema.Types.Mixed
        },
        order: {
            type: Number,
            default: 0
        },
        options: {
            type: [SelectOptionSchema],
            default: undefined
        },
        validationRules: {
            type: [ValidationRuleSchema],
            default: undefined
        },
        lookupEntity: {
            type: Schema.Types.ObjectId,
            ref: 'Entity'
        },
        lookupField: {
            type: String
        }
    },
    {
        timestamps: true
    }
);

// Складений індекс для унікальності імені поля в рамках сутності
FieldSchema.index({ entityId: 1, name: 1 }, { unique: true });

// Індекс для сортування за порядком
FieldSchema.index({ entityId: 1, order: 1 });

export default mongoose.model<IField>('Field', FieldSchema);