const { AuthenticationError } = require('apollo-server-express');
const { User } =require('./../models');
const { signToken } = require('./../utils/auth');

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if(context.user) {
                const userData = await User.findOne({ _id: context.user._id })
                .select("-__v -password")
                .populate("books");

                return userData;
            }
            throw new AuthenticationError('must be logged in to complete this action');
        }
    },
    Mutation: {
        addUser: async (parent, args) => {
            try {
                const user = await User.create(args);
                const token = signToken(user);
                return { token, user };           
            } catch (err) {
                console.error(err);
            }
        },
        login: async (parent, {email, password}) => {
            const user = await User.findOne({ email });
            if(!user) {
                throw new AuthenticationError('user not found');
            }

            const correctPw = await user.isCorrectPassword(password);
            if(!correctPw) {
                throw new AuthenticationError('incorrect username or password');
            }

            const token = signToken(user);
            return { token, user };
        },
        saveBook: async (parent, args, context) => {
            if(context.user) {
                const updatedUser = await User.findOneByIdAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: { savedBooks: args.input }},
                    { new: true, runValidators: true }
                );
                return updatedUser
            } 
            throw new AuthenticationError('must be logged in to complete this action');
        },
        removeBook: async (parent, args, context) => {
            if(context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user_id },
                    { $pull: { savedBooks: { bookId: args.bookId } } },
                    { new: true }
                );
                return updatedUser;
            }
            throw new AuthenticationError('you must be logged in to complete this action');
        },
},
};

module.exports = resolvers;
