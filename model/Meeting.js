var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

var connection = mongoose.createConnection('mongodb://msaifee:saimoh95@ds055397.mlab.com:55397/bookmyslot');

autoIncrement.initialize(connection);

var meetingSchema = new mongoose.Schema({
    sender : {
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    recipient : {
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    slot:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Slot'  
    },
    created_at:{
        type:Date
    }
});

meetingSchema.plugin(autoIncrement.plugin, 'Meeting');

mongoose.model("Meeting", meetingSchema);