HTMLElement.prototype.hasClass = function (className) {
    if (this.classList) {
        return this.classList.contains(className);
    } else {
        return (-1 < this.className.indexOf(className));
    }
};

HTMLElement.prototype.addClass = function (className) {
    if (this.classList) {
        this.classList.add(className);
    } else if (!this.hasClass(className)) {
        var classes = this.className.split(" ");
        classes.push(className);
        this.className = classes.join(" ");
    }
    return this;
};

HTMLElement.prototype.removeClass = function (className) {
    if (this.classList) {
        this.classList.remove(className);
    } else {
        var classes = this.className.split(" ");
        classes.splice(classes.indexOf(className), 1);
        this.className = classes.join(" ");
    }
    return this;
};
HTMLElement.prototype.attr = function (attribute, value) {
    this.setAttribute(attribute, value);
    return this;
};
Object.prototype.hasAttibute = function(attribute) {
    return typeof this[attribute] !== "undefined";
};

function createPlexRedirect() {
    window.plexRedirect = new PlexRedirect();
    window.plexRedirect.startPlexRedirect();
}

var PlexRedirect = function() {
    this.server_status = {
        UP: 1,
        DOWN: 2
    };

    this.default_messages = {
        server_up: "Up and reachable",
        server_down: "Down and unreachable"
    };
    this.default_config = {
        server: {
            name: "",
            brand_url: "",
            domain: "",
            port: ""
        },
        messages: {
            server_up: "Up and reachable",
            server_down: "Down and unreachable"
        }
    };
    this.app_configs = {
        PlexWeb: {
            url: 'http://app.plex.tv/web/app',
            image: 'assets/img/plex.png',
            header: 'Access <span class="server-name">SERVER</span>',
            description: 'Access the <span class="server-name">SERVER</span> library with over <span class="server-movies">1000</span> Movies & <span class="server-tv">500</span> TV Shows available instantly.'
        },
        PlexRequests: {
            url: document.domain + ':3000',
            image: 'assets/img/plexrequests.png',
            header: 'Requests',
            description: 'Want to watch a Movie or TV Show but it\'s not currently on <span class="server-name">SERVER</span>? Use PlexRequests to request it!'
        },
        Ombi: {
            url: document.domain + ':3579',
            image: 'assets/img/ombi.png',
            header: 'Requests',
            description: 'Want to watch a Movie or TV Show but it\'s not currently on <span class="server-name">SERVER</span>? Use Ombi to request it!'
        },
        PlexEmail: {
            url: document.domain + '#PLEXEMAIL_LINK_HERE',
            image: 'assets/img/plexemail.png',
            header: 'What\'s New',
            description: 'See what has been recently added to <span class="server-name">SERVER</span> without having to log in.'
        },
        PlexPy: {
            url: document.domain + ':8181',
            image: 'assets/img/plexpy.png',
            header: 'Server stats',
            description: 'Want to know what\'s going on at <span class="server-name">SERVER</span> or just interested in the most viewed movie? View it here!'
        },
        Sonarr: {
            url: document.domain + ':8989',
            image: 'assets/img/sonarr.png',
            header: 'Series watchlist',
            description: 'View the list of series that currently being monitored.'
        },
        Radarr: {
            url: document.domain + ':7878',
            image: 'assets/img/radarr.png',
            header: 'Movies watchlist',
            description: 'View the list of movies that currently being monitored.'
        }
    };
    this.default_applications = [
        {
            PlexWeb: {},
            PlexRequests: {},
            Ombi: {},
            PlexEmail: {}
        },
        {
            PlexPy: {},
            Sonarr: {},
            Radarr: {}
        }
    ];

    var linkBarElement = document.getElementById('link-bar');
    this.linkBarRow = linkBarElement.querySelector('.row');
};
PlexRedirect.prototype = {
    startPlexRedirect: function() {
        this.loadConfig('config.json');
    },
    configLoaded: function(config) {
        this.config = config;
        this.setSiteSettings();
    },
    configLoadFailed: function() {
        this.config = this.default_config;
        console.error('Failed to load config, using the default one');
        this.setSiteSettings();
    },
    setSiteSettings: function() {
        this.createLinkBar();

        var navbarBrand = document.getElementById('navbar-brand');
        var serverConfig = this.config.server;
        if(serverConfig.brand_url !== "") {
            navbarBrand.href = serverConfig.brand_url;
        }
        if(serverConfig.name !== "") {
            navbarBrand.innerText = serverConfig.name;
            var title = document.getElementById('title');
            title.innerText = 'PlexRequest - ' + serverConfig.name + " status";
            var serverNames = document.getElementsByClassName("server-name");
            for(var i = 0; i < serverNames.length; i++) {
                serverNames[i].innerText = serverConfig.name;
            }
        }
        if(typeof this.config.messages === "undefined") {
            this.config.messages = this.default_messages;
        }

        this.checkServer();
    },
    createLinkBar: function () {
        if(typeof this.config.applications === "undefined") {
            this.config.applications = [];
        }

        this.numberOfApplications = this.config.applications.length;
        if(this.numberOfApplications == 0) {
            this.config.applications = this.default_applications;
            this.numberOfApplications = this.config.applications.length;
        }

        for(var row in this.config.applications) {
            if (!this.config.applications.hasOwnProperty(row)) continue;

            this.createApplicationRow(row);
        }
    },
    createApplicationRow: function(currentRow) {
        var rowDiv = document.createElement('div').addClass('row');

        var numberOfApplications = Object.keys(this.config.applications[currentRow]).length;

        var columnWidht = Math.floor(12 / numberOfApplications);
        var offset = Math.floor((12 % numberOfApplications) / 2);
        if(offset == 0) {
            offset = false;
        }

        for(var key in this.config.applications[currentRow]) {
            if (!this.config.applications[currentRow].hasOwnProperty(key)) continue;

            var element = this.createApplicationElement(currentRow, key, columnWidht, offset);
            rowDiv.appendChild(element);

            offset = false;
        }
        this.linkBarRow.appendChild(rowDiv);
    },
    createApplicationElement: function(row, key, columnWidht, offset) {
        var currentApplication = this.config.applications[row][key];
        console.log(currentApplication);

        var div = document.createElement('div').addClass('col-lg-' + columnWidht);
        if(offset) {
            div.addClass('col-lg-offset-' + offset);
        }
        var link = document.createElement('a')
            .attr('href', currentApplication.hasAttibute('url') ? currentApplication.url : this.app_configs[key].url)
            .attr('target', '_top');
        var image = document.createElement('img')
            .attr('src', currentApplication.hasAttibute('image') ? currentApplication.image : this.app_configs[key].image)
            .attr('width', '180');
        var header = document.createElement('h4');
        header.innerHTML = currentApplication.hasAttibute('header') ? currentApplication.header : this.app_configs[key].header;

        var description = document.createElement('p');
        description.innerHTML = currentApplication.hasAttibute('description') ? currentApplication.description : this.app_configs[key].description;

        link.appendChild(image);
        link.appendChild(header);
        link.appendChild(description);

        div.appendChild(link);
        return div;
    },
    checkServer: function() {
        var p = new Ping();
        var server = this.config.server.plex_domain == "" ? document.domain : this.config.server.plex_domain; //Try to get it automagically, but you can manually specify this
        var port = this.config.server.plex_port == "" ? "32400" : this.config.server.plex_port;
        var timeout = 2000; //Milliseconds
        var body = document.getElementsByTagName("body")[0];
        var _this = this;
        p.ping(server + ":" + port, function(data) {
            if (data < 1000){
                _this.setServerMessage(_this.server_status.UP, _this.config.messages.server_up);
            }else{
                _this.setServerMessage(_this.server_status.DOWN, _this.config.messages.server_down);
            }
        }, timeout);
    },
    setServerMessage: function(status, message) {
        var body = document.getElementsByTagName("body")[0];
        var serverMsg = document.getElementById( "server-status-msg" );
        var serverImg = document.getElementById( "server-status-img" );

        serverMsg.innerHTML = message;
        if(status == this.server_status.UP) {
            serverImg.src = "assets/img/ipad-hand-on.png";
            body.addClass('online').removeClass("offline");
        }
        else if(status == this.server_status.DOWN) {
            serverImg.src = "assets/img/ipad-hand-off.png";
        }
    },
    loadConfig: function(path, success, error) {
        var xhr = new XMLHttpRequest();
        var _this = this;
        xhr.onreadystatechange = function()
        {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    _this.configLoaded(JSON.parse(xhr.responseText));
                } else {
                    _this.configLoadFailed(xhr);
                }
            }
        };
        xhr.open("GET", path + "?" + (+new Date()), true);
        xhr.send();
    }
};
