const express=require('express')
const Tasks=require('../models/Task')
const auth=require('../middleware/auth')
const router=new express.Router()

router.post('/tasks',auth,async(req,res)=>{
    // const tasks=new Tasks(req.body)
    const tasks=new Tasks({
        ...req.body,
        owner:req.user._id
    })
    try{
        await tasks.save()
        res.status(201).send(tasks)
    }catch(e){
        res.status(400).send(e)
    }
})

router.get('/tasks',auth,async(req,res)=>{

   
    const findObj={}
    const options={}
    const sort={}
    if(req.query.completed)
    {
        
        findObj.completed=req.query.completed==='true'
    }
    if(req.query.sortBy)
    {
        const parts=req.query.sortBy.split(":")
        sort[parts[0]]=parts[1]==='desc'?-1:1
    }
     if(req.query.limit)
     {
         options.limit=parseInt(req.query.limit)
     }
     if(req.query.skip)
     {
         options.skip=parseInt(req.query.skip)
     }
   
   
    
    try{
        
      findObj.owner=req.user._id
      options.sort=sort
      const tasks=await Tasks.find(findObj,null,options)
      res.send(tasks)
    }catch(e){
      res.status(500).send()
    }
})



router.get('/tasks/:id',auth,async(req,res)=>{
    const _id=req.params.id
    try{
        // const task=await Tasks.findById(_id)
        const task=await Tasks.findOne({_id,owner:req.user._id})
        if(!task)
        {
            return res.status(404).send()
        }
        res.send(task)
    }catch(e){
        res.status(500).send()
    }
})


router.patch('/tasks/:id',auth,async(req,res)=>{

    const updates=Object.keys(req.body)
    const allowedUpdates=['description','completed']
    const isValidUpdate=updates.every((update)=>allowedUpdates.includes(update))
    if(!isValidUpdate)
    {
        return res.status(400).send({error:'invalid update!'})
    }

    try{
        const task=await Tasks.findOne({
            _id:req.params.id,
            owner:req.user._id
        })
        if(!task)
         {
             return res.status(404).send()
         }

         updates.forEach((update)=>task[update]=req.body[update])
         await task.save()
         
         
         res.send(task)
    }catch(e){
         res.status(500).send()
    }

})


router.delete('/tasks/:id',auth,async(req,res)=>{
    try{
        const task=await Tasks.findOneAndDelete({
            _id:req.params.id,
            owner:req.user._id
        })
        if(!task)
        {
            res.status(404).send()
        }
        res.send(task)
    }catch(e){
        res.status(500).send()
    }

})


module.exports=router
