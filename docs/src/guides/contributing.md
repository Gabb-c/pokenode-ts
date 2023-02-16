---
sidebar_position: 1
---

# Contributing to Pokenode-ts

## Development Setup

1. [Fork](https://help.github.com/articles/fork-a-repo/) this repository to your own GitHub account and then [clone](https://help.github.com/articles/cloning-a-repository/) it to your local device.
2. Create a new branch `git checkout -b MY_BRANCH_NAME`
3. [Install pnpm](https://pnpm.io/pt/installation)
4. Install the dependencies `pnpm i`
5. The development branch is `dev` (this is the branch pull requests should be made against). On a release, the relevant parts of the changes in the `dev` branch are rebased into `master`, tested, and then rebased to `stable`.

:::tip
Check out our:

- [Code of Conduct](https://github.com/Gabb-c/pokenode-ts/blob/master/.github/CODE_OF_CONDUCT.md)
- [Pull Request Template](https://github.com/Gabb-c/pokenode-ts/blob/master/.github/pull_request_template.md)
- [Bug Report Template](https://github.com/Gabb-c/pokenode-ts/blob/master/.github/ISSUE_TEMPLATE/bug_report.yml)
- [Feature Request Template](https://github.com/Gabb-c/pokenode-ts/blob/master/.github/ISSUE_TEMPLATE/bug_report.yml)
  :::

## Testing PokéAPI Endpoints

If you want to test the PokéAPI endpoints, we recommend using [Insomnia](https://insomnia.rest/):

<div>
  <a href="https://insomnia.rest/run/?label=Pok%C3%A9API&uri=https%3A%2F%2Fraw.githubusercontent.com%2FGabb-c%2Fpokeapi-insomnia-collection%2Fmain%2Fpokeapi.json">
    <img alt="Run in Insomnia" src="https://img.shields.io/badge/Insomnia-5849be?style=for-the-badge&logo=Insomnia&logoColor=white&label=Run%20in&labelColor=black"/>
  </a>
</div>

## Leave your feedback

- Did you like pokenode-ts? [Give us a star ⭐](https://github.com/Gabb-c/pokenode-ts)
- Found a problem? Let us know by [creating an issue 🔎📑](https://github.com/Gabb-c/pokenode-ts/issues)
- Want to contribute? [Submit a PR](https://github.com/Gabb-c/pokenode-ts/pulls)
