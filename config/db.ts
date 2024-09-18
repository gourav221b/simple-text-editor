import Dexie, { type EntityTable } from 'dexie';

interface Editor {
    id: number;
    name: string;
    content: string;
}

const db = new Dexie('EditorDB') as Dexie & {
    editors: EntityTable<
        Editor,
        'id' // primary key "id" (for the typings only)
    >;
};

// Schema declaration:
db.version(1).stores({
    editors: '++id, name, content' // primary key "id" (for the runtime!)
});

export type { Editor };
export { db };