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
