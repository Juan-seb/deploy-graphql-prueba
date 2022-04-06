import mongoose from 'mongoose'

const password = '7582333Felipe'
const database = 'chanDB'
const connectionString = `mongodb+srv://Juan-seb:${password}@cluster0.bcfah.mongodb.net/${database}?retryWrites=true&w=majority`

mongoose.connect(connectionString,{
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