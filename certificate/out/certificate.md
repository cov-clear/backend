# Passport Document Schema

```txt
https://cov-clear.com/certificate.schema.json
```

A cryptographically signed document containing details of an individual (the holder)'s medical test results.


| Abstract            | Extensible | Status         | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                |
| :------------------ | ---------- | -------------- | ------------ | :---------------- | --------------------- | ------------------- | ------------------------------------------------------------------------- |
| Can be instantiated | No         | Unknown status | No           | Forbidden         | Allowed               | none                | [certificate.schema.json](certificate.schema.json "open original schema") |

## Passport Document Type

`object` ([Passport Document](certificate.md))

# Passport Document Properties

| Property    | Type     | Required | Nullable       | Defined by                                                                                                                             |
| :---------- | -------- | -------- | -------------- | :------------------------------------------------------------------------------------------------------------------------------------- |
| [ct](#ct)   | `object` | Required | cannot be null | [Passport Document](certificate-properties-certificate-section.md "https&#x3A;//cov-clear.com/certificate.schema.json#/properties/ct") |
| [sig](#sig) | `string` | Required | cannot be null | [Passport Document](certificate-properties-signature.md "https&#x3A;//cov-clear.com/certificate.schema.json#/properties/sig")          |

## ct

Section containing all of the data relating to the medical test, the holder, and the authority that issued the certificate.


`ct`

-   is required
-   Type: `object` ([Certificate Section](certificate-properties-certificate-section.md))
-   cannot be null
-   defined in: [Passport Document](certificate-properties-certificate-section.md "https&#x3A;//cov-clear.com/certificate.schema.json#/properties/ct")

### ct Type

`object` ([Certificate Section](certificate-properties-certificate-section.md))

## sig

A base64 encoded X-bit signature for the ct section created using the signing authority's private key.


> TODO(explain in more detail how to create certs etc).
>

`sig`

-   is required
-   Type: `string` ([Signature](certificate-properties-signature.md))
-   cannot be null
-   defined in: [Passport Document](certificate-properties-signature.md "https&#x3A;//cov-clear.com/certificate.schema.json#/properties/sig")

### sig Type

`string` ([Signature](certificate-properties-signature.md))
