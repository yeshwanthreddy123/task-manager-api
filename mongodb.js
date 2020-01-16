const mongodb=require('mongodb')

const MongoClient=mongodb.MongoClient

const connectionURL='mongodb://127.0.0.1:27017'
const databaseName='task-manager'

MongoClient.connect(connectionURL,{useNewUrlParser:true},(error,client)=>{
    if(error)
    {
        return console.log('Error occured while trying to connect to database')
    }

   const db=client.db(databaseName)


db.collection('tasks').deleteMany({
  description:'complete task 3'
}
).then((result)=>{
    console.log("success!!!")
}).catch((error)=>{
    console.log('failed!!!')
})

//    db.collection('tasks').insertOne({
//        description:'complete task 3',
//        completed:false
//    })

})