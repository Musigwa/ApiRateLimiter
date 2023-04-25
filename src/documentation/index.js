import definitions from './definitions';
import paths from './paths';

const { DEV_ADMIN_EMAIL = 'info@apiratelimiter.com' } = process.env;

console.log('DEV_ADMIN_EMAIL', DEV_ADMIN_EMAIL);
export default {
  swagger: '2.0',
  info: {
    description: 'Api rate limiter documentation',
    version: '1.0.0',
    title: 'Api Rate Limiter',
    termsOfService: '',
    contact: { name: 'Admin', email: DEV_ADMIN_EMAIL, },
    license: {},
  },
  basePath: '/',
  produces: ['application/json'],
  consumes: ['application/json'],
  paths,
  definitions,
};

// 0788659504