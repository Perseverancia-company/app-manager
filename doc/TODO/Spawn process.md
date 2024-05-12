# Spawn process

Things I need to verify.

- [ ] Spawn a server
- [ ] Use shell pid to detect child processes
- [ ] Check if the server is in the child processes of the shell

## Observations

- 'runComplexCommand' is run multiple times, I don't know why
- Command pid is undefined

On those multiple executions, the command pid exists only at last
