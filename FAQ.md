DEVELOPMENT
  gulp frontend:bundle-vendors # repeat at any vendor change
  gulp                         # nodemon, watches, etc.
  bin/commit [--bin] [<git-commit-params>] -- git stash, gulp dist, git commit, git unstash
                                             -- to run tests against commit state, not working dir
  bin/push    -- bin/commit + git push

DEPLOYMENT
  bin/stage   -- bin/push, bin/remote/deploy
  bin/release -- bin/push, gulp release, bin/remote/deploy

NPM
  npm install               -- installs locally according to package.json
  npm install <package>

  npm install gulp -g       -- installs globally according to package.json
  npm install babel -g
  npm install bower -g
  npm install browserify -g
  npm install watchify -g

  npm outdated --depth 0
  npm outdated --depth 0 -g

  npm update <package> --save
  npm update <package> --save -g

  run fixes if needed:
  bin/fixes/<script>
