import { MongoClient } from "mongodb";

/**
 * @file This file contains mongodb configuration
 * Provides methods 
 *  - connectToMongoDB()
 *  - getDB()
 */
const url = process.env.URL
console.log(url)
const dbName = process.env.DB
const client  = new MongoClient(url)

//function to connect the mongodb database
const connectToMongoDB = async ()=>{
    await client.connect();
    await client.db(dbName).command({ping:1})
    console.log("Successfully connected to mongodb.")
await client.db(dbName).collection('OTP').createIndex(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 }
);
}


//return the database
const getDB = ()=>{
    return client.db(process.env.DB);
}

export {connectToMongoDB , getDB};