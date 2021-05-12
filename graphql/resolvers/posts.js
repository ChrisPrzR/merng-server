const { AuthenticationError, UserInputError } = require('apollo-server');

const Post = require('../../models/Post');
const User = require('../../models/User')
const checkAuth = require('../../utils/check-auth');

module.exports = {
        Query: {
        async getPosts(){
            try{
                const posts = await Post.find().sort({ createdAt: -1 });
                return posts
            }catch(err){
                throw new Error(err)
            }
        },
        async getPost(_, { postId }){
            try{
                const post = await Post.findById(postId);
                if(post){
                    return post;
                } else {
                    throw new Error('Post not found')
                }
            } catch(err){
                throw new Error(err)
            }
        }
    },
    Mutation: {
        async createPost(_, { body }, context){
            const user = checkAuth(context);

            if(body.trim() === ''){
                throw new Error('Body must not be empty')
            }

            const author = await User.findById(user.id)

            const newPost = new Post({
                body,
                user: user.id,
                username: user.username,
                createdAt: new Date().toISOString(),
                image: author.image
            });
            const post = await newPost.save();

            return post;
        },
        async deletePost(_, { postId }, context){
            const user = checkAuth(context);

            try{
                const post = await Post.findById(postId);

                if(user.username === post.username){
                    await post.delete();
                    return 'Deletion successful'
                }else{
                    throw new AuthenticationError('Permission denied');
                }
            }catch(err){
                throw new Error(err)
            }
        },
        async likePost(_, { postId }, context){
            const { username } = checkAuth(context);

            const post = await Post.findById(postId);

            if(post){
                if(post.likes.find(like => like.username === username)){
                    post.likes = post.likes.filter(like => like.username !== username );
                } else {
                    post.likes.push({
                        username,
                        createdAt: new Date().toISOString()
                    });
                }
                await post.save();
                return post;
            } else throw new UserInputError('Post not found')
        }
    }
}