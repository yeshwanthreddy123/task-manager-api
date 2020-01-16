const express=require('express')
require('./db/mongoose')
// const User=require('./models/User')
// const Tasks=require('./models/Task')
const userRoutes=require('./routers/user')
const taskRoutes=require('./routers/tasks')
const app=express();

const port=process.env.PORT



app.use(express.json())
app.use(userRoutes)
app.use(taskRoutes)




app.listen(port,()=>{
    console.log('express server started on port '+port)
})