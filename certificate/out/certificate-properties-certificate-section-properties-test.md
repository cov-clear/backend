# Test Schema

```txt
https://cov-clear.com/certificate.schema.json#/properties/ct/properties/t
```

Section containing medical information about the test performed and its result.


| Abstract            | Extensible | Status         | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                  |
| :------------------ | ---------- | -------------- | ------------ | :---------------- | --------------------- | ------------------- | --------------------------------------------------------------------------- |
| Can be instantiated | No         | Unknown status | No           | Forbidden         | Allowed               | none                | [certificate.schema.json\*](certificate.schema.json "open original schema") |

## t Type

`object` ([Test](certificate-properties-certificate-section-properties-test.md))

# Test Properties

| Property    | Type     | Required | Nullable       | Defined by                                                                                                                                                                                                      |
| :---------- | -------- | -------- | -------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [ts](#ts)   | `number` | Required | cannot be null | [Passport Document](certificate-properties-certificate-section-properties-test-properties-timestamp.md "https&#x3A;//cov-clear.com/certificate.schema.json#/properties/ct/properties/t/properties/ts")          |
| [mod](#mod) | `string` | Required | cannot be null | [Passport Document](certificate-properties-certificate-section-properties-test-properties-test-model.md "https&#x3A;//cov-clear.com/certificate.schema.json#/properties/ct/properties/t/properties/mod")        |
| [sn](#sn)   | `string` | Optional | cannot be null | [Passport Document](certificate-properties-certificate-section-properties-test-properties-test-serial-number.md "https&#x3A;//cov-clear.com/certificate.schema.json#/properties/ct/properties/t/properties/sn") |
| [res](#res) | `object` | Required | cannot be null | [Passport Document](certificate-properties-certificate-section-properties-test-properties-test-results.md "https&#x3A;//cov-clear.com/certificate.schema.json#/properties/ct/properties/t/properties/res")      |

## ts

Timestamp for when the test was taken.


> This should be in unix timestamp format (seconds since epoch)
>

`ts`

-   is required
-   Type: `number` ([Timestamp](certificate-properties-certificate-section-properties-test-properties-timestamp.md))
-   cannot be null
-   defined in: [Passport Document](certificate-properties-certificate-section-properties-test-properties-timestamp.md "https&#x3A;//cov-clear.com/certificate.schema.json#/properties/ct/properties/t/properties/ts")

### ts Type

`number` ([Timestamp](certificate-properties-certificate-section-properties-test-properties-timestamp.md))

## mod

An identifier for a known model of medical test


> Whilst including a url here could be useful, a more compact value might be preferable.
>

`mod`

-   is required
-   Type: `string` ([Test model](certificate-properties-certificate-section-properties-test-properties-test-model.md))
-   cannot be null
-   defined in: [Passport Document](certificate-properties-certificate-section-properties-test-properties-test-model.md "https&#x3A;//cov-clear.com/certificate.schema.json#/properties/ct/properties/t/properties/mod")

### mod Type

`string` ([Test model](certificate-properties-certificate-section-properties-test-properties-test-model.md))

### mod Examples

```json
"Biopanda Reagents RAPG-COV-019"
```

```json
"Randox Health COVID-19 HOME TESTING KIT"
```

## sn

Serial number of the specific test unit used.


`sn`

-   is optional
-   Type: `string` ([Test Serial Number](certificate-properties-certificate-section-properties-test-properties-test-serial-number.md))
-   cannot be null
-   defined in: [Passport Document](certificate-properties-certificate-section-properties-test-properties-test-serial-number.md "https&#x3A;//cov-clear.com/certificate.schema.json#/properties/ct/properties/t/properties/sn")

### sn Type

`string` ([Test Serial Number](certificate-properties-certificate-section-properties-test-properties-test-serial-number.md))

## res

Detailed results of the mdeical test.


> Note that this schema only includes results for a standard lateral flow rapid diagnostic test (RDT). 
>

`res`

-   is required
-   Type: `object` ([Test Results](certificate-properties-certificate-section-properties-test-properties-test-results.md))
-   cannot be null
-   defined in: [Passport Document](certificate-properties-certificate-section-properties-test-properties-test-results.md "https&#x3A;//cov-clear.com/certificate.schema.json#/properties/ct/properties/t/properties/res")

### res Type

`object` ([Test Results](certificate-properties-certificate-section-properties-test-properties-test-results.md))
