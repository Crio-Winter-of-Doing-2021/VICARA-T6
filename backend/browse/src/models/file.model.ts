import mongoose from "mongoose";

interface FileAttrs {
    fileName: string;
    mimetype: string;
    isDirectory: boolean;
    parentId: string;
    ownerId: string;
}

interface DirAttrs {
    fileName: string;
    isDirectory: boolean;
    parentId: string;
    ownerId: string;
}

export interface FileDoc extends mongoose.Document {
    fileName: string;
    mimetype: string;
    isDirectory: boolean;
    parentId: string;
    ownerId: string;
    fileSize: number;
    starred: boolean;
    updatedAt: Date;
}

interface FileModel extends mongoose.Model<FileDoc> {
    buildFile(attrs: FileAttrs): FileDoc;
    buildDir(attrs: DirAttrs): FileDoc;
}

const fileSchema = new mongoose.Schema({
    fileName: {
        type: String,
        required: true,
        trim: true
    },
    mimetype: {
        type: String
    },
    isDirectory: {
        type: Boolean,
        required: true
    },
    parentId: {
        type: mongoose.Types.ObjectId,
        required: true,
    },
    ownerId: {
        type: String,
        required: true
    },
    fileSize: {
        type: Number
    },
    starred: {
        type: Boolean,
        default: false
    },
    share: {
        url: String,
        expiryTime: Number,
        generatedAt: Date,
    },
}, {
    timestamps: true,
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
});

fileSchema.index({parentId: 1, fileName: 1}, {unique: true});

fileSchema.statics.buildFile = (attrs: FileAttrs) => {
    return new File(attrs);
};

fileSchema.statics.buildDir = (attrs: DirAttrs) => {
    return new File(attrs);
};

const File = mongoose.model<FileDoc, FileModel>('File', fileSchema);

export { File };
