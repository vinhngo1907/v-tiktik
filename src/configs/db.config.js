import mongoose from "mongoose";
import get from "./env.config.js";
Promise = global.Promise;

const uri = get("mongo_uri");

const mongoConfig = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    ignoreUndefined: true,
};

mongoose.set("strictQuery", false);

export const connectDB = async () => {
    try {
        await mongoose.connect(uri, mongoConfig);
        return console.log(`Connected DB !`);
    } catch (error) {
        throw new Error(error);
    }
}

export const disconnectDB = async () => {
    try {
        await mongoose.connection.close();
        return console.log(`Disconnected DB !`);
    } catch (error) {
        throw new Error(error);
    }
}

export const clearDB = async () => {
    try {
        const collections = mongoose.connection.collections;
        for (const key in collections) {
            const collection = collections[key];
            await collection.deleteMany();
        }
    } catch (error) {
        throw new Error(error.message);
    }
}