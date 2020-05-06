import { aNewUser, aRoleWithPermissions, aUserWithAllInformation } from './domainFactories';
import { Permission } from '../domain/model/authentication/Permission';
import { permissionRepository, roleRepository, userRepository } from '../infrastructure/persistence';

export async function persistedUserWithRoleAndPermissions(roleName: string, permissionNames: string[]) {
  const role = aRoleWithPermissions(
    roleName,
    permissionNames.map((permissionName) => new Permission(permissionName))
  );
  const admin = aNewUser();
  admin.assignRole(role, admin.id);

  await Promise.all(permissionNames.map((permissionName) => permissionRepository.save(new Permission(permissionName))));
  await roleRepository.save(role);
  return await userRepository.save(admin);
}
