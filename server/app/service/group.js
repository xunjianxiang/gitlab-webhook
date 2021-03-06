'use strict';

const Service = require('egg').Service;

class GroupService extends Service {

  async getRemoteUnique(remote) {
    const group = await this.ctx.model.Group
      .findOne({
        remote,
      })
      .catch(error => this.ctx.helper.mongooseErrorCatch(error));
    return !group;
  }

  async getNameUnique(name) {
    const group = await this.ctx.model.Group
      .findOne({
        name,
      })
      .catch(error => this.ctx.helper.mongooseErrorCatch(error));
    return !group;
  }

  async getGroupList() {
    const user = this.ctx.session.user;
    const condition = user.role === 1
      ? {}
      : { 'users.id': { $in: [ user.id ] } };
    const groups = await this.ctx.model.Group
      .find(condition)
      .catch(error => this.ctx.helper.mongooseErrorCatch(error));
    return groups;
  }

  async getGroupRemoteId(group_id, remote_type) {
    const group = await this.ctx.model.Group
      .findOne({
        _id: group_id,
        'remote.type': remote_type,
      }, 'remote.id').catch(error => this.ctx.helper.mongooseErrorCatch(error));
    return group && group.remote && group.remote.id;
  }

  async createGroup(params) {
    const user = this.ctx.session.user;
    params.users = [{ id: user.id, role: user.role }];
    const group = await this.ctx.model.Group
      .create(params)
      .catch(error => this.ctx.helper.mongooseErrorCatch(error));
    return group;
  }

  async getGroupUserExists(group_id, user_id) {
    const exists = await this.ctx.model.Group
      .findOne({
        _id: group_id,
        'users.id': user_id,
      })
      .catch(error => this.ctx.helper.mongooseErrorCatch(error));
    return exists;
  }

  async getGroupUserList(group_id) {
    const group = await this.ctx.model.Group
      .findOne({
        _id: group_id,
      }, 'users')
      .populate({ path: 'users.id', select: 'name email' })
      .exec()
      .catch(error => this.ctx.helper.mongooseErrorCatch(error));
    return group
      ? group.users
        .filter(item => item.id)
        .map(item => {
          item.id.role = item.role;
          return item.id;
        })
      : [];
  }

  async createGroupUser(group_id, user_id, user_role) {
    const group = await this.ctx.model.Group
      .findOneAndUpdate({
        _id: group_id,
      }, {
        $push: {
          users: {
            id: user_id,
            role: user_role,
          },
        },
      })
      .catch(error => this.ctx.helper.mongooseErrorCatch(error));
    return group;
  }

  async removeGroupUser(group_id, user_id) {
    const group = await this.ctx.model.Group
      .findOneAndUpdate({
        _id: group_id,
      }, {
        $pull: {
          users: {
            id: user_id,
          },
        },
      })
      .catch(error => this.ctx.helper.mongooseErrorCatch(error));
    return group;
  }

  async getGroupSetting(group_id) {
    const group = await this.ctx.model.Group
      .findOne({
        _id: group_id,
      }, 'setting')
      .catch(error => this.ctx.helper.mongooseErrorCatch(error));
    return group && group.setting;
  }

  async updateGroupSetting(group_id, setting) {
    const group = await this.ctx.model.Group
      .findOneAndUpdate({
        _id: group_id,
      }, {
        setting,
      }, {
        new: true,
        fields: 'setting',
      })
      .catch(error => this.ctx.helper.mongooseErrorCatch(error));
    return group.setting;
  }
}

module.exports = GroupService;
