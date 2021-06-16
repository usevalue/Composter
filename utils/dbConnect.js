import mongoose from 'mongoose'

const dbURL = "mongodb://127.0.0.1:27017/regrowth"
const connection={}

export default async function dbConnect() {

    if(connection.isConnected) return;

    try {
        const db = await mongoose.connect(dbURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    }
    catch(e) {
        console.log("Error with mongoose connection:")
        console.log(e)
    }

}