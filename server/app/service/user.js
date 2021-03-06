'use strict';

const Service = require('egg').Service;

class UserService extends Service {

  async findOneByNameAndPassword(name, password) {
    password = this.app.crypto(password);
    const user = await this.ctx.model.User
      .findOne({
        name,
        password,
      }, '_id name email role isldap')
      .catch(error => this.ctx.helper.mongooseErrorCatch(error));
    return user;
  }

  async findOneByNameFromLdap(name) {
    const info = {
      name,
      email: `${name}@shuzilm.cn`,
      isldap: true,
    };

    const user = await this.ctx.model.User
      .findOneAndUpdate(info, info, {
        new: true,
        upsert: true,
        fields: '_id name email role isldap',
      })
      .catch(error => this.ctx.helper.mongooseErrorCatch(error));

    return user;
  }

  async addUser(params) {
    params.password = this.app.crypto(params.password);
    const user = await this.ctx.model.User
      .create(params)
      .catch(error => {
        console.log('error');
        return this.ctx.helper.mongooseErrorCatch(error);
      });

    return user;
  }

  async getUserList() {
    const users = await this.ctx.model.User
      .find({
        name: {
          $ne: 'admin',
        },
      })
      .catch(error => this.ctx.helper.mongooseErrorCatch(error));
    return users;
  }
}

module.exports = UserService;
