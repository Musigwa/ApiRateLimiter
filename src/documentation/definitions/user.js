const UserProperties = {
  firstName: { type: 'string', example: 'Paulette' },
  lastName: { type: 'string', example: 'Mpano' },
  email: { type: 'string', example: 'p.mpano@irembo.com' },
  password: { type: 'string', example: 'Password!1', },
};

// The models definitions
export default {
  UserSchema: {
    type: 'object',
    required: Object.keys(UserProperties),
    properties: UserProperties,
  },
  get SignupSchema() {
    return this.UserSchema;
  },
  LoginSchema: {
    type: 'object',
    properties: (({ email, password }) => ({ email, password }))(UserProperties),
    get required() {
      return Object.keys(this.properties);
    }
  },
};
