const mongoose=require('mongoose');
module.exports=function(req,res,next){
    if(req.params.id && !mongoose.Types.ObjectId.isValid(req.params.id))
        return res.status(400).send('Invalid ID.');
    if(req.params.sid && !mongoose.Types.ObjectId.isValid(req.params.sid))
        return res.status(400).send('Invalid SessionID');
    next();
} 