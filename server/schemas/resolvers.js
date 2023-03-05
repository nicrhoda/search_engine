const { AuthenticationError } = require('apollo-server-express');
const { User } =require('./../models');
const { signToken } = require('./../utils/auth');

const resolvers = {
    Mutation: {
        createUser: async (parent, args) => {
            try {
                const user = await User.create(args);
                const token = signToken(user);
                return { token, user };           
            } catch (err) {
                console.error(err);
            }
        },
        login: async (parent, {username, email, password}) => {
            const user = await User.findOne({ $or: [{ email }, { username }]});
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
},
};

module.exports = resolvers;
