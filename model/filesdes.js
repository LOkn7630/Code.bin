const mongoose = require('mongoose');
const mongoURI = 'mongodb+srv://Test:Test@cluster0.xck0h.mongodb.net/ABC?retryWrites=true&w=majority';
const conn = mongoose.createConnection(mongoURI);

const fileSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    tags: { type: String, required: true },
    url: { type: String, required: true }
});

const filesdes = conn.model('filesdes', fileSchema);
module.exports = filesdes;