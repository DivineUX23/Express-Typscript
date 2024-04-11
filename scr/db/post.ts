import mongoose, { Schema } from "mongoose";

const PostSchema = new mongoose.Schema({
    //User refrence
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },

    //Post content (Text, imageurl, videourl, date)
    post: { type: String, required: true },
    imageUrl: { type: String, required: false },
    videoUrl: { type: String, required: false },
    createdAt: { type: Date, default: Date.now },

    //Users who liked the post
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],

    //Comments
    comments: [{
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        comments: { type: String, required: true },
        createdAt: { type: Date, default: Date.now }
    }]
})


export const PostModel = mongoose.model('Post', PostSchema);

export const getPosts = () => PostModel.find();
export const getPostById = (id: string) => PostModel.findById(id);
export const createPost = (values: Record<string, any>) => new PostModel(values)
    .save().then((post) => post.toObject());
export const deletePostById = (id: string) => PostModel.findOneAndDelete({ _id: id })
export const updatePostById = (id: string, values: Record<string, any>) => PostModel.findByIdAndUpdate(id, values);

export const getPostsByUser = (id: string) => PostModel.find({ user: id });

