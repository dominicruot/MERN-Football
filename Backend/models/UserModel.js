import mongoose from 'mongoose';

//------------ User Schema ------------//
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    verified: {
        type: Boolean,
        default: false
    },
    resetLink: {
        type: String,
        default: ''
    },
    refresh_token: {
        type: String,
    },
    paid: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const Users = mongoose.model('Users', UserSchema);

export default Users;