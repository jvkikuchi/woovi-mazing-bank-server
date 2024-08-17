import mongoose from "mongoose"

export async function connectToDatabase() {
  const connectionString = process.env.MONGO_URL;

  if (!connectionString) {
    throw new Error("No connection string defined")
  }

  mongoose.connection.on("error", (error) =>
    console.log("Database connection error.", error)
  )

  await mongoose.connect(connectionString)

  console.log("database connected")
}