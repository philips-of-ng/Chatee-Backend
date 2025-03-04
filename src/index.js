import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'
import { v2 as cloudinary} from 'cloudinary'
import { fileURLToPath } from 'url'
import path from 'path'

import userRoutes from './routes/UserRoutes.js'
import fileRoutes from './routes/fileUploadRoutes.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') })

const app = express()

const corsOption = {
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT']
}

app.use(cors(corsOption))


//ENVIRONMENTAL VARIABLES
const mongoURL = process.env.MONGO_URI
const PORT = process.env.PORT 
const HOST = process.env.HOST 

console.log(`Enviromental Variables`, { mongoURL, PORT, HOST });

if (!mongoURL) {
  console.log('Mongo URI not available, check your .env file brr');  
}

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//PATHS SHOULD BE HERE
app.use('/api/users', userRoutes)
app.use('/api/files', fileRoutes)


//Connect to DB and start server
mongoose.connect(mongoURL).then(() => console.log('MongoDB Connected')).catch((error) => console.log('Error nonnecting to database', error))

app.listen(PORT, HOST, () => {
  console.log(`Server is running on ${HOST}:${PORT}`)
})

