// import request from "supertest";
// import expressApp from "../../loaders/express";
// import database from "../../database";
// import { cleanupDatabase } from "../../test/cleanupDatabase";
// import { UserId } from "../../domain/model/user/UserId";
// import { testTypeRepository } from "../../infrastructure/persistence";
// import { TestType } from "../../domain/model/testType/TestType";
//
// import { userRepository } from "../../infrastructure/persistence";
// import { User } from "../../domain/model/user/User";
// import { Email } from "../../domain/model/user/Email";
//
// describe("user endpoints", () => {
//   const app = expressApp();
//
//   beforeEach(async () => {
//     await cleanupDatabase();
//   });
//
//   describe("GET /users/:id/test-types", () => {
//     it("returns 404 if user is not found", async () => {
//       const id = new UserId();
//       await request(app)
//         .get(`/api/v1/users/${id.value}/test-types`)
//         .expect(404);
//     });
//
//     it("returns 200 with the existing test type if user is found", async () => {
//       const id = new UserId();
//
//       await userRepository.save(new User(id, new Email("kostas@tw.ee")));
//
//       await request(app)
//         .get(`/api/v1/users/${id.value}/test-types`)
//         .expect(200)
//         .expect((response) => {
//           const testTypes = response.body;
//           expect(Array.isArray(testTypes)).toBeTruthy(); // TODO do better here !!!
//         });
//     });
//   });
// });
//
// afterAll(() => {
//   return database.destroy();
// });
