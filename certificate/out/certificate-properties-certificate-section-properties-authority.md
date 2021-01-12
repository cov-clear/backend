# Authority Schema

```txt
https://cov-clear.com/certificate.schema.json#/properties/ct/properties/auth
```

Section containing details of the testing authority that performed the test and thus issued the certificate.


| Abstract            | Extensible | Status         | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                  |
| :------------------ | ---------- | -------------- | ------------ | :---------------- | --------------------- | ------------------- | --------------------------------------------------------------------------- |
| Can be instantiated | No         | Unknown status | No           | Forbidden         | Allowed               | none                | [certificate.schema.json\*](certificate.schema.json "open original schema") |

## auth Type

`object` ([Authority](certificate-properties-certificate-section-properties-authority.md))

# Authority Properties

| Property      | Type     | Required | Nullable       | Defined by                                                                                                                                                                                                                                           |
| :------------ | -------- | -------- | -------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [aki](#aki)   | `string` | Required | cannot be null | [Passport Document](certificate-properties-certificate-section-properties-authority-properties-authority-key-identifier.md "https&#x3A;//cov-clear.com/certificate.schema.json#/properties/ct/properties/auth/properties/aki")                       |
| [name](#name) | `string` | Optional | cannot be null | [Passport Document](certificate-properties-certificate-section-properties-authority-properties-name-of-the-authority-that-performed-the-test.md "https&#x3A;//cov-clear.com/certificate.schema.json#/properties/ct/properties/auth/properties/name") |

## aki

ID for the public key corresponding to the private key with which this document was signed.


> This identifies the performer of the test, and acts as a quick way for a verifying application to identify the public key with which the signature can be verified
>

`aki`

-   is required
-   Type: `string` ([Authority Key Identifier](certificate-properties-certificate-section-properties-authority-properties-authority-key-identifier.md))
-   cannot be null
-   defined in: [Passport Document](certificate-properties-certificate-section-properties-authority-properties-authority-key-identifier.md "https&#x3A;//cov-clear.com/certificate.schema.json#/properties/ct/properties/auth/properties/aki")

### aki Type

`string` ([Authority Key Identifier](certificate-properties-certificate-section-properties-authority-properties-authority-key-identifier.md))

## name

Name of the authority that performed the test.


`name`

-   is optional
-   Type: `string` ([Name of the authority that performed the test](certificate-properties-certificate-section-properties-authority-properties-name-of-the-authority-that-performed-the-test.md))
-   cannot be null
-   defined in: [Passport Document](certificate-properties-certificate-section-properties-authority-properties-name-of-the-authority-that-performed-the-test.md "https&#x3A;//cov-clear.com/certificate.schema.json#/properties/ct/properties/auth/properties/name")

### name Type

`string` ([Name of the authority that performed the test](certificate-properties-certificate-section-properties-authority-properties-name-of-the-authority-that-performed-the-test.md))

### name Examples

```json
"UK, South London Covid mobile testing station"
```

```json
"EE, Saaremaa Immunity Testing Laboratory"
```
