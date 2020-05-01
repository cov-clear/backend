# Identification Schema

```txt
https://cov-clear.com/certificate.schema.json#/properties/ct/properties/id
```

Section identifying the identity document to which this certificate relates.


> The certificate holder should present the id document in order to prove ownership of the certificate
>

| Abstract            | Extensible | Status         | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                  |
| :------------------ | ---------- | -------------- | ------------ | :---------------- | --------------------- | ------------------- | --------------------------------------------------------------------------- |
| Can be instantiated | No         | Unknown status | No           | Forbidden         | Allowed               | none                | [certificate.schema.json\*](certificate.schema.json "open original schema") |

## id Type

`object` ([Identification](certificate-properties-certificate-section-properties-identification.md))

# Identification Properties

| Property      | Type     | Required | Nullable       | Defined by                                                                                                                                                                                                               |
| :------------ | -------- | -------- | -------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [loc](#loc)   | `string` | Required | cannot be null | [Passport Document](certificate-properties-certificate-section-properties-identification-properties-document-locale.md "https&#x3A;//cov-clear.com/certificate.schema.json#/properties/ct/properties/id/properties/loc") |
| [type](#type) | `string` | Required | cannot be null | [Passport Document](certificate-properties-certificate-section-properties-identification-properties-document-type.md "https&#x3A;//cov-clear.com/certificate.schema.json#/properties/ct/properties/id/properties/type")  |
| [id](#id)     | `string` | Required | cannot be null | [Passport Document](certificate-properties-certificate-section-properties-identification-properties-document-id.md "https&#x3A;//cov-clear.com/certificate.schema.json#/properties/ct/properties/id/properties/id")      |

## loc

An ISO-3166 country code representing the locale for which this identity document is valid.


`loc`

-   is required
-   Type: `string` ([Document Locale](certificate-properties-certificate-section-properties-identification-properties-document-locale.md))
-   cannot be null
-   defined in: [Passport Document](certificate-properties-certificate-section-properties-identification-properties-document-locale.md "https&#x3A;//cov-clear.com/certificate.schema.json#/properties/ct/properties/id/properties/loc")

### loc Type

`string` ([Document Locale](certificate-properties-certificate-section-properties-identification-properties-document-locale.md))

### loc Examples

```json
"GB"
```

```json
"EE"
```

```json
"US"
```

## type

Type of identity document.


`type`

-   is required
-   Type: `string` ([Document Type](certificate-properties-certificate-section-properties-identification-properties-document-type.md))
-   cannot be null
-   defined in: [Passport Document](certificate-properties-certificate-section-properties-identification-properties-document-type.md "https&#x3A;//cov-clear.com/certificate.schema.json#/properties/ct/properties/id/properties/type")

### type Type

`string` ([Document Type](certificate-properties-certificate-section-properties-identification-properties-document-type.md))

### type Examples

```json
"Passport"
```

```json
"Driving License"
```

```json
"National Identity Card"
```

## id

Identifier for the document.


`id`

-   is required
-   Type: `string` ([Document ID](certificate-properties-certificate-section-properties-identification-properties-document-id.md))
-   cannot be null
-   defined in: [Passport Document](certificate-properties-certificate-section-properties-identification-properties-document-id.md "https&#x3A;//cov-clear.com/certificate.schema.json#/properties/ct/properties/id/properties/id")

### id Type

`string` ([Document ID](certificate-properties-certificate-section-properties-identification-properties-document-id.md))
