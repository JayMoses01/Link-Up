const { User, Thought } = require('../models');

module.exports = {

    // For GET request to return all thoughts.
    getThoughts(req, res) {
        Thought.find()
          .then((thoughts) => res.json(thoughts))
          .catch((err) => res.status(500).json(err));
      },

    // For GET request to return a single thought by its _id.
    getSingleThought(req, res) {
        Thought.findOne({ _id: req.params.thoughtId })
          .select('-__v')
          .then((thought) =>
            !thought
              ? res.status(404).json({ message: 'No thought with that ID' })
              : res.json(thought)
          )
          .catch((err) => res.status(500).json(err));
      },

    // For POST request to create a new thought and push the created thought's _id to the associated user's thoughts array field.
    createThought(req, res) {
        console.log(`You are adding a thought to a user's thoughts list`);
        console.log(req.body);
        User.findOneAndUpdate(
          { _id: req.params.userId },
          { $addToSet: { thoughts: req.body } },
          { runValidators: true, new: true }
        )
          .then((user) =>
            !user
              ? res
                  .status(404)
                  .json({ message: 'No user found with that ID :(' })
              : res.json(user)
          )
          .catch((err) => res.status(500).json(err));
    },

    // For PUT request to update a thought by its _id.
    updateThought(req, res) {
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
          .catch((err) => res.status(500).json(err));
      },

    // For DELETE request to remove a thought by its _id.
    deleteThought(req, res) {
        Thought.findOneAndDelete({ _id: req.params.thoughtId })
        //   .then((thought) =>
        //     !thought
        //       ? res.status(404).json({ message: 'No thought with that ID' })
        //       : User.deleteMany({ _id: { $in: user.thought } })
        //   )
          .then(() => res.json({ message: 'Course and students deleted!' }))
          .catch((err) => res.status(500).json(err));
      },

    // For POST request to create a reaction stored in a single thought's reactions array field.
    createReaction(req, res) {
        console.log(`You are adding a reaction to a thoughts list`);
        console.log(req.body);
        Thought.findOneAndUpdate(
          { _id: req.params.thoughtId },
          { $addToSet: { reaction: req.body } },
          { runValidators: true, new: true }
        )
          .then((thought) =>
            !thought
              ? res
                  .status(404)
                  .json({ message: 'No thought found with that ID :(' })
              : res.json(thought)
          )
          .catch((err) => res.status(500).json(err));
    },

    // For DELETE request to pull and remove a reaction by the reaction's reactionId value.
    removeReaction(req, res) {
        Thought.findOneAndUpdate(
          { _id: req.params.thoughtId },
          { $pull: { reactions: { thoughtId: req.params.thoughtId } } },
          { runValidators: true, new: true }
        )
          .then((thought) =>
            !thought
              ? res
                  .status(404)
                  .json({ message: 'No thought found with that ID :(' })
              : res.json(thought)
          )
          .catch((err) => res.status(500).json(err));
      },

};
