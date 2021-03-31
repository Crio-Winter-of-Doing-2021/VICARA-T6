import mongoose from "mongoose";

import {PasswordManager} from "../services/password";

// Interface for a new user object
interface UserAttr {
    email: string;
    password: string;
}

// Interface to define build method on user model
interface UserModel extends mongoose.Model<UserDoc> {
    build(attrs: UserAttr): UserDoc;
}

// Interface for user document returned from mongo
interface UserDoc extends mongoose.Document {
    email: string;
    password: string;
}

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.password;
            delete ret.__v;
        }
    }
});

userSchema.pre('save', async function (done) {
    if (this.isModified('password')) {
        const hashedPass = await PasswordManager.toHash(this.get('password'));
        this.set('password', hashedPass);
    }
    done();
});

userSchema.statics.build = (userAttr: UserAttr) => {
    return new User(userAttr);
};

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export {User};
