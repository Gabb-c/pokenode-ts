# Contributing to Pokenode-ts

1. [Fork](https://help.github.com/articles/fork-a-repo/) this repository to your own GitHub account and then [clone](https://help.github.com/articles/cloning-a-repository/) it to your local device.
2. Create a new branch: `git checkout -b MY_BRANCH_NAME`
3. Install yarn: `npm install -g yarn`
4. Install the dependencies: `yarn`
5. Run `yarn build:ci` to build and generate typings
6. The development branch is `dev` (this is the branch pull requests should be made against). On a release, the relevant parts of the changes in the `dev` branch are rebased into `master`, tested, and then rebased to `stable`.

> Check out our [Pull Request Template](https://github.com/Gabb-c/pokenode-ts/blob/master/.github/pull_request_template.md).
