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
    this.default_applications = {
        PlexWeb: {
            url: 'http://app.plex.tv/web/app',
            image: 'assets/img/s01.png',
            header: 'Access <span class="server-name">SERVER</span>',
            description: 'Access the <span class="server-name">SERVER</span> library with over X Movies & X TV Shows available instantly.'
        },
        PlexRequests: {
            url: '#PLEXREQUESTS_LINK_HERE',
            image: 'assets/img/s02.png',
            header: 'Request',
            description: 'Want to watch a Movie or TV Show but it\'s not currently on <span class="server-name">SERVER</span>? Request it here!'
        },
        PlexEmail: {
            url: '#PLEXEMAIL_LINK_HERE',
            image: 'assets/img/s03.png',
            header: 'What\'s New',
            description: 'See what has been recently added to <span class="server-name">SERVER</span> without having to log in.'
        }
    };

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
    isset: function(param) {
        return (typeof param !== "undefined" && param !== "");
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

        this.checkServer();
    },
    createLinkBar: function () {
        this.numberOfApplications = Object.keys(this.config.applications).length;
        if(this.numberOfApplications == 0) {
            this.config.applications = this.default_applications;
            this.numberOfApplications = Object.keys(this.config.applications).length;
        }

        for(var key in this.config.applications) {
            if (!this.config.applications.hasOwnProperty(key)) continue;

            this.createApplicationElement(this.config.applications[key], key);
        }
    },
    createApplicationElement: function(currentApplication, key) {
        var div = document.createElement('div').addClass(this.getApplicationColumnWidth());
        var link = document.createElement('a')
            .attr('href', currentApplication.hasAttibute('url') ? currentApplication.url : this.default_applications[key].url)
            .attr('target', '_top');
        var image = document.createElement('img')
            .attr('src', currentApplication.hasAttibute('image') ? currentApplication.image : this.default_applications[key].image)
            .attr('width', '180');
        var header = document.createElement('h4');
        header.innerHTML = currentApplication.hasAttibute('header') ? currentApplication.header : this.default_applications[key].header;

        var description = document.createElement('p');
        description.innerHTML = currentApplication.hasAttibute('description') ? currentApplication.description : this.default_applications[key].description;

        link.appendChild(image);
        link.appendChild(header);
        link.appendChild(description);

        div.appendChild(link);
        this.linkBarRow.appendChild(div);
    },
    getApplicationColumnWidth: function() {
        if(this.numberOfApplications <= 4) {
            return 'col-lg-' + (12 / this.numberOfApplications);
        }

        return 'col-lg-4';
    },
    checkServer: function() {
        var p = new Ping();
        var server = this.config.server.domain == "" ? document.domain : this.config.server.domain; //Try to get it automagically, but you can manually specify this
        var timeout = 2000; //Milliseconds
        var body = document.getElementsByTagName("body")[0];
        var _this = this;
        p.ping(server+":32400", function(data) {
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
