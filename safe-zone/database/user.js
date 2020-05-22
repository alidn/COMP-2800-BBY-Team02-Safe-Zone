const { MongoClient } = require("mongodb");

const { uri } = require("./utils");

class DatabaseClient {
  constructor() {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    return new Promise(async (resolve, reject) => {
      try {
        await client.connect();
        this.client = client;
        let users = client.db("game").collection("users");
        this.users = users;
      } catch (e) {
        console.log("Could not connect to the mongodb client " + e);
      }
      resolve(this);
    });
  }

  /**
   * Adds a user to the 'users' collection.
   * @param {Object} userInfo - An object containing 'username', 'email' and
   * 'password' fields.
   * @return {Object} - An object with 'ok' and 'error' fields.
   */
  async addUser(userInfo) {
    userInfo = { ...userInfo, scores: [], friendsList: [] };
    if (userInfo.password === undefined) {
      return { ok: false, error: "the password is not valid" };
    }
    let { exists, error } = await this.usernameExists(userInfo.username);
    if (exists) {
      return { ok: false, error: "Username already exists" };
    }
    let result = await this.emailExists(userInfo.email);
    if (result.exists) {
      return { ok: false, error: "Email already exists" };
    }

    try {
      await this.users.insertOne({ ...userInfo });
      return { ok: true, verror: null };
    } catch (e) {
      console.log("Error trying to insert a user ");
      return { ok: false, error: e };
    }
  }

  /**
   * Finds and returns a user in the 'users' collection
   * @param {string} email
   * @return {Object | null} Returns either a single user or nothing.
   */
  async getUserByEmail(email) {
    return await this.users.findOne({ email });
  }

  /**
   * Finds and returns a user in the 'users' collection
   * @param {string} username
   * @return {Object | null} Returns either a single user or nothing.
   */
  async getUserByUsername(username) {
    return await this.users.findOne({ username });
  }

  /**
   * Checks if the given username exists in the 'users' collection.
   * @param {String} username - the username to check
   * @return {Objcet} - and Object containing 'exists' and 'error' fields.
   * the 'error' field will be null if no error was encountered.
   */
  async usernameExists(username) {
    try {
      let searchResult = await this.users.findOne({
        username,
      });
      if (searchResult) {
        return { exists: true, error: null };
      } else {
        return { exists: false, error: null };
      }
    } catch (e) {
      return { error: "an error encountered while checking the username " + e };
    }
  }

  /**
   * Checks if the given email exists in the 'users' collection.
   * @param {String} email - the email to check
   * @return {Objcet} - and Object containing 'exists' and 'error' fields.
   * the 'error' field will be null if no error was encountered.
   */
  async emailExists(email) {
    try {
      let searchResult = await this.users.findOne({
        email,
      });
      if (searchResult) {
        return { exists: true, error: null };
      } else {
        return { exists: false, error: null };
      }
    } catch (e) {
      return { error: "an error encountered while checking the email" + e };
    }
  }

  async addScore(username, score) {
    let { exists, error } = await this.usernameExists(username);
    if (error !== null) {
      return { error: "error " + error };
    }
    if (!exists) {
      return { error: "username doesn't exist " };
    }

    score = {
      score,
      dateAchieved:
        new Date().getDate() +
        "/" +
        new Date().getMonth() +
        "/" +
        new Date().getFullYear(),
    };

    try {
      await this.users.updateOne(
        { username },
        {
          $push: {
            scores: score,
          },
        }
      );
      return { error: null };
    } catch (e) {
      return { error: "Could not add a new score: " + e };
    }
  }

  /**
   * Returns the top 'n' scores of the given username. If n is not passed all
   * of the scores are passed.
   * @param {String} username
   * @param {Number} n - the number of scores to return.
   * @return {Object} - an object containing the 'scores' field which is an
   * array of objects containing {score, dateAchieved}
   * and an 'error' field which will be null if no error was
   * encountered and a String containing the error message if an error was
   * encountered.
   */
  async topScores(username, n) {
    let { exists, error } = await this.usernameExists(username);
    if (error || !exists) {
      return { error: "The username is not valid " + error };
    }

    let user = await this.users.findOne(
      { username },
      { projection: { scores: 1, _id: 0 } }
    );

    user.scores.sort((s1, s2) => s2.score - s1.score);
    if (n !== undefined) {
      user.scores = user.scores.slice(0, n);
    }

    return { scores: user.scores, error: null };
  }

  async gamesPlayed(username) {
    let user = await this.users.findOne(
      { username },
      { projection: { scores: 1, _id: 0 } }
    );
    return user.scores.length;
  }

  async close() {
    this.client.close();
  }

  async removeAllUsers() {
    this.users.remove();
  }

  /**
   * @param {Number} n - the number of top users to returns.
   */
  async topUsers(n) {}
}

// module.exports = DatabaseClient;
exports.DatabaseClient = DatabaseClient;
