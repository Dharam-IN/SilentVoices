import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number
}

const connection: ConnectionObject = {}

async function dbConnect(): Promise<void>{
    if(connection.isConnected){
        console.log("Allready Connected to database");
        return
    }

    try {
        console.log(process.env.MONGO_URI)
        const db = await mongoose.connect(process.env.MONGO_URI || "")

        connection.isConnected = db.connections[0].readyState

        console.log("DB Connected Successfully");

    } catch (error) {
        console.log("Database Connection failed", error)
        process.exit()
    }
}

export default dbConnect;