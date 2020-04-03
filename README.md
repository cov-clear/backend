# Cov-Clear backend

The cov clear backend is a platform designed to securely manage:

- The administration of mass community testing for covid-19.
- The ability to securely share test results with others, acting as an "immunity passport".
- The ability to anlyse aggregated and anonymised test result data. Helping to establish:
  - the efficacy of different tests.
  - the persistence of antibodies over time.
  - patient reinfection rates.
  - variances by demographic segments

### User interaction

For more information on how the platform can be used, please refer to the documentation for the corresponding [https://github.com/cov-clear/web/blob/master/README.md](web application).

### Authentication

Users register and log in to the system through 'magic-links', these are one-time links that are sent into user's email inbox. The link contains an authCode, that can be exchanged for a secure token used for future requests. The link is one-time, as it expires on first usage. To login again, a new magic link, containing a new auth code, must be requested. As such, the system does not contain any passwords, and can only be accessed via the users email inbox.

### Data capture

The application asks users to submit both demographic (date of birth & sex) & location (full address) information, to enable demographic segmentation of results. Address information may be used to verify a patient's identity, and at later stages to track outbreaks via test results. Data is only communicated over secure SSL connections.

### Data access & sharing results

The system is secured such that patients control their own data. A patient may issue a unique, short-lived, sharing code that enables another user to securely view and verify those results. Sharing codes have a life span of only 60 seconds to prevent their leakage and to prevent any brute force attempt to crack codes.

Sharing codes will typically be converted into a QR code which can be captured by another user. On capture, the capturer is granted an 'access pass' giving them permissions to view the sharers test result data (currently for one hour). There is no other way to lookup or view a patients data, ensuring the patient controls who can access their data.

If the capturing user is granted an access code, and has sufficient permission (e.g. they are a registered doctor), they may add new results on behalf of a patient.

### Roles, permissions & test confidence

The platform contains a flexible system for managing roles & permissions. These enable priviledged users to perform more tasks (like submitting a test result for another user). They also influence the confidence level in a test result.

If a test is administered and processed by a medical professional with a recognised role, we can have high confidence that the tests was perfomed by the correct patient, and that the result was entered faithfully. If a patient performs their own test & self submits data, we cannot be sure that someone else did not take the test for them, nor that they submitted the correct data. The system records test confidence based on the roles of the users submitting the data.

### Data analysis

Data analysis is performed on anonymised data sets, and by authorised personnel only. For analysis, test subjects are given unique identifiers unconnected to their PII, allowing the analysis of a single patient's test results over time, but without exposing any link back to the original patient, or their data.

It is also not possible to use a patients other data to deanonymise test result data. There is no link between the two in either direction.

Date of birth data is converted to age, and address data converted to regions to further prevent statistical deanonymisation of result data.

### API

Full API documentation is available [https://documenter.getpostman.com/view/870016/SzYUZ1LQ?version=latest](here).

## Team

This application was designed and built by a team of engineers from [https://transferwise.com/](transferwise.com/) in partnership with a team of medical professionals. To learn more about the project and the team, please visit [https://cov-clear.com/about](cov-clear.com/about).

## Getting started

Start with

`npm install`

Then run

`docker-compose up`

to get the development postgres instance up, then run

`npm run develop`

to get a reloading server environment up.

## Tasks:

- `npm run build`: builds typescript for deployment
- `npm run start`: starts (an already built) application
- `npm run develop`: runs your code in an automatically-reloading environment
- `npm run test`: runs all tests
- `npm run test:watch`: starts a live reloading test environment (use this for development)
- `npm run format`: formats your code with prettier (will do this automatically on commit)
