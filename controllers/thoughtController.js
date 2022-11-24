const { User, Thought } = require('../models');

const thoughtController = {
  //get all thoughts
  getThoughts(req, res) {
    Thought.find()
      .populate({
        path: 'reactions',
        select: '-__v'
      })
      .then((thoughts) => res.json(thoughts))
      .catch((err) => res.status(500).json(err));
  },
  //get one thought by id
  getSingleThought(req, res) {
    Thought.findOne({ _id: req.params.thoughtId })
      .select('-__v')
      .populate({
        path: 'reactions',
        select: '-__v'
      })
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: 'No thought with that ID' })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },
  // create a new thought
  createThought(req, res) {
    console.log(req.body);
    Thought.create(req.body)
        .then(thought => {
            User.findByIdAndUpdate(req.body.userId,
                {
                    $addToSet: { thoughts: thought._id }
                },
                { new: true })
                .then((user) =>
                    !user
                        ? res.status(404).json({ message: 'No user with that ID, but thought was created' })
                        : res.json(thought)

                )
                .catch((err) => res.status(500).json(err));
        })
},
    
  //update a thought
updateThought(req,res){
  Thought.findOneAndUpdate(
    { _id: req.params.thoughtId },
    { $set: req.body },
    { runValidators: true, new: true }
  )
    .then((thought) =>
      !thought
        ? res.status(404).json({ message: 'No thought with this id!' })
        : res.json(thought)
    )
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    }
  )
},
  //delete a thought 
  deleteThought(req, res) {
    Thought.findOneAndDelete({ _id: req.params.thoughtId })
      .then((thought) =>{
        if (!thought) {
          res.status(404).json({ message: 'No thoughts found with that id!' });
          return;
        }
        return User.findOneAndUpdate(
          { _id: req.params.userId },
          { $pull: { thoughts: req.params.Id } },
          { new: true }
        )
      })
      .then(userData => {
        if (!userData) {
          res.status(404).json({ message: 'No User found with this id but thought deleted!' });
          return;
        }
        res.json(userData);
      })
      .catch(err => res.json(err));
  },

  //add reactions
  addReaction (req,res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $push: { reactions: req.body } },
      { runValidators: true, new: true }
    )
    .populate({path: 'reactions', select: '-__v'})
    .select('-__v')
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: 'No thought with this id!' })
          : res.json(thought)
      )
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      }
    )
  },

  //delete reaction
  deleteReaction (req,res){
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { reactionId: req.params.reactionId } },
      { runValidators: true, new: true }
    )
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: 'No thought with this id!' })
          : res.json(thought)
      )
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      }
    )
  }
};

module.exports = thoughtController
