'use strict';

module.exports = appInfo => {
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name;

  exports.cluster = {
    listen: {
      port: 4000,
      hostname: '0.0.0.0',
    },
  };

  // add your config here
  config.middleware = [
    'interceptor',
  ];

  config.interceptor = {
    ignore: /\/login|\/logout|\/session|\/gitlab_hook/,
  };

  config.session = {
    key: 'gitlab-webhook',
    maxAge: 20 * 60 * 1000,
    httpOnly: true,
    signed: true,
    encrypt: true,
    renew: true,
  };

  config.security = {
    csrf: false,
  };

  config.mongoose = {
    clients: {
      ci: {
        url: 'mongodb://127.0.0.1/ci',
        options: {},
      },
      yapi: {
        url: 'mongodb://192.168.2.247/yapi',
        options: {},
      },
    },
  };

  config.onerror = {
    html(error, ctx) {
      let message;
      switch (error.status) {
        case 401:
          message = error.message;
          break;
        case 422:
          message = '参数错误';
          break;
        default:
          message = '服务器异常';
          break;
      }
      ctx.response.set({ Accept: 'application/json' });
      ctx.status = 200;
      ctx.body = JSON.stringify({
        code: error.status,
        message,
      });
    },
    json(error, ctx) {
      let message;
      switch (error.status) {
        case 401:
          message = error.message;
          break;
        case 422:
          message = '参数错误';
          break;
        default:
          message = '服务器异常';
          break;
      }
      ctx.response.set({ Accept: 'application/json' });
      ctx.status = 200;
      ctx.body = {
        code: error.status,
        message,
      };
    },
  };

  config.rundeck = {
    domain: 'http://rs.du.com',
    token: 'HBiFPhu6H07m0IsBMy1HoAxabPUoJI05',
  };

  config.dingtalk = {
    id: 'fangcl',
    level: 61,
  };

  config.yapi = {
    domain: 'http://yapi.du.com',
  };

  return config;
};
