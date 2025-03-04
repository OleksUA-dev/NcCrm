// modules/low-code-platform/metadata-service/src/models/view.model.ts

import mongoose, { Schema, Document, Types } from 'mongoose';

// Enum для типів представлень
export enum ViewType {
    LIST = 'list',
    DETAIL = 'detail',
    FORM = 'form',
    DASHBOARD = 'dashboard',
    CALENDAR = 'calendar',
    KANBAN = 'kanban'
}

// Інтерфейс для конфігурації колонки у LIST представленні
export interface IColumnConfig {
    fieldId: Types.ObjectId;
    width?: number;
    order: number;
    isVisible: boolean;
    isSortable: boolean;
    isFilterable: boolean;
}

// Інтерфейс для конфігурації секції у DETAIL/FORM представленні
export interface ISectionConfig {
    title: string;
    order: number;
    isCollapsible: boolean;
    isCollapsed: boolean;
    columns: number; // 1, 2, 3, 4, etc.
    fields: {
        fieldId: Types.ObjectId;
        order: number;
        colSpan?: number;
    }[];
}

// Інтерфейс для конфігурації фільтра
export interface IFilterConfig {
    fieldId: Types.ObjectId;
    operator: string;
    value?: any;
    isDefault: boolean;
}

// Інтерфейс для конфігурації сортування
export interface ISortConfig {
    fieldId: Types.ObjectId;
    direction: 'asc' | 'desc';
    order: number;
}

// Інтерфейс для представлення
export interface IView extends Document {
    entityId: Types.ObjectId;
    name: string;
    displayName: string;
    description?: string;
    type: ViewType;
    isDefault: boolean;
    isSystem: boolean;
    isActive: boolean;
    config: {
        columns?: IColumnConfig[];
        sections?: ISectionConfig[];
        filters?: IFilterConfig[];
        sorts?: ISortConfig[];
        pageSize?: number;
        customSettings?: any;
    };
    createdAt: Date;
    updatedAt: Date;
}

// Схема для конфігурації колонки
const ColumnConfigSchema = new Schema({
    fieldId: {
        type: Schema.Types.ObjectId,
        ref: 'Field',
        required: true
    },
    width: {
        type: Number
    },
    order: {
        type: Number,
        required: true
    },
    isVisible: {
        type: Boolean,
        default: true
    },
    isSortable: {
        type: Boolean,
        default: true
    },
    isFilterable: {
        type: Boolean,
        default: true
    }
}, { _id: false });

// Схема для полів у секції
const SectionFieldSchema = new Schema({
    fieldId: {
        type: Schema.Types.ObjectId,
        ref: 'Field',
        required: true
    },
    order: {
        type: Number,
        required: true
    },
    colSpan: {
        type: Number,
        default: 1
    }
}, { _id: false });

// Схема для конфігурації секції
const SectionConfigSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    order: {
        type: Number,
        required: true
    },
    isCollapsible: {
        type: Boolean,
        default: true
    },
    isCollapsed: {
        type: Boolean,
        default: false
    },
    columns: {
        type: Number,
        default: 2,
        min: 1,
        max: 4
    },
    fields: {
        type: [SectionFieldSchema],
        default: []
    }
}, { _id: false });

// Схема для конфігурації фільтра
const FilterConfigSchema = new Schema({
    fieldId: {
        type: Schema.Types.ObjectId,
        ref: 'Field',
        required: true
    },
    operator: {
        type: String,
        required: true
    },
    value: {
        type: Schema.Types.Mixed
    },
    isDefault: {
        type: Boolean,
        default: false
    }
}, { _id: false });

// Схема для конфігурації сортування
const SortConfigSchema = new Schema({
    fieldId: {
        type: Schema.Types.ObjectId,
        ref: 'Field',
        required: true
    },
    direction: {
        type: String,
        enum: ['asc', 'desc'],
        default: 'asc'
    },
    order: {
        type: Number,
        required: true
    }
}, { _id: false });

// Схема для представлення
const ViewSchema: Schema = new Schema(
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
                message: (props: any) => `${props.value} не є валідним ім'ям представлення. Ім'я повинно починатися з маленької літери та містити лише букви та цифри`
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
            enum: Object.values(ViewType),
            required: true
        },
        isDefault: {
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
        config: {
            columns: {
                type: [ColumnConfigSchema],
                default: undefined
            },
            sections: {
                type: [SectionConfigSchema],
                default: undefined
            },
            filters: {
                type: [FilterConfigSchema],
                default: undefined
            },
            sorts: {
                type: [SortConfigSchema],
                default: undefined
            },
            pageSize: {
                type: Number,
                default: 20
            },
            customSettings: {
                type: Schema.Types.Mixed
            }
        }
    },
    {
        timestamps: true
    }
);

// Складений індекс для унікальності імені представлення в рамках сутності
ViewSchema.index({ entityId: 1, name: 1 }, { unique: true });

// Складений індекс для знаходження представлення за замовчуванням
ViewSchema.index({ entityId: 1, type: 1, isDefault: 1 });

export default mongoose.model<IView>('View', ViewSchema);