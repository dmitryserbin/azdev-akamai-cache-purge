# Akamai Cache Purge

- [Overview](#overview)
- [Features](#features)
- [How to use](#how-to-use)
- [Service connection](#service-connection)
- [Support](#support)
- [References](#references)

## Overview

> NOTE: This extension is currently in **public preview**. Please bear in mind that some of the task parameters or extension behavior may suddenly change (this might include **breaking changes**).

This extension adds [Akamai Cache Purge](https://marketplace.visualstudio.com/items?itemName=dmitryserbin.akamai-cache-purge) task to Azure DevOps pipelines to purge content cache at the Akamai Edge using [Fast Purge API](https://techdocs.akamai.com/purge-cache/reference/api). The extension can either [purge content by URL](https://techdocs.akamai.com/purge-cache/docs/purge-content-url) or [purge content by CP Code](https://techdocs.akamai.com/purge-cache/docs/purge-content-cp-code) approach with `invalidate` or `delete` request method

Extension | Build | Code
:-------|:-------|:-------
[![Extension](https://vsmarketplacebadge.apphb.com/version/dmitryserbin.akamai-cache-purge.svg)](https://marketplace.visualstudio.com/items?itemName=dmitryserbin.akamai-cache-purge) | [![Build](https://dev.azure.com/dmitryserbin/Akamai/_apis/build/status/Purge-release?branchName=master)](https://dev.azure.com/dmitryserbin/Akamai/_build/latest?definitionId=18&branchName=master) | [![CodeFactor](https://www.codefactor.io/repository/github/dmitryserbin/azdev-akamai-cache-purge/badge?s=a39b3ca149c6c1539b9dcd772328214fbdefc6dd)](https://www.codefactor.io/repository/github/dmitryserbin/azdev-akamai-cache-purge)

## Features

- Service connection for Akamai EdgeGrid
- Target staging or production Akamai network
- Purge URLs cache using `invalidate` or `delete` method
- Purge CP Codes cache using `invalidate` or `delete` method
- Wait for purge request activation

## How to use

1. Add `Akamai Cache Purge` task to your release pipeline
1. Select `Akamai EdgeGrid endpoint` (create if does not exist)
1. Select target Akamai network
1. Specify either target URLs or CP Codes to purge cache
1. Specify either `invalidate` or `delete` for the purge method

Make sure all the URLs you provide meet these requirements (as per Akamai [documentation](https://techdocs.akamai.com/purge-cache/docs/purge-content-url)):

- Hostnames must be mapped to ​Akamai​ in the DNS CNAME record
- URLs must be full, not partial
- URLs don't include any wild cards
- URLs must contain a protocol — either `http://` or `https://`
- A list of URLs cannot exceed 50,000 characters.
- To successfully purge a URL, you must have permissions to purge content associated with that
URL's CP code.

**Note**: When purging CP Codes, mind the origin overload. Objects are fetched from your origin server, so avoid purging all objects for a CP code as this can increase load on your origin server. Also, your CP code selection cannot exceed 100.

> Template: example task configuration purging URLs with Invalidate method

```yaml
- task: akamaicachepurge@1
  displayName: Akamai Cache Purge
  inputs:
    edgegridEndpoint: My-Endpoint # Required
    network: My-Network           # Options: staging, production
    purgeType: url                # Optional. Options: url (default), cpcode
    # purgeMethod: Invalidate     # Optional. Options: invalidate (default), delete
    urls: |                       # Required when purgeType: url
      https://my.domain/one
      https://my.domain/two
    wait: false                   # Options: true, false
```

> Template: example task configuration purging CP Codes with Invalidate method

```yaml
- task: akamaicachepurge@1
  displayName: Akamai Cache Purge
  inputs:
    edgegridEndpoint: My-Endpoint # Required
    network: My-Network           # Options: staging, production
    purgeType: cpcode             # Optional. Options: url (default), cpcode
    # purgeMethod: Invalidate     # Optional. Options: invalidate (default), delete
    cpCodes: |                    # Required when purgeType: cpcode
      123456
      789123
    wait: false                   # Options: true, false
```

## Service connection

In order to use the extension you may need to create a new [service connection](https://docs.microsoft.com/en-us/azure/devops/pipelines/library/service-endpoints) for Akamai EdgeGrid.

To create new service connection, go to `Project settings` > `Service connections` and select `Create new connection` then choose `Akamai EdgeGrid` service connection type and fill-in your user access details.

You will need to [create credentials](https://developer.akamai.com/api/getting-started) for authentication with EdgeGrid through [Akamai Control Center](https://control.akamai.com).

- Connection URL: `https://myhost.purge.akamaiapis.net`
- Client secret: `My-Client-Secret`
- Client token: `My-Client-Token`
- Access token: `My-Access-Token`

## Support

For additional information and support please refer to [project repository](https://github.com/dmitryserbin/azdev-akamai-cache-purge). To enable debug mode to help troubleshooting issues, please configure `DEBUG=akamaicachepurge:*` custom release [variable](https://docs.microsoft.com/en-us/azure/devops/pipelines/release/variables).

For help with Azure DevOps and release pipelines please refer to [official documentation](https://docs.microsoft.com/en-us/azure/devops).

## References

- [Changelog](CHANGELOG.md)
- [Privacy policy](PRIVACY.md)
- [License](LICENSE)
