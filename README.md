# PlexRedirect
a Plex landing page that redirects you to various sites.
![alt tag](http://i.imgur.com/SbHEaLU.jpg)
Blank spaces are where your server name goes. If you don't have a server name you can replace it with whatever you want.

## Features:
* Link to [Plex.tv](plex.tv)
* Link to [PlexRequests](https://github.com/lokenx/plexrequests-meteor)
* Link to [PlexEmail](https://github.com/jakewaldron/PlexEmail)
* Shows Plex status (online or offline) using [ping.js](https://github.com/alfg/ping.js)

## Contributors:
[@EldonMcGuinness](https://github.com/EldonMcGuinness): Added ping.js to the code so the website now checks the server status automatically.

[@lienma](https://github.com/lienma): Fixed Google fonts so it now chooses between https and http.

[@HeroCC](https://github.com/HeroCC): There was a missing semicolon in the JS, added it to where it should be.

[@nagarjuna993](https://github.com/@nagarjuna993): Thanks for the puff img.

[TheDarocker](https://github.com/TheDarocker): Add a closing > and remove a few unneeded(?) HTML tags.

## Installing:
Add this to your webserver root folder. You can rename it to your server name if you would like. Access it via your IP address.

## Editing:
You can edit the index.html to your liking and add your server name and links. You can also change the "document.domain" and port if it doesn't get it automatically. That way it can check the server status and update the page accordingly.

## How I installed it:
The way I have it set up is forwarded my domain with masking to my public IP address and port. 

Ex: www.example.com points to x.x.x.x:xxxx/PlexRedirect. I then have a subdomain for PlexRequests (requests.example.com) which then forwards it to my public IP address and port x.x.x.x:3245 with masking. I did the same for the PlexEmail site (right now it takes you to a "Coming Soon" website since I haven't set up PlexEmail yet.) Clicking on the "Access Server," "Request," and "What's New" redirects you to those addresses.

## Want to help out?
Want to  make PlexRedirect better? Feel free to fork the repo and submit a pull request!

## Troubleshooting
I can't get ping to show my server online or offline!
* Check to see if you can semicolons where you changed "document.domain" to your IP address or to a DNS service. Something like "192.168.1.1" or "mydns.dnservice.com"

## License
Licensed under The MIT License. The Plex logo and name are copyright of Plex Inc.
