# README

## Top-level Schemas

-   [Passport Document](./certificate.md "A cryptographically signed document containing details of an individual (the holder)'s medical test results") – `https://cov-clear.com/certificate.schema.json`

## Other Schemas

### Objects

-   [Authority](./certificate-properties-certificate-section-properties-authority.md "Section containing details of the testing authority that performed the test and thus issued the certificate") – `https://cov-clear.com/certificate.schema.json#/properties/ct/properties/auth`
-   [Certificate Section](./certificate-properties-certificate-section.md "Section containing all of the data relating to the medical test, the holder, and the authority that issued the certificate") – `https://cov-clear.com/certificate.schema.json#/properties/ct`
-   [Identification](./certificate-properties-certificate-section-properties-identification.md "Section identifying the identity document to which this certificate relates") – `https://cov-clear.com/certificate.schema.json#/properties/ct/properties/id`
-   [Test](./certificate-properties-certificate-section-properties-test.md "Section containing medical information about the test performed and its result") – `https://cov-clear.com/certificate.schema.json#/properties/ct/properties/t`
-   [Test Results](./certificate-properties-certificate-section-properties-test-properties-test-results.md "Detailed results of the mdeical test") – `https://cov-clear.com/certificate.schema.json#/properties/ct/properties/t/properties/res`

### Arrays



## Version Note

The schemas linked above follow the JSON Schema Spec version: `http://json-schema.org/draft-04/schema#`
