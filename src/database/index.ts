import mongoose from "mongoose"

export async function connectToDatabase() {
  const connectionString = "mongodb+srv://kikuchi:tiZ5e4og9gnUrlO8@woovi-mongo.ogm7l.mongodb.net/?retryWrites=true&w=majority&appName=woovi-mongo";

  if (!connectionString) {
    throw new Error("No connection string defined")
  }

  mongoose.connection.on("error", (error) =>
    console.log("Database connection error.", error)
  )

  await mongoose.connect(connectionString)

  console.log("database connected")
}