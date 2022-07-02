import { connect, connection } from 'mongoose'

const mongoDB = process.env.MONGODB_URI ?? 'mongodb://127.0.0.1/my_database'

connect(mongoDB)

connection.on('error', console.error.bind(console, 'MongoDB Connection error:'))