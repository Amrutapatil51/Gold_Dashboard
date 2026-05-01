import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '..', 'data');

if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR);
}

const getFilePath = (collection) => path.join(DATA_DIR, `${collection}.json`);

const readData = (collection) => {
    const filePath = getFilePath(collection);
    if (!fs.existsSync(filePath)) return [];
    try {
        return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (e) {
        return [];
    }
};

const writeData = (collection, data) => {
    fs.writeFileSync(getFilePath(collection), JSON.stringify(data, null, 2));
};

export const offlineStore = {
    find: async (collection, query = {}) => {
        const data = readData(collection);
        return data.filter(item => {
            return Object.entries(query).every(([key, value]) => item[key] === value);
        });
    },
    findOne: async (collection, query = {}) => {
        const data = readData(collection);
        return data.find(item => {
            return Object.entries(query).every(([key, value]) => item[key] === value);
        });
    },
    findById: async (collection, id) => {
        const data = readData(collection);
        return data.find(item => item._id === id || item.id === id);
    },
    create: async (collection, item) => {
        const data = readData(collection);
        const newItem = { 
            _id: Date.now().toString(), 
            ...item,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        data.push(newItem);
        writeData(collection, data);
        return newItem;
    },
    deleteOne: async (collection, id) => {
        let data = readData(collection);
        data = data.filter(item => item._id !== id && item.id !== id);
        writeData(collection, data);
        return { deletedCount: 1 };
    }
};
