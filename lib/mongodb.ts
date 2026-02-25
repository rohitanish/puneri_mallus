import { MongoClient } from 'mongodb';
import mongoose from 'mongoose';

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const options = {};

// --- GLOBAL CACHE INTERFACE ---
let globalWithMongo = global as typeof globalThis & {
  _mongoClientPromise?: Promise<MongoClient>;
  mongoose?: { conn: any; promise: any };
};

// --- 1. RAW MONGODB CLIENT (Keep for existing logic) ---
let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// --- 2. MONGOOSE CONNECTION (Add for Support/Models) ---
if (!globalWithMongo.mongoose) {
  globalWithMongo.mongoose = { conn: null, promise: null };
}

export async function dbConnect() {
  if (globalWithMongo.mongoose!.conn) {
    return globalWithMongo.mongoose!.conn;
  }

  if (!globalWithMongo.mongoose!.promise) {
    globalWithMongo.mongoose!.promise = mongoose.connect(uri, {
      bufferCommands: false,
    }).then((m) => m);
  }

  try {
    globalWithMongo.mongoose!.conn = await globalWithMongo.mongoose!.promise;
  } catch (e) {
    globalWithMongo.mongoose!.promise = null;
    throw e;
  }

  return globalWithMongo.mongoose!.conn;
}

// Default export remains the same so nothing breaks
export default clientPromise;