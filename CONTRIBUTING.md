# Contributing to Integreedy

First off, thank you for considering contributing to Integreedy! It's people like you that make the open source community such a great place.

## Where do I go from here?

If you've noticed a bug or have a feature request, [make one](https://github.com/your-repo/integreedy/issues/new)! It's generally best if you get confirmation of your bug or approval for your feature request this way before starting to code.

### Fork & create a branch

If this is something you think you can fix, then [fork Integreedy](https://github.com/your-repo/integreedy/fork) and create a branch with a descriptive name.

A good branch name would be (where issue #123 is the ticket you're working on):

```sh
git checkout -b 123-add-a-gnome-under-your-hat
```

### Get the style right

Your patch should follow the same conventions & pass the same code quality checks as the rest of the project.

### Make a Pull Request

At this point, you should switch back to your master branch and make sure it's up to date with Integreedy's master branch:

```sh
git remote add upstream git@github.com:your-repo/integreedy.git
git checkout master
git pull upstream master
```

Then update your feature branch from your local copy of master, and push it!

```sh
git checkout 123-add-a-gnome-under-your-hat
git rebase master
git push --force-with-lease origin 123-add-a-gnome-under-your-hat
```

Finally, go to GitHub and [make a Pull Request](https://github.com/your-repo/integreedy/compare/master...123-add-a-gnome-under-your-hat)

### Keeping your Pull Request updated

If a maintainer asks you to "rebase" your PR, they're saying that a lot of code has changed, and that you need to update your branch so it's easier to merge.

To learn more about rebasing and merge conflicts, check out this guide on [how to rebase a pull request](https://github.com/edx/edx-platform/wiki/How-to-Rebase-a-Pull-Request).

We're happy to help you with this if you're not comfortable with it. 
