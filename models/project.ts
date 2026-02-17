import mongoose, { Schema } from "mongoose";

export interface IProject {
    name: string,
    owner: mongoose.Types.ObjectId,
    description: string,
    createdAt: Date,
    updatedAt:Date

}

const projectSchema = new Schema<IProject>({
    name: {
        type: String, required: true,trim:true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true

    },
    description: {
        type: String,
        required: true,
        trim:true

    },
   

},{ timestamps: true }
)
projectSchema.index({owner:1}) //add index tht make query faster
const projectModel = mongoose.model('project', projectSchema)
export default projectModel