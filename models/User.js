const { Schema, model } = require('mongoose');
const thoughtSchema = require('./Thought');

// const validator = require('validator');

// Schema to create User model.
const userSchema = new Schema(
    {
        username: {
            type: String,
            unique: true,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            // validate: {
            //     validator: () => Promise.resolve(false),
            //     message: 'Email validation failed'
            // },
        },
        thoughts: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Thought',
            },
        ],
        friends: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
    },
    {
        toJSON: {
            getters: true,
        },
    }
);

// Creates a virtual property called "friendCount" that retrieves the length of the users' friends array field on query.
userSchema
  .virtual('friendCount')
  // Getter
  .get(function () {
    return this.friends.length;
  });

const User = model('User', userSchema);

module.exports = User;
