module.exports = {
  prefix: '',
  entities: {
    role: {
      table: 'roles',
      model: 'Role',
      file: 'role.js'
    },
    userRole: {
      table: 'usersRoles',
      model: 'UserRole',
      file: 'userRole.js'
    },
    resource: {
      table: 'resources',
      model: 'Resource',
      file: 'resource.js'
    },
    permission: {
      table: 'permissions',
      model: 'Permission',
      file: 'permission.js'
    },
    policy: {
      table: 'policies',
      model: 'Policy',
      file: 'policy.js'
    }
  }
}
