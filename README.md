# Bar Code API

This is the Bar Code API, which is responsible to read digitable line from a bank slip.

Overview:
- [Prerequisites](#prerequisites)
- [How to run](#how-to-run)
- [Scripts](#scripts)
- [Folder structure](#folder-structure)

---
## Prerequisites

- docker 20.10^
- docker-compose 3.6^

---
## How to run

init api
```sh
./scripts/development.sh
```

---
## Scripts

run tests
```sh
./scripts/test.sh
```

install a dependency, exemple
```sh
./scripts/install.dep.sh "yarn add express"
```
---
## Folder structure

### src/infra
Contains code that encapsulates third-party libs and tools.

### src/routes
Contains the structure of the routes, important is that this layer knows the http rules.

### src/services

Contains services that deal with the application's business rule.

**IMPORTANT**: This layer must not know http rules.

### tests
Contains the code base of tests

### scripts
Automation and axillary scripts

# WIP (technical debts)

- Implement features to accept agreement slips, at the moment we only know how to deal with slips
- Do not account for the maturity factor when the amount of the acorn is greater than R$ 99,999,999.99