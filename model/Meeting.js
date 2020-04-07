var mongoose = require('mongoose');
require('./Slot');

var connection = mongoose.createConnection('mongodb://msaifee:saimoh95@ds145921.mlab.com:45921/bookmyslot');

var meetingSchema = new mongoose.Schema({
    
    title:{
        type:String
    },
    sender : {
        type:String,
        required:true
    },
    recipient : {
        type:String,
        required:true
    },
    date : {
        type:String,
    },
    slot:{
        type:mongoose.Types.ObjectId,
        required:true,
        ref:'Slot'  
    },
    created_at:{
        type:Date
    }
});

mongoose.model("Meeting", meetingSchema);