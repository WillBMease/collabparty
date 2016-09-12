var User = {
  // Enforce model schema in the case of schemaless databases
  schema: true,
  connection: 'user',

  attributes: {
    username  : { type: 'string', unique: true },
    email     : { type: 'email',  unique: true },
    passports : { collection: 'Passport', via: 'user' }

    room: {
      model: 'room'
    }
  }
};

module.exports = User;
