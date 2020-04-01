import { aNewUser, aRoleWithPermissions } from './domainFactories';
import { ADMIN } from '../domain/model/authentication/Roles';
import { Permission } from '../domain/model/authentication/Permission';
import { permissionRepository, roleRepository, userRepository } from '../infrastructure/persistence';

export async function persistedUserWithRoleAndPermissions(roleName: string, permissionNames: string[]) {
  const role = aRoleWithPermissions(
    ADMIN,
    permissionNames.map((permissionName) => new Permission(permissionName))
  );
  const admin = aNewUser();
  admin.assignRole(role, admin.id);

  await Promise.all(permissionNames.map((permissionName) => permissionRepository.save(new Permission(permissionName))));
  await roleRepository.save(role);
  return userRepository.save(admin);
}
