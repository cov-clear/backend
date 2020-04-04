import { getExistingOrCreateNewUser } from '../application/service';
import {
  permissionRepository,
  roleRepository,
  testTypeRepository,
  userRepository,
} from '../infrastructure/persistence';
import { Permission } from '../domain/model/authentication/Permission';
import { Role } from '../domain/model/authentication/Role';
import {
  ADD_TAKE_HOME_TEST_RESULT,
  ASSIGN_PERMISSION_TO_ROLE,
  ASSIGN_ROLE_TO_USER,
  CREATE_NEW_PERMISSION,
  CREATE_NEW_ROLE,
  LIST_PERMISSIONS,
  LIST_ROLES,
} from '../domain/model/authentication/Permissions';
import { ADMIN, DOCTOR, USER } from '../domain/model/authentication/Roles';
import { User } from '../domain/model/user/User';
import { Profile } from '../domain/model/user/Profile';
import { Sex } from '../domain/model/user/Sex';
import { DateOfBirth } from '../domain/model/user/DateOfBirth';
import { anAddress, antibodyTestType } from '../test/domainFactories';

export async function createSeedDataForTestingPeriod() {
  const admin = await createAdminAccount();
  const patient = await createPatientAccount();
  const doctor = await createDoctorAccount();

  await createPermissions();

  const userRole = await createUserRole(admin);
  const doctorRole = await createDoctorRole(admin);
  const adminRole = await createAdminRole(admin);
  await createDefaultTestType();

  patient.assignRole(userRole, admin.id);
  admin.assignRole(adminRole, admin.id);
  doctor.assignRole(doctorRole, admin.id);

  return Promise.all([userRepository.save(admin), userRepository.save(doctor), userRepository.save(patient)]);
}

async function createDoctorAccount() {
  const doctor = await getExistingOrCreateNewUser.execute('doctor@covclear.com');
  doctor.profile = new Profile('John', 'Lennon', DateOfBirth.fromString('1940-10-09'), Sex.MALE);
  doctor.address = anAddress();
  return userRepository.save(doctor);
}

async function createPatientAccount() {
  const patient = await getExistingOrCreateNewUser.execute('patient@covclear.com');
  patient.profile = new Profile('Captain', 'Kirk', DateOfBirth.fromString('1940-10-09'), Sex.MALE);
  patient.address = anAddress();
  return userRepository.save(patient);
}

async function createAdminAccount() {
  const admin = await getExistingOrCreateNewUser.execute('admin@covclear.com');
  admin.profile = new Profile('Major', 'Tom', DateOfBirth.fromString('1940-10-09'), Sex.MALE);
  admin.address = anAddress();
  return userRepository.save(admin);
}

async function createUserRole(admin: User) {
  let userRole = await roleRepository.findByName(USER);
  if (!userRole) {
    userRole = await roleRepository.save(new Role(USER));
  }
  userRole.assignPermission(new Permission(ADD_TAKE_HOME_TEST_RESULT), admin.id);
  return roleRepository.save(userRole);
}

async function createDoctorRole(admin: User) {
  const doctorRole = await roleRepository.save(new Role(DOCTOR));
  doctorRole.assignPermission(new Permission(ADD_TAKE_HOME_TEST_RESULT), admin.id);
  return roleRepository.save(doctorRole);
}

async function createAdminRole(admin: User) {
  const role = await roleRepository.save(new Role(ADMIN));
  role.assignPermission(new Permission(ASSIGN_ROLE_TO_USER), admin.id);
  role.assignPermission(new Permission(ASSIGN_PERMISSION_TO_ROLE), admin.id);
  role.assignPermission(new Permission(CREATE_NEW_ROLE), admin.id);
  role.assignPermission(new Permission(CREATE_NEW_PERMISSION), admin.id);
  role.assignPermission(new Permission(LIST_ROLES), admin.id);
  role.assignPermission(new Permission(LIST_PERMISSIONS), admin.id);
  return await roleRepository.save(role);
}

async function createPermissions() {
  await permissionRepository.save(new Permission(LIST_ROLES));
  await permissionRepository.save(new Permission(LIST_PERMISSIONS));
  await permissionRepository.save(new Permission(ASSIGN_ROLE_TO_USER));
  await permissionRepository.save(new Permission(ASSIGN_PERMISSION_TO_ROLE));
  await permissionRepository.save(new Permission(CREATE_NEW_ROLE));
  await permissionRepository.save(new Permission(CREATE_NEW_PERMISSION));
  await permissionRepository.save(new Permission(ADD_TAKE_HOME_TEST_RESULT));
}

async function createDefaultTestType() {
  await testTypeRepository.save(antibodyTestType());
}
