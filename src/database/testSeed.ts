import { getExistingOrCreateNewUser } from '../application/service';
import {
  permissionRepository,
  roleRepository,
  userRepository,
} from '../infrastructure/persistence';
import { Permission } from '../domain/model/authentication/Permission';
import { Role } from '../domain/model/authentication/Role';
import {
  ASSIGN_PERMISSION_TO_ROLE,
  ASSIGN_ROLE_TO_USER,
} from '../domain/model/authentication/Permissions';
import { ADMIN, DOCTOR } from '../domain/model/authentication/Roles';
import { User } from '../domain/model/user/User';
import { Profile } from '../domain/model/user/Profile';
import { Sex } from '../domain/model/user/Sex';
import { DateOfBirth } from '../domain/model/user/DateOfBirth';
import { anAddress } from '../test/domainFactories';

export async function createSeedDataForTestingPeriod() {
  const admin = await createAdminAccount();
  const patient = await createPatientAccount();
  const doctor = await createDoctorAccount();

  await createPermissions();
  const doctorRole = await createDoctorRole(admin);
  const adminRole = await createAdminRole(admin);

  admin.assignRole(adminRole, admin.id);
  doctor.assignRole(doctorRole, admin.id);

  return Promise.all([
    userRepository.save(admin),
    userRepository.save(doctor),
    userRepository.save(patient),
  ]);
}

async function createDoctorAccount() {
  const doctor = await getExistingOrCreateNewUser.execute(
    'doctor@covclear.com'
  );
  doctor.profile = new Profile(
    'John',
    'Lennon',
    DateOfBirth.fromString('1940-10-09'),
    Sex.MALE
  );
  doctor.address = anAddress();
  return userRepository.save(doctor);
}

async function createPatientAccount() {
  const patient = await getExistingOrCreateNewUser.execute(
    'patient@covclear.com'
  );
  patient.profile = new Profile(
    'Captain',
    'Kirk',
    DateOfBirth.fromString('1940-10-09'),
    Sex.MALE
  );
  patient.address = anAddress();
  return userRepository.save(patient);
}

async function createAdminAccount() {
  const admin = await getExistingOrCreateNewUser.execute('admin@covclear.com');
  admin.profile = new Profile(
    'Major',
    'Tom',
    DateOfBirth.fromString('1940-10-09'),
    Sex.MALE
  );
  admin.address = anAddress();
  return userRepository.save(admin);
}

async function createDoctorRole(admin: User) {
  return await roleRepository.save(new Role(DOCTOR));
}

async function createAdminRole(admin: User) {
  const role = await roleRepository.save(new Role(ADMIN));
  role.assignPermission(new Permission(ASSIGN_ROLE_TO_USER), admin.id);
  role.assignPermission(new Permission(ASSIGN_PERMISSION_TO_ROLE), admin.id);
  return await roleRepository.save(role);
}

async function createPermissions() {
  await permissionRepository.save(new Permission(ASSIGN_PERMISSION_TO_ROLE));
  await permissionRepository.save(new Permission(ASSIGN_ROLE_TO_USER));
}
