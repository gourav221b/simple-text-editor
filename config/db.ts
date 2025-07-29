import Dexie, { type EntityTable } from 'dexie';

interface Editor {
    id: number;
    name: string;
    content: string;
    color?: string;
    isPinned?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    order?: number;
}

interface Template {
    id: number;
    name: string;
    content: string;
    fileExtension: string;
    description?: string;
    isBuiltIn?: boolean;
    createdAt?: Date;
}

const db = new Dexie('EditorDB') as Dexie & {
    editors: EntityTable<
        Editor,
        'id' // primary key "id" (for the typings only)
    >;
    templates: EntityTable<
        Template,
        'id'
    >;
};

// Schema declaration:
db.version(1).stores({
    editors: '++id, name, content' // primary key "id" (for the runtime!)
});

// Version 2: Add new fields and tables
db.version(2).stores({
    editors: '++id, name, content, color, isPinned, createdAt, updatedAt, order',
    templates: '++id, name, content, fileExtension, description, isBuiltIn, createdAt'
}).upgrade(tx => {
    // Migrate existing editors to have default values
    return tx.table('editors').toCollection().modify(editor => {
        editor.createdAt = new Date();
        editor.updatedAt = new Date();
        editor.order = editor.id;
        editor.isPinned = false;
    });
});

// Version 3: Remove tab groups
db.version(3).stores({
    editors: '++id, name, content, color, isPinned, createdAt, updatedAt, order',
    templates: '++id, name, content, fileExtension, description, isBuiltIn, createdAt'
}).upgrade(tx => {
    // Remove groupId from existing editors
    return tx.table('editors').toCollection().modify(editor => {
        delete editor.groupId;
    });
});

export type { Editor, Template };
export { db };