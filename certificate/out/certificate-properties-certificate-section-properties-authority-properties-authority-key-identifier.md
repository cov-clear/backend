# Authority Key Identifier Schema

```txt
https://cov-clear.com/certificate.schema.json#/properties/ct/properties/auth/properties/aki
```

ID for the public key corresponding to the private key with which this document was signed.


> This identifies the performer of the test, and acts as a quick way for a verifying application to identify the public key with which the signature can be verified
>

| Abstract            | Extensible | Status         | Identifiable            | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                  |
| :------------------ | ---------- | -------------- | ----------------------- | :---------------- | --------------------- | ------------------- | --------------------------------------------------------------------------- |
| Can be instantiated | No         | Unknown status | Unknown identifiability | Forbidden         | Allowed               | none                | [certificate.schema.json\*](certificate.schema.json "open original schema") |

## aki Type

`string` ([Authority Key Identifier](certificate-properties-certificate-section-properties-authority-properties-authority-key-identifier.md))
