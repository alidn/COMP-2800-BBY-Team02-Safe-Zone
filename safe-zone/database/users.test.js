const {DatabaseClient} = require('./user');

test(
  'get user by email',
  async () => {
    let database = await new DatabaseClient();
    await database.removeAllUsers();

    let want = {
      username: 'getUserByEmail',
      password: 'pass',
      email: 'me@gmail.com',
    };

    await database.addUser(want);

    let got = await database.getUserByEmail(want.email);
    expect(got.username).toBe(want.username);
    expect(got.email).toBe(want.email);
    expect(got.password).toBe(want.password);

    await database.close();
  },
);

test(
  'get user my username',
  async () => {
    let database = await new DatabaseClient();
    await database.removeAllUsers();

    let want = {
      username: 'getUserByUsername',
      password: 'pass',
      email: 'me@gmail.com',
    };

    await database.addUser(want);

    let got = await database.getUserByUsername(want.username);
    expect(got.username).toBe(want.username);
    expect(got.email).toBe(want.email);
    expect(got.password).toBe(want.password);

    await database.close();
  },
);

test(
  'add existing user',
  async () => {
    let database = await new DatabaseClient();
    await database.removeAllUsers();

    let user = {
      username: 'some_user',
      email: 'some_user@gmail.com',
      password: 'pass',
    };

    await database.addUser(user);
    let {ok, error} = await database.addUser(user);
    expect(ok).toBeFalsy();

    await database.close();
  },
);

test(
  'add existing email',
  async () => {
    let database = await new DatabaseClient();
    await database.removeAllUsers();

    let user = {
      username: 'some_user',
      email: 'some_user@gmail.com',
      password: 'pass',
    };

    let secondUser = user;
    secondUser.username = 'second_user';

    await database.addUser(user);
    let {ok, error} = await database.addUser(user);
    expect(ok).toBeFalsy();

    await database.close();
  },
);

test(
  'add scores',
  async () => {
    let database = await new DatabaseClient();
    await database.removeAllUsers();

    let user = {
      username: 'some_user',
      email: 'some_user@gmail.com',
      password: 'pass',
    };

    await database.addUser(user);

    await database.addScore(user.username, 1);
    await database.addScore(user.username, 2);
    await database.addScore(user.username, 3);
    await database.addScore(user.username, 4);

    let {scores, error} = await database.topScores(user.username);
    expect(error).toBeNull();

    let i;
    let expectedScore = 4;
    for (i = 0; i < 4; i++) {
      expect(scores[i].score).toBe(expectedScore);
      expectedScore--;
    }

    await database.close();
  },
);
