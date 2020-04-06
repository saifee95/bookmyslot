var mongoose = require('mongoose');
// var autoIncrement = require('mongoose-auto-increment');
require('./Slot');

var connection = mongoose.createConnection('mongodb://msaifee:saimoh95@ds145921.mlab.com:45921/bookmyslot');

// autoIncrement.initialize(connection);

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
    slot:{
        type:mongoose.Types.ObjectId,
        required:true,
        ref:'Slot'  
    },
    created_at:{
        type:Date
    }
});

// meetingSchema.plugin(autoIncrement.plugin, 'Meeting');

mongoose.model("Meeting", meetingSchema);