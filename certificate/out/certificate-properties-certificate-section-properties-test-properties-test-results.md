# Test Results Schema

```txt
https://cov-clear.com/certificate.schema.json#/properties/ct/properties/t/properties/res
```

Detailed results of the mdeical test.


> Note that this schema only includes results for a standard lateral flow rapid diagnostic test (RDT). 
>

| Abstract            | Extensible | Status         | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                  |
| :------------------ | ---------- | -------------- | ------------ | :---------------- | --------------------- | ------------------- | --------------------------------------------------------------------------- |
| Can be instantiated | No         | Unknown status | No           | Forbidden         | Allowed               | none                | [certificate.schema.json\*](certificate.schema.json "open original schema") |

## res Type

`object` ([Test Results](certificate-properties-certificate-section-properties-test-properties-test-results.md))

# Test Results Properties

| Property    | Type      | Required | Nullable       | Defined by                                                                                                                                                                                                                                         |
| :---------- | --------- | -------- | -------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [c](#c)     | `boolean` | Required | cannot be null | [Passport Document](certificate-properties-certificate-section-properties-test-properties-test-results-properties-control-reading.md "https&#x3A;//cov-clear.com/certificate.schema.json#/properties/ct/properties/t/properties/res/properties/c") |
| [igg](#igg) | `boolean` | Required | cannot be null | [Passport Document](certificate-properties-certificate-section-properties-test-properties-test-results-properties-igg-reading.md "https&#x3A;//cov-clear.com/certificate.schema.json#/properties/ct/properties/t/properties/res/properties/igg")   |
| [igm](#igm) | `boolean` | Required | cannot be null | [Passport Document](certificate-properties-certificate-section-properties-test-properties-test-results-properties-igm-reading.md "https&#x3A;//cov-clear.com/certificate.schema.json#/properties/ct/properties/t/properties/res/properties/igm")   |

## c

Output of the RDT's control line.


`c`

-   is required
-   Type: `boolean` ([Control Reading](certificate-properties-certificate-section-properties-test-properties-test-results-properties-control-reading.md))
-   cannot be null
-   defined in: [Passport Document](certificate-properties-certificate-section-properties-test-properties-test-results-properties-control-reading.md "https&#x3A;//cov-clear.com/certificate.schema.json#/properties/ct/properties/t/properties/res/properties/c")

### c Type

`boolean` ([Control Reading](certificate-properties-certificate-section-properties-test-properties-test-results-properties-control-reading.md))

## igg

Output of the RDT's IgG antibody line.


`igg`

-   is required
-   Type: `boolean` ([IgG Reading](certificate-properties-certificate-section-properties-test-properties-test-results-properties-igg-reading.md))
-   cannot be null
-   defined in: [Passport Document](certificate-properties-certificate-section-properties-test-properties-test-results-properties-igg-reading.md "https&#x3A;//cov-clear.com/certificate.schema.json#/properties/ct/properties/t/properties/res/properties/igg")

### igg Type

`boolean` ([IgG Reading](certificate-properties-certificate-section-properties-test-properties-test-results-properties-igg-reading.md))

## igm

Output of the RDT's IgM antibody line.


`igm`

-   is required
-   Type: `boolean` ([IgM Reading](certificate-properties-certificate-section-properties-test-properties-test-results-properties-igm-reading.md))
-   cannot be null
-   defined in: [Passport Document](certificate-properties-certificate-section-properties-test-properties-test-results-properties-igm-reading.md "https&#x3A;//cov-clear.com/certificate.schema.json#/properties/ct/properties/t/properties/res/properties/igm")

### igm Type

`boolean` ([IgM Reading](certificate-properties-certificate-section-properties-test-properties-test-results-properties-igm-reading.md))
