# App manager

- [ ] Make an app to initialize the other apps
    - [ ] Find open ports and send them to the apps
        - [ ] Set 'PORT' env variable to their designated one
        - [ ] Start the other apps
        - [ ] Apps initialize on these ports

- [ ] By default check ~/Repositories/Javascript

To look for apps.

- [ ] Have a package so that other apps can insert their pid in the database
    - [x] 'pid-discovery' that only works for node
    
    Compilation incompatibility
    It doesn't work for nextjs because I can't get the path via '__dirname'
    But if isolated into a new package it would work

- [x] Start app at startup
- [ ] App option that prevents them from running twice
Check if 'pid' of the same app on the db is not null.

- [x] Remove previous apps output on restart
