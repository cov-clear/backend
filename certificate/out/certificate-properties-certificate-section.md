# Certificate Section Schema

```txt
https://cov-clear.com/certificate.schema.json#/properties/ct
```

Section containing all of the data relating to the medical test, the holder, and the authority that issued the certificate.


| Abstract            | Extensible | Status         | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                  |
| :------------------ | ---------- | -------------- | ------------ | :---------------- | --------------------- | ------------------- | --------------------------------------------------------------------------- |
| Can be instantiated | No         | Unknown status | No           | Forbidden         | Allowed               | none                | [certificate.schema.json\*](certificate.schema.json "open original schema") |

## ct Type

`object` ([Certificate Section](certificate-properties-certificate-section.md))

# Certificate Section Properties

| Property      | Type     | Required | Nullable       | Defined by                                                                                                                                                                     |
| :------------ | -------- | -------- | -------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [v](#v)       | `string` | Required | cannot be null | [Passport Document](certificate-properties-certificate-section-properties-version.md "https&#x3A;//cov-clear.com/certificate.schema.json#/properties/ct/properties/v")         |
| [t](#t)       | `object` | Required | cannot be null | [Passport Document](certificate-properties-certificate-section-properties-test.md "https&#x3A;//cov-clear.com/certificate.schema.json#/properties/ct/properties/t")            |
| [id](#id)     | `object` | Required | cannot be null | [Passport Document](certificate-properties-certificate-section-properties-identification.md "https&#x3A;//cov-clear.com/certificate.schema.json#/properties/ct/properties/id") |
| [auth](#auth) | `object` | Required | cannot be null | [Passport Document](certificate-properties-certificate-section-properties-authority.md "https&#x3A;//cov-clear.com/certificate.schema.json#/properties/ct/properties/auth")    |

## v

Version of the cov-clear certificate schema to which this certificate conforms.


`v`

-   is required
-   Type: `string` ([Version](certificate-properties-certificate-section-properties-version.md))
-   cannot be null
-   defined in: [Passport Document](certificate-properties-certificate-section-properties-version.md "https&#x3A;//cov-clear.com/certificate.schema.json#/properties/ct/properties/v")

### v Type

`string` ([Version](certificate-properties-certificate-section-properties-version.md))

## t

Section containing medical information about the test performed and its result.


`t`

-   is required
-   Type: `object` ([Test](certificate-properties-certificate-section-properties-test.md))
-   cannot be null
-   defined in: [Passport Document](certificate-properties-certificate-section-properties-test.md "https&#x3A;//cov-clear.com/certificate.schema.json#/properties/ct/properties/t")

### t Type

`object` ([Test](certificate-properties-certificate-section-properties-test.md))

## id

Section identifying the identity document to which this certificate relates.


> The certificate holder should present the id document in order to prove ownership of the certificate
>

`id`

-   is required
-   Type: `object` ([Identification](certificate-properties-certificate-section-properties-identification.md))
-   cannot be null
-   defined in: [Passport Document](certificate-properties-certificate-section-properties-identification.md "https&#x3A;//cov-clear.com/certificate.schema.json#/properties/ct/properties/id")

### id Type

`object` ([Identification](certificate-properties-certificate-section-properties-identification.md))

## auth

Section containing details of the testing authority that performed the test and thus issued the certificate.


`auth`

-   is required
-   Type: `object` ([Authority](certificate-properties-certificate-section-properties-authority.md))
-   cannot be null
-   defined in: [Passport Document](certificate-properties-certificate-section-properties-authority.md "https&#x3A;//cov-clear.com/certificate.schema.json#/properties/ct/properties/auth")

### auth Type

`object` ([Authority](certificate-properties-certificate-section-properties-authority.md))
