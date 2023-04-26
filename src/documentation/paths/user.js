export default {
  '/users/signup': {
    post: {
      tags: ['Authentication - Authorization'],
      summary: 'Create user account',
      consumes: ['application/json'],
      produces: ['application/json'],
      parameters: [
        {
          in: 'body',
          name: 'body',
          schema: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
                name: 'name',
                description: 'Enter your first name (no title allowed)',
                required: true,
              },
              surname: {
                type: 'string',
                name: 'surname',
                description:
                  'Enter your last name (space-separate anymore than one names)',
                required: true,
              },
              email: {
                type: 'string',
                name: 'email',
                description: 'Enter your email address',
                required: true,
              },
              password: {
                type: 'string',
                name: 'password',
                description: 'Please use a strong password',
                required: true,
              },
            },
          },
        },
      ],
      responses: {
        201: {
          description: 'Successful account creation',
          schema: {
            type: 'object',
            properties: {
              data: { $ref: '#/definitions/UserSchema', in: 'body' },
            },
          },
          headers: {
            Authorization: {
              type: 'string',
              description: 'The access token for subsequent (secured) requests',
              example:
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
            },
          },
        },
      },
    },
  },
  '/users/login': {
    post: {
      tags: ['Authentication - Authorization'],
      summary: 'User login',
      consumes: ['application/json', 'application/x-www-form-urlencoded'],
      produces: ['application/json'],
      parameters: [
        {
          in: 'formData',
          type: 'string',
          name: 'email',
          required: true,
        },
        {
          in: 'formData',
          type: 'string',
          name: 'password',
          required: true,
        },
      ],
      responses: {
        200: {
          description: 'User authentication succeeded',
          schema: {
            type: 'object',
            properties: {
              data: { $ref: '#/definitions/UserSchema', password: undefined },
            },
          },
          headers: {
            Authorization: {
              type: 'string',
              description: 'The access token for subsequent (secured) requests',
              example:
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
            },
          },
        },
      },
    },
  },
  '/users/me': {
    get: {
      tags: ['User'],
      summary: 'Get current user',
      parameters: [
        {
          in: 'header',
          name: 'x-auth-token',
          required: true,
          type: 'string',
          description: 'Bearer token',
        },
      ],
      responses: {
        200: {
          schema: {
            type: 'object',
            properties: {
              status: { type: 'int32', example: 200 },
              data: { $ref: '#/definitions/UserSchema' },
            },
          },
        },
      },
    },
  },
};
