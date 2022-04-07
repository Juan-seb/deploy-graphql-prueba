import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

mongoose.connect(process.env.CONNECTION_MONGO,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(()=>{
        console.log("DB is connected")
    }).catch((error)=>{
        console.log(error)
    })

/* const mongoConnector = async () => {
    try {
        console.log('DB is connected')
    } catch (error) {
        console.log(error)
    }
}

export default mongoConnector; */