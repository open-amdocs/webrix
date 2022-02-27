# Contributing to Webrix

Webrix is one of Amdocs' first open-source project, and it is actively used by one of Amdocs'
largest projects. The purpose of this document is to make contributing easy and clear.

If you are new to the concept of code contribution in open-source projects, 
you can learn how from this free video series: 

[How to Contribute to an Open Source Project on GitHub](https://egghead.io/courses/how-to-contribute-to-an-open-source-project-on-github)

## Submitting a Pull Request

We welcome PRs, and we greatly appreciate any contribution to our project.
However, before submitting a pull request it's best to open an issue and discuss it with
the core team.

Keep your PRs small and concise, and focus on a single issue/feature. Large PRs are harder to review
and will take longer to approve, or will not be approved until they are split into smaller PRs.

Below are the steps to create a pull request:

1. Fork the repository.
2. Clone the fork to your local machine and add upstream remote:
```
git clone git@github.com:<your_username>/webrix.git
cd webrix
git remote add upstream git@github.com:open-amdocs/webrix.git
```
3. Synchronize your local master branch with the upstream one:
```
git checkout master
git pull upstream master
```
4. Install the dependencies:
```
npm i
```
5. Create a new topic branch:
```
git checkout -b my-topic-branch
```
6. Make changes, commit and push to your fork:
```
git push -u
```
Go to [the repository](https://github.com/open-amdocs/webrix) and make a Pull Request.

## Proxy Settings

If you are behind a corporate proxy, you should run these commands before cloning/installing:

```
git config --global http.proxy <proxy_url>
npm config set proxy <proxy_url>
npm config set https-proxy <proxy_url>
```

For installing dependencies, create a `.npmrc` file with the following:

```
proxy=<proxy_url>
https-proxy=<proxy_url>
```

## Settings for Amdocs Employees

Since we use git for our internal projects with a work email/password, you may face issues login into GitHub with your personal username/password.
The best way to avoid it is to create a personal access token:

1. [Create a personal access token](https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token)
2. Clone the repo
3. When prompted for a username, use the access token you generated in step 1. Leave the password blank.

