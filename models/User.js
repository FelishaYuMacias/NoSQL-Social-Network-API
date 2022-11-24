const { Schema, model } = require('mongoose');

// Schema to create User model
const userSchema = new Schema(
  {
    username: {
        type: String,
        unique:true,
        required: true,
        trim:true

      },
      email: {
        type: String,
        required: true,
        unique:true,
        match: [/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/, 'Please enter a valid email']

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
      virtuals: true,
    },
    id: false,
  }
);

//Create a virtual called `friendCount` that retrieves the length of the user's `friends` array field on query.
userSchema
  .virtual(`friendCount`)
  // Getter
  .get(function () {
    return this.friends.length;
  })

// Initialize our User model
const User = model('User', userSchema);

module.exports = User;
