# @qiwi/git-sync
Git helper to fetch & push dirs. For everything else there is [nodegit](https://github.com/nodegit/nodegit).

## Usage
### JS API
```javascript
import { gitSync } from '@qiwi/git-sync'

// Upload
await gitSync({
  action: 'push',
  from: './docs',
  to: './',
  brach: 'gh-pages',
  url: 'https://https://github.com/some/repo.git',
  env: {
    GIT_TOKEN: 'token'
  }
})

// Download
await gitSync({
  action: 'fetch',
  url: 'https://https://github.com/some/repo.git',
  brach: 'gh-pages',
  from: './',
  to: './docs',
  env: {
    GIT_TOKEN: 'token'
  }
})
```

### CLI
**Fetch** from remote to local:
```shell
GIT_TOKEN='token' gitsync --url='https://https://github.com/some/repo.git' --action='fetch' --from='./' --to='./docs' --branch='gh-pages'
```
the same via ssh:
```shell
GIT_SSH_COMMAND='ssh -i private_key_file -o IdentitiesOnly=yes' gitsync --url='git@github.com:some/repo.git' --action='fetch' --from='./' --to='./docs'
```

**Push** local dir to remote:
```shell
GIT_TOKEN='token' gitsync --action='push' --from='./docs' --to='./' --branch='gh-pages'
```

## License
[MIT](./../../LICENSE)
