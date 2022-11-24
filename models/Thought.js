const { Schema, model } = require('mongoose');

// Reaction Schema- This will not be a model, but rather will be used as the `reaction` field's subdocument schema in the `Thought` model.
const reactionSchema = new Schema(
    {
        reactionId: {
            type: Schema.Types.ObjectId,
            default: () => new Types.ObjectId()

        },
        reactionBody: {
            type: String,
            required:true,
            maxlength: 280

        },
        username: {
            type: String,
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: createdAtDate => moment(createdAtDate).format('MMM DD, YYYY [at] hh:mm a')

        },
    },
    {
        toJSON: {
            virtuals: true,
        },
        id: false,
    }
);



// Schema to create Thought model
const thoughtSchema = new Schema(
    {
        thoughtText: {
            type: String,
            required: true,
            minlength: 1,
            maxlength: 280

        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: createdAtDate => moment(createdAtDate).format('MMM DD, YYYY [at] hh:mm a')

        },
        username: {
            type: String,
            required: true,
        },
        reactions: [reactionSchema],
    },
    {
        // Mongoose supports two Schema options to transform Objects after querying MongoDb: toJSON and toObject.
        // Here we are indicating that we want virtuals to be included with our response, overriding the default behavior
        toJSON: {
            virtuals: true,
        },
        id: false,
    }
);

// Create a virtual called `reactionCount` that retrieves the length of the thought's `reactions` array field on query.
thoughtSchema.virtual(`reactionCount`).get(function () {
    return this.reactions.length;
});

// Initialize our Post model
const Thought = model('Thought', thoughtSchema);

module.exports = Thought;