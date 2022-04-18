const { User, Thought } = require('../models');

// Aggregate function to return the number of overall users.
const userCount = async () =>
  Student.aggregate()
    .count('userCount')
    .then((numberOfUsers) => numberOfUsers);


// I might need to create const to get thoughts and one for friends



module.exports = {
    // GET request to return all users.
    getUsers(req, res) {
        User.find()
          .then(async (users) => {
            const userObj = {
              users,
              userCount: await userCount(),
            };
            return res.json(userObj);
          })
          .catch((err) => {
            console.log(err);
            return res.status(500).json(err);
          });
      },

    // GET request to run a single user by their _id and populated thought and friend data.
    getSingleUser(req, res) {
        User.findOne({ _id: req.params.userId })
        .select('-__v')
        .then(async (user) =>
          !user
            ? res.status(404).json({ message: 'No user with that ID' })
            : res.json({ // JRM: there might be issues with this part.
                user,
                Thought,
                friends,
              })
        )
        .catch((err) => {
          console.log(err);
          return res.status(500).json(err);
        });
    },

    // POST request to create a new user.
    createUser(req, res) {
        User.create(req.body)
        .then((user) => res.json(user))
        .catch((err) => res.status(500).json(err));
    },

    // PUT request to update a user by their _id.
    updateUser(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $set: req.body },
            { runValidators: true, new: true }
          )
            .then((user) =>
              !user
                ? res.status(404).json({ message: 'No user with this id!' })
                : res.json(course)
            )
            .catch((err) => res.status(500).json(err));
    },

    // DELETE request to remove a user by their _id.
    deleteUser(req, res) {
        User.findOneAndRemove({ _id: req.params.userId })
        // .then((user) =>
        //   !user
        //     ? res.status(404).json({ message: 'User does not exist' })
        //     : user.findOneAndUpdate(
        //         { friends: req.params.userId },
        //         { $pull: { friends: req.params.userId } },
        //         { new: true }
        //       )
        // )
        .catch((err) => {
          console.log(err);
          res.status(500).json(err);
        });
    },

    // POST request to add a new friend to a user's friend list.
    addFriend(req, res) {
        console.log(`You are adding a friend to a user's friend list`);
        console.log(req.body);
        User.findOneAndUpdate(
          { _id: req.params.userId },
          { $addToSet: { friends: req.body } },
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

    // DELETE request to remove a friend from a user's friend list.
    removeFriend(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $pull: { friends: { userId: req.params.userId } } },
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
};
