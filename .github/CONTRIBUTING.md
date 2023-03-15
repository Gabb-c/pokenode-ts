# Contributing to Pokenode-ts

## Setup Environment
> You must have Node.js installed (lts version recommended)

1. [Fork](https://help.github.com/articles/fork-a-repo/) this repository to your own GitHub account and then [clone](https://help.github.com/articles/cloning-a-repository/) it to your local device.
2. Create a new branch `git checkout -b MY_BRANCH_NAME`
3. Install [pnpm](https://pnpm.io/installation)
4. Install the dependencies `pnpm i`
5. The development branch is `dev` (this is the branch pull requests should be made against). On a release, the relevant parts of the changes in the `dev` branch are rebased into `master`, tested, and then rebased to `stable`.
