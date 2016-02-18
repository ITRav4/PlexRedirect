# PlexRedirect
a Plex landing page that redirects you to various sites.

# Contributors:
EldonMcGuinness: Added ping.js to the code so the website now automatically checks the server status.

lienma: Fixed Google fonts so it now chooses between https and http


# Features:
Link to Plex.tv

Link to PlexRequests (https://github.com/lokenx/plexrequests-meteor)

Link to PlexEmail (https://github.com/jakewaldron/PlexEmail)

Shows Plex status (online or offline) (https://github.com/alfg/ping.js)

# Installing:
Add this to your webserver root folder. You can rename it to your server name if you would like. Access it via your IP address.

# Editing:
You can edit the index.html to your liking and add your server name and links. You can also change the "document.domain" and port if it doesn't get it automatically. That way it can check the server status and update the page accordingly.

# How I installed it:
The way I have it set up is forwarded my domain with masking to my public IP address and port. Ex: www.example.com points to x.x.x.x:xxxx/PlexRedirect. I then have a subdomain for PlexRequests (requests.example.com) which then forwards it to my public IP address and port x.x.x.x:1001 with masking. I did the same for the PlexEmail site (right now it takes you to a "Coming Soon" website since I haven't set up PlexEmail yet.) Clicking on the "Access Server," "Request," and "What's New" redirects you to those addresses.
