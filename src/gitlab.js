var RestClient = require('node.restful.client'),
    nodeUtil = require('util'),
    api = require('./api.json');

var Gitlab = function(config) {
    this.constructor.super_.call(this, {
        api: config.api || 'https://gitlab.com/api/v3',
        beforeRequest: function(params) {
            params.data = params.data || {};
            params.data.private_token = config.private_token;
            return params;
        },
        afterRequest: function(data, res) {
            try {
                if (typeof data === 'string') {
                    data = JSON.parse(data);
                }
            } catch (e) {}
            return [data, res];
        }
    });
};

var deepRegister = function(target, obj){
    for (var k in obj) {
        if (obj.hasOwnProperty(k) && k !== '$path') {
            deepRegister(target.register(obj[k].$path, k), obj[k]);
        }
    }
};

nodeUtil.inherits(Gitlab, RestClient);

module.exports.create = function(config) {
    var gitlab = new Gitlab(config);

    //deepRegister(gitlab, api);
    gitlab.registerAll(api);

    return gitlab;
};