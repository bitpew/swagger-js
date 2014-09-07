// swagger-2.js
// version 2.0.37

/**
 * SwaggerAuthorizations applys the correct authorization to an operation being executed
 */
var SwaggerAuthorizations = function() {
  this.authz = {};
};

SwaggerAuthorizations.prototype.add = function(name, auth) {
  this.authz[name] = auth;
  return auth;
};

SwaggerAuthorizations.prototype.remove = function(name) {
  return delete this.authz[name];
};

SwaggerAuthorizations.prototype.apply = function(obj, authorizations) {
  var status = null;
  var key;

  // if the "authorizations" key is undefined, or has an empty array, add all keys
  if(typeof authorizations === 'undefined' || Object.keys(authorizations).length == 0) {
    for (key in this.authz) {
      value = this.authz[key];
      result = value.apply(obj, authorizations);
      if (result === true)
        status = true;
    }
  }
  else {
    for(name in authorizations) {
      for (key in this.authz) {
        if(key == name) {
          value = this.authz[key];
          result = value.apply(obj, authorizations);
          if (result === true)
            status = true;
        }
      }      
    }
  }

  return status;
};

/**
 * ApiKeyAuthorization allows a query param or header to be injected
 */
var ApiKeyAuthorization = function(name, value, type) {
  this.name = name;
  this.value = value;
  this.type = type;
};

ApiKeyAuthorization.prototype.apply = function(obj, authorizations) {
  if (this.type === "query") {
    if (obj.url.indexOf('?') > 0)
      obj.url = obj.url + "&" + this.name + "=" + this.value;
    else
      obj.url = obj.url + "?" + this.name + "=" + this.value;
    return true;
  } else if (this.type === "header") {
    obj.headers[this.name] = this.value;
    return true;
  }
};

var CookieAuthorization = function(cookie) {
  this.cookie = cookie;
}

CookieAuthorization.prototype.apply = function(obj, authorizations) {
  obj.cookieJar = obj.cookieJar || CookieJar();
  obj.cookieJar.setCookie(this.cookie);
  return true;
}

/**
 * Password Authorization is a basic auth implementation
 */
var PasswordAuthorization = function(name, username, password) {
  this.name = name;
  this.username = username;
  this.password = password;
  this._btoa = null;
  if (typeof window !== 'undefined')
    this._btoa = btoa;
  else
    this._btoa = require("btoa");
};

PasswordAuthorization.prototype.apply = function(obj, authorizations) {
  var base64encoder = this._btoa;
  obj.headers["Authorization"] = "Basic " + base64encoder(this.username + ":" + this.password);
  return true;
};var __bind = function(fn, me){
  return function(){
    return fn.apply(me, arguments);
  };
};

fail = function(message) {
  log(message);
}

log = function(){
  log.history = log.history || [];
  log.history.push(arguments);
  if(this.console){
    console.log( Array.prototype.slice.call(arguments)[0] );
  }
};

if (!Array.prototype.indexOf) {
  Array.prototype.indexOf = function(obj, start) {
    for (var i = (start || 0), j = this.length; i < j; i++) {
      if (this[i] === obj) { return i; }
    }
    return -1;
  }
}

if (!('filter' in Array.prototype)) {
  Array.prototype.filter= function(filter, that /*opt*/) {
    var other= [], v;
    for (var i=0, n= this.length; i<n; i++)
      if (i in this && filter.call(that, v= this[i], i, this))
        other.push(v);
    return other;
  };
}

if (!('map' in Array.prototype)) {
  Array.prototype.map= function(mapper, that /*opt*/) {
    var other= new Array(this.length);
    for (var i= 0, n= this.length; i<n; i++)
      if (i in this)
        other[i]= mapper.call(that, this[i], i, this);
    return other;
  };
}

Object.keys = Object.keys || (function () {
  var hasOwnProperty = Object.prototype.hasOwnProperty,
    hasDontEnumBug = !{toString:null}.propertyIsEnumerable("toString"),
    DontEnums = [
      'toString',
      'toLocaleString',
      'valueOf',
      'hasOwnProperty',
      'isPrototypeOf',
      'propertyIsEnumerable',
      'constructor'
    ],
  DontEnumsLength = DontEnums.length;

  return function (o) {
    if (typeof o != "object" && typeof o != "function" || o === null)
      throw new TypeError("Object.keys called on a non-object");

    var result = [];
    for (var name in o) {
      if (hasOwnProperty.call(o, name))
        result.push(name);
    }

    if (hasDontEnumBug) {
      for (var i = 0; i < DontEnumsLength; i++) {
        if (hasOwnProperty.call(o, DontEnums[i]))
          result.push(DontEnums[i]);
      }
    }

    return result;
  };
})();
var SwaggerApi = function(url, options) {
  this.isBuilt = false;
  this.url = null;
  this.debug = false;
  this.basePath = null;
  this.authorizations = null;
  this.authorizationScheme = null;
  this.info = null;
  this.useJQuery = false;

  options = (options||{});
  if (url)
    if (url.url) options = url;
    else this.url = url;
  else options = url;

  if (options.url != null)
    this.url = options.url;

  if (options.success != null)
    this.success = options.success;

  if (typeof options.useJQuery === 'boolean')
    this.useJQuery = options.useJQuery;

  this.failure = options.failure != null ? options.failure : function() {};
  this.progress = options.progress != null ? options.progress : function() {};
  if (options.success != null)
    this.build();
}

typeFromJsonSchema = function(type, format) {
  var str;
  if(obj.type === 'array') {
    obj = (obj.items || obj['$ref'] || {});
    str += 'Array[';
  }
  if(obj.type === 'integer' && obj.format === 'int32')
    str += 'integer';
  else if(obj.type === 'integer' && obj.format === 'int64')
    str += 'long';
  else if(obj.type === 'string' && obj.format === 'date-time')
    str += 'date-time';
  else if(obj.type === 'string' && obj.format === 'date')
    str += 'date';
  else if(obj.type === 'number' && obj.format === 'float')
    str += 'float';
  else if(obj.type === 'number' && obj.format === 'double')
    str += 'double';
  else if(obj.type === 'boolean')
    str += 'boolean';
  else
    str += obj.type || obj['$ref'];
  if(this.obj.type === 'array')
    str += ']';
  return str;
}

SwaggerApi.prototype.build = function() {
  var self = this;
  this.progress('fetching resource list: ' + this.url);
  var obj = {
    useJQuery: this.useJQuery,
    url: this.url,
    method: "get",
    headers: {
      accept: "application/json"
    },
    on: {
      error: function(response) {
        if (self.url.substring(0, 4) !== 'http')
          return self.fail('Please specify the protocol for ' + self.url);
        else if (response.status === 0)
          return self.fail('Can\'t read from server.  It may not have the appropriate access-control-origin settings.');
        else if (response.status === 404)
          return self.fail('Can\'t read swagger JSON from ' + self.url);
        else
          return self.fail(response.status + ' : ' + response.statusText + ' ' + self.url);
      },
      response: function(resp) {
        var responseObj = resp.obj || JSON.parse(resp.data);
        self.swaggerVersion = responseObj.swaggerVersion;

        if(responseObj.swagger && responseObj.swagger === 2.0) {
          self.swaggerVersion = responseObj.swagger;
          self.build20(responseObj);
        }
      }
    }
  };
  var e = (typeof window !== 'undefined' ? window : exports);
  e.authorizations.apply(obj);
  new SwaggerHttp().execute(obj);
  return this;
};

SwaggerApi.prototype.build20 = function(response) {
  if(this.isBuilt)
    return this;
  this.info = response.info || {};
  this.title = response.title || '';
  this.host = response.host || '';
  this.schemes = response.schemes || [ 'http' ];
  this.basePath = response.basePath || '';
  this.apis = {};
  this.apisArray = [];
  this.consumes = response.consumes;
  this.produces = response.produces;
  this.authSchemes = response.authorizations;

  this.definitions = response.definitions;
  var key;
  for(key in this.definitions) {
    var model = new SwaggerModel(key, this.definitions[key]);
    if(model) {
      models[key] = model;
    }
  }

  // get paths, create functions for each operationId
  var path;
  var operations = [];
  for(path in response.paths) {
    var httpMethod;
    for(httpMethod in response.paths[path]) {
      var operation = response.paths[path][httpMethod];
      var tags = operation.tags;
      if(typeof tags === undefined)
        tags = [];
      var operationId = this.idFromOp(path, httpMethod, operation);
      var operation = new SwaggerOperation (
        this,
        operationId,
        httpMethod,
        path,
        operation,
        this.definitions
      );
      // bind this operation's execute command to the api
      if(tags.length > 0) {
        var i;
        for(i = 0; i < tags.length; i++) {
          var tag = this.tagFromLabel(tags[i]);
          var operationGroup = this[tag];
          if(typeof operationGroup === 'undefined') {
            this[tag] = [];
            operationGroup = this[tag];
            operationGroup.label = tag;
            operationGroup.apis = [];
            this[tag].help = this.help.bind(operationGroup);
            this.apisArray.push(new SwaggerResource(tag, operation));
          }
          operationGroup[operationId] = operation.execute.bind(operation);
          operationGroup[operationId].help = operation.help.bind(operation);
          operationGroup.apis.push(operation);

          // legacy UI feature
          var j;
          var api = null;
          for(j = 0; j < this.apisArray.length; j++) {
            if(this.apisArray[j].tag === tag) {
              api = this.apisArray[j];
            }
          }
          if(api) {
            api.operationsArray.push(operation);
          }
        }
      }
      else {
        log('no group to bind to');
      }
    }
  }
  this.isBuilt = true;
  if (this.success)
    this.success();
  return this;
}

SwaggerApi.prototype.help = function() {
  var i;
  log('operations for the "' + this.label + '" tag');
  for(i = 0; i < this.apis.length; i++) {
    var api = this.apis[i];
    log('  * ' + api.nickname + ': ' + api.operation.summary);
  }
}

SwaggerApi.prototype.tagFromLabel = function(label) {
  return label;
}

SwaggerApi.prototype.idFromOp = function(path, httpMethod, op) {
  if(typeof op.operationId !== 'undefined') {
    return (op.operationId);
  }
  else {
    return path.substring(1).replace(/\//g, "_").replace(/\{/g, "").replace(/\}/g, "") + "_" + httpMethod;
  }
}

SwaggerApi.prototype.fail = function(message) {
  this.failure(message);
  throw message;
};

var SwaggerResource = function(tag, operation) {
  this.tag = tag;
  this.path = tag;
  this.name = tag;
  this.operation = operation;
  this.operationsArray = [];

  this.description = operation.description || "";
}

var SwaggerOperation = function(parent, operationId, httpMethod, path, args, definitions) {
  var errors = [];
  this.operation = args;
  this.consumes = args.consumes;
  this.produces = args.produces;
  this.parent = parent;
  this.host = parent.host;
  this.schemes = parent.schemes;
  this.basePath = parent.basePath;
  this.nickname = (operationId||errors.push('SwaggerOperations must have a nickname.'));
  this.method = (httpMethod||errors.push('SwaggerOperation ' + operationId + ' is missing method.'));
  this.path = (path||errors.push('SwaggerOperation ' + nickname + ' is missing path.'));
  this.parameters = args != null ? (args.parameters||[]) : {};
  this.summary = args.summary || '';
  this.responses = (args.responses||{});

  // this.authorizations = authorizations;

  var i;
  for(i = 0; i < this.parameters.length; i++) {
    var param = this.parameters[i];
    type = this.getType(param);

    param.signature = this.getSignature(type, models);
    param.sampleJSON = this.getSampleJSON(type, models);
  }

  var response;
  var model;
  var responses = this.responses;

  if(responses['200'])
    response = responses['200'];
  else if(responses['default'])
    response = responses['default'];
  if(response && response.schema) {
    var resolvedModel = this.resolveModel(response.schema, definitions);
    this.responseSampleJSON = JSON.stringify(resolvedModel.getSampleValue(), null, 2);
    this.responseClassSignature = resolvedModel.getMockSignature();
  }
  else
    this.responseClassSignature = '';

  if (errors.length > 0)
    this.resource.api.fail(errors);

  return this;
}

SwaggerResource.prototype.sort = function(sorter) {

}

SwaggerOperation.prototype.getType = function (param) {
  var type = param.type;
  var format = param.format;
  var str;
  if(type === 'integer' && format === 'int32')
    str = 'integer';
  else if(type === 'integer' && format === 'int64')
    str = 'long';
  else if(type === 'string' && format === 'date-time')
    str = 'date-time';
  else if(type === 'string' && format === 'date')
    str = 'date';
  else if(type === 'number' && format === 'float')
    str = 'float';
  else if(type === 'number' && format === 'double')
    str = 'double';
  else if(type === 'boolean')
    str = 'boolean';
  else if(type === 'string')
    str = 'string';
  else if(typeof type === 'undefined') {
    var schema = param.schema;
    if(schema) {
      var ref = schema['$ref'];
      if(ref) {
        if(ref.indexOf('#/definitions/') === 0)
          return ref.substring('#/definitions/'.length);
        else
          return ref;
      }
      else
        return getType(schema.type, schema.format);
    }
  }
  return str;
}

SwaggerOperation.prototype.resolveModel = function (schema, definitions) {
  if(typeof schema['$ref'] !== 'undefined') {
    var ref = schema['$ref'];
    if(ref.indexOf('#/definitions/') == 0)
      ref = ref.substring('#/definitions/'.length);
    if(definitions[ref])
      return new SwaggerModel(ref, definitions[ref]);
  }
  return new SwaggerModel('name', schema);
}

SwaggerOperation.prototype.help = function() {
  log(this.nickname + ': ' + this.operation.summary);
  for(var i = 0; i < this.parameters.length; i++) {
    var param = this.parameters[i];
    log('  * ' + param.name + ': ' + param.description);
  }
}

SwaggerOperation.prototype.getSignature = function(type, models) {
  var isPrimitive, listType;
  // listType = this.isListType(type);
  isPrimitive = ((listType != null) && models[listType]) || (models[type] != null) ? false : true;
  if (isPrimitive) {
    return type;
  } else {
    if (listType != null) {
      return models[listType].getMockSignature();
    } else {
      return models[type].getMockSignature();
    }
  }
};

SwaggerOperation.prototype.getSampleJSON = function(type, models) {
  var isPrimitive, listType, val;

  listType = type; //this.isListType(type);
  isPrimitive = (models[type] != null) ? false : true;
  val = isPrimitive ? void 0 : models[type].createJSONSample();
  if (val) {
    val = listType ? [val] : val;
    if(typeof val == "string")
      return val;
    else if(typeof val === "object") {
      var t = val;
      if(val instanceof Array && val.length > 0) {
        t = val[0];
      }
      if(t.nodeName) {
        var xmlString = new XMLSerializer().serializeToString(t);
        return this.formatXml(xmlString);
      }
      else
        return JSON.stringify(val, null, 2);
    }
    else
      return val;
  }
};

// legacy support
SwaggerOperation.prototype["do"] = function(args, opts, callback, error, parent) {
  return this.execute(args, opts, callback, error, parent);
}

SwaggerOperation.prototype.execute = function(arg1, arg2, arg3, arg4, parent) {
  var args = (arg1||{});
  var opts = {}, success, error;
  if(typeof arg2 === 'object') {
    opts = arg2;
    success = arg3;
    error = arg4;
  }
  if(typeof arg2 === 'function') {
    success = arg2;
    error = arg3;
  }

  var formParams = {};
  var headers = {};
  var requestUrl = this.path;

  success = (success||log)
  error = (error||log)

  var requiredParams = [];
  var missingParams = [];
  // check required params
  for(var i = 0; i < this.parameters.length; i++) {
    var param = this.parameters[i];
    if(param.required === true) {
      requiredParams.push(param.name);
      if(typeof args[param.name] === 'undefined')
        missingParams = param.name;
    }
  }

  if(missingParams.length > 0) {
    var message = 'missing required params: ' + missingParams;
    fail(message);
    return;
  }

  // set content type negotiation
  var consumes = this.consumes || this.parent.consumes || [ 'application/json' ];
  var produces = this.produces || this.parent.produces || [ 'application/json' ];

  headers = this.setContentTypes(args, opts);

  // grab params from the args, build the querystring along the way
  var querystring = "";
  for(var i = 0; i < this.parameters.length; i++) {
    var param = this.parameters[i];
    if(typeof args[param.name] !== 'undefined') {
      if(param.in === 'path') {
        var reg = new RegExp('\{' + param.name + '[^\}]*\}', 'gi');
        requestUrl = requestUrl.replace(reg, this.encodePathParam(args[param.name]));
      }
      else if (param.in === 'query') {
        if(querystring === '')
          querystring += '?';
        if(typeof param.collectionFormat !== 'undefined') {
          var qp = args[param.name];
          if(Array.isArray(qp))
            querystring += this.encodeCollection(param.collectionFormat, param.name, qp);
          else
            querystring += this.encodeQueryParam(param.name) + '=' + this.encodeQueryParam(args[param.name]);
        }
        else
          querystring += this.encodeQueryParam(param.name) + '=' + this.encodeQueryParam(args[param.name]);
      }
      else if (param.in === 'header')
        headers[param.name] = args[param.name];
      else if (param.in === 'form')
        formParams[param.name] = args[param.name];
    }
  }
  var scheme = this.schemes[0];
  var url = scheme + '://' + this.host + this.basePath + requestUrl + querystring;

  var obj = {
    url: url,
    method: args.method,
    useJQuery: this.useJQuery,
    headers: headers,
    on: {
      response: function(response) {
        return success(response, parent);
      },
      error: function(response) {
        return error(response, parent);
      }
    }
  };
  new SwaggerHttp().execute(obj);
}

SwaggerOperation.prototype.setContentTypes = function(args, opts) {
  // default type
  var accepts = 'application/json';
  var consumes = 'application/json';

  var allDefinedParams = this.parameters;
  var definedFormParams = [];
  var definedFileParams = [];
  var body = args.body;
  var headers = {};

  // get params from the operation and set them in definedFileParams, definedFormParams, headers
  var i;
  for(i = 0; i < allDefinedParams.length; i++) {
    var param = allDefinedParams[i];
    if(param.in === 'form')
      definedFormParams.push(param);
    else if(param.in === 'file')
      definedFileParams.push(param);
    else if(param.in === 'header' && this.params.headers) {
      var key = param.name;
      var headerValue = this.params.headers[param.name];
      if(typeof this.params.headers[param.name] !== 'undefined')
        headers[key] = headerValue;
    }
  }

  // if there's a body, need to set the accepts header via requestContentType
  if (body && (this.type === 'post' || this.type === 'put' || this.type === 'patch' || this.type === 'delete')) {
    if (opts.requestContentType)
      consumes = opts.requestContentType;
  } else {
    // if any form params, content type must be set
    if(definedFormParams.length > 0) {
      if(definedFileParams.length > 0)
        consumes = 'multipart/form-data';
      else
        consumes = 'application/x-www-form-urlencoded';
    }
    else if (this.type == 'DELETE')
      body = '{}';
    else if (this.type != 'DELETE')
      accepts = null;
  }

  if (consumes && this.consumes) {
    if (this.consumes.indexOf(consumes) === -1) {
      log('server doesn\'t consume ' + consumes + ', try ' + JSON.stringify(this.consumes));
      consumes = this.operation.consumes[0];
    }
  }

  if (opts.responseContentType) {
    accepts = opts.responseContentType;
  } else {
    accepts = 'application/json';
  }
  if (accepts && this.produces) {
    if (this.produces.indexOf(accepts) === -1) {
      log('server can\'t produce ' + accepts);
      accepts = this.produces[0];
    }
  }

  if ((consumes && body !== '') || (consumes === 'application/x-www-form-urlencoded'))
    headers['Content-Type'] = consumes;
  if (accepts)
    headers['Accept'] = accepts;
  return headers;
}

SwaggerOperation.prototype.responseClassSignature = function () {
  var response;
  var responses = this.responses;
  if(responses) {
    if(responses['200'])
      response = new SwaggerModel('200', responses['200']);
    else if(responses['default'])
      response = new SwaggerModel('default', responses['default']);
  }
  if(response)
    return response.getMockSignature();
}

SwaggerOperation.prototype.encodeCollection = function(type, name, value) {
  var encoded = '';
  var i;
  if(type === 'jaxrs') {
    for(i = 0; i < value.length; i++) {
      if(i > 0) encoded += '&'
      encoded += this.encodeQueryParam(name) + '=' + this.encodeQueryParam(value[i]);
    }
  }
  return encoded;
}

SwaggerOperation.prototype.encodeQueryParam = function(arg) {
  return escape(arg);
}

SwaggerOperation.prototype.encodePathParam = function(pathParam) {
  var encParts, part, parts, _i, _len;
  pathParam = pathParam.toString();
  if (pathParam.indexOf('/') === -1) {
    return encodeURIComponent(pathParam);
  } else {
    parts = pathParam.split('/');
    encParts = [];
    for (_i = 0, _len = parts.length; _i < _len; _i++) {
      part = parts[_i];
      encParts.push(encodeURIComponent(part));
    }
    return encParts.join('/');
  }
};

SwaggerOperation.prototype.encodePathParam = function(pathParam) {
  var encParts, part, parts, _i, _len;
  pathParam = pathParam.toString();
  if (pathParam.indexOf('/') === -1) {
    return encodeURIComponent(pathParam);
  } else {
    parts = pathParam.split('/');
    encParts = [];
    for (_i = 0, _len = parts.length; _i < _len; _i++) {
      part = parts[_i];
      encParts.push(encodeURIComponent(part));
    }
    return encParts.join('/');
  }
};

var SwaggerModel = function(name, definition) {
  this.name = name;
  this.definition = definition || {};
  this.properties = [];
  var requiredFields = definition.enum || [];

  var key;
  var props = definition.properties;
  if(props) {
    for(key in props) {
      var required = false;
      var property = props[key];
      if(requiredFields.indexOf(key) >= 0)
        required = true;
      this.properties.push(new SwaggerModelProperty(key, property, required));
    }    
  }
}

SwaggerModel.prototype.createJSONSample = function(modelsToIgnore) {
  if(sampleModels[this.name]) {
    return sampleModels[this.name];
  }
  else {
    var result = {};
    var modelsToIgnore = (modelsToIgnore||[])
    modelsToIgnore.push(this.name);
    for (var i = 0; i < this.properties.length; i++) {
      prop = this.properties[i];
      result[prop.name] = prop.getSampleValue(modelsToIgnore);
    }
    modelsToIgnore.pop(this.name);
    return result;
  }
};

SwaggerModel.prototype.getSampleValue = function() {
  var i;
  var obj = {};
  for(i = 0; i < this.properties.length; i++ ) {
    var property = this.properties[i];
    obj[property.name] = property.sampleValue();
  }
  return obj;
}

SwaggerModel.prototype.getMockSignature = function(modelsToIgnore) {
  var propertiesStr = [];
  var i;
  for (i = 0; i < this.properties.length; i++) {
    var prop = this.properties[i];
    propertiesStr.push(prop.toString());
  }

  var strong = '<span class="strong">';
  var stronger = '<span class="stronger">';
  var strongClose = '</span>';
  var classOpen = strong + this.name + ' {' + strongClose;
  var classClose = strong + '}' + strongClose;
  var returnVal = classOpen + '<div>' + propertiesStr.join(',</div><div>') + '</div>' + classClose;
  if (!modelsToIgnore)
    modelsToIgnore = [];

  modelsToIgnore.push(this.name);
  var i;
  for (i = 0; i < this.properties.length; i++) {
    var prop = this.properties[i];
    var ref = prop['$ref'];
    var model = models[ref];
    if (model && modelsToIgnore.indexOf(ref) === -1) {
      returnVal = returnVal + ('<br>' + model.getMockSignature(modelsToIgnore));
    }
  }
  return returnVal;
};

var SwaggerModelProperty = function(name, obj, required) {
  this.schema = obj;
  this.required = required;
  if(obj['$ref']) {
    var refType = obj['$ref'];
    refType = refType.indexOf('#/definitions') === -1 ? refType : refType.substring('#/definitions').length;
    this['$ref'] = refType;
  }
  else if (obj.type === 'array') {
    if(obj.items['$ref'])
      this['$ref'] = obj.items['$ref'];
    else
      obj = obj.items;
  }
  this.name = name;
  this.obj = obj;
  this.optional = true;
  this.example = obj.example || null;
}

SwaggerModelProperty.prototype.getSampleValue = function () {
  return this.sampleValue(false);
}

SwaggerModelProperty.prototype.isArray = function () {
  var schema = this.schema;
  if(schema.type === 'array')
    return true;
  else
    return false;
}

SwaggerModelProperty.prototype.sampleValue = function(isArray, ignoredModels) {
  isArray = (isArray || this.isArray());
  ignoredModels = (ignoredModels || {})
  var type = this.simpleType();
  var output;
  if(this['$ref']) {
    var refModel = models[this['$ref']];
    if(refModel && typeof ignoredModels[refModel] === 'undefined') {
      output = refModel.getSampleValue(ignoredModels);
    }
    else
      type = refModel;
  }
  else if(this.example)
    output = this.example;
  else if(type === 'date-time') {
    output = new Date().toISOString();
  }
  else if(type === 'string') {
    output = 'string';
  }
  else if(type === 'integer') {
    output = 0;
  }
  else if(type === 'long') {
    output = 0;
  }
  else if(type === 'float') {
    output = 0.0;
  }
  else if(type === 'double') {
    output = 0.0;
  }
  else if(type === 'boolean') {
    output = true;
  }
  else
    output = {};
  if(isArray) return [output];
  else return output;
}

SwaggerModelProperty.prototype.simpleType = function() {
  var str = '';
  var obj = this.obj;
  if(obj.type === 'array') {
    obj = (obj.items || obj['$ref'] || {});
    str += 'Array[';
  }
  if(obj.type === 'integer' && obj.format === 'int32')
    str += 'integer';
  else if(obj.type === 'integer' && obj.format === 'int64')
    str += 'long';
  else if(obj.type === 'string' && obj.format === 'date-time')
    str += 'date-time';
  else if(obj.type === 'string' && obj.format === 'date')
    str += 'date';
  else if(obj.type === 'number' && obj.format === 'float')
    str += 'float';
  else if(obj.type === 'number' && obj.format === 'double')
    str += 'double';
  else if(obj.type === 'boolean')
    str += 'boolean';
  else
    str += obj.type || obj['$ref'];
  if(this.obj.type === 'array')
    str += ']';
  return str;
}

SwaggerModelProperty.prototype.toString = function() {
  var str = this.simpleType();
  if(str !== '')
    str = this.name + ' : ' + str;
  else 
    str = this.name + ' : ' + JSON.stringify(this.obj);
  if(!this.required)
    str += ' (optional)';
  return str;
}

var e = (typeof window !== 'undefined' ? window : exports);

var sampleModels = {};
var cookies = {};
var models = {};

e.SampleModels = sampleModels;
e.SwaggerHttp = SwaggerHttp;
// e.SwaggerRequest = SwaggerRequest;
e.authorizations = new SwaggerAuthorizations();
e.ApiKeyAuthorization = ApiKeyAuthorization;
e.PasswordAuthorization = PasswordAuthorization;
e.CookieAuthorization = CookieAuthorization;
e.JQueryHttpClient = JQueryHttpClient;
e.ShredHttpClient = ShredHttpClient;
e.SwaggerOperation = SwaggerOperation;
// e.SwaggerModel = SwaggerModel;
// e.SwaggerModelProperty = SwaggerModelProperty;
// e.SwaggerResource = SwaggerResource;
e.SwaggerApi = SwaggerApi;
/**
 * SwaggerHttp is a wrapper for executing requests
 */
var SwaggerHttp = function() {};

SwaggerHttp.prototype.execute = function(obj) {
  if(obj && (typeof obj.useJQuery === 'boolean'))
    this.useJQuery = obj.useJQuery;
  else
    this.useJQuery = this.isIE8();

  if(this.useJQuery)
    return new JQueryHttpClient().execute(obj);
  else
    return new ShredHttpClient().execute(obj);
}

SwaggerHttp.prototype.isIE8 = function() {
  var detectedIE = false;
  if (typeof navigator !== 'undefined' && navigator.userAgent) {
    nav = navigator.userAgent.toLowerCase();
    if (nav.indexOf('msie') !== -1) {
      var version = parseInt(nav.split('msie')[1]);
      if (version <= 8) {
        detectedIE = true;
      }
    }
  }
  return detectedIE;
};

/*
 * JQueryHttpClient lets a browser take advantage of JQuery's cross-browser magic.
 * NOTE: when jQuery is available it will export both '$' and 'jQuery' to the global space.
 *       Since we are using closures here we need to alias it for internal use.
 */
var JQueryHttpClient = function(options) {
  "use strict";
  if(!jQuery){
    var jQuery = window.jQuery;
  }
}

JQueryHttpClient.prototype.execute = function(obj) {
  var cb = obj.on;
  var request = obj;

  obj.type = obj.method;
  obj.cache = false;

  obj.beforeSend = function(xhr) {
    var key, results;
    if (obj.headers) {
      results = [];
      var key;
      for (key in obj.headers) {
        if (key.toLowerCase() === "content-type") {
          results.push(obj.contentType = obj.headers[key]);
        } else if (key.toLowerCase() === "accept") {
          results.push(obj.accepts = obj.headers[key]);
        } else {
          results.push(xhr.setRequestHeader(key, obj.headers[key]));
        }
      }
      return results;
    }
  };

  obj.data = obj.body;
  obj.complete = function(response, textStatus, opts) {
    var headers = {},
        headerArray = response.getAllResponseHeaders().split("\n");

    for(var i = 0; i < headerArray.length; i++) {
      var toSplit = headerArray[i].trim();
      if(toSplit.length === 0)
        continue;
      var separator = toSplit.indexOf(":");
      if(separator === -1) {
        // Name but no value in the header
        headers[toSplit] = null;
        continue;
      }
      var name = toSplit.substring(0, separator).trim(),
          value = toSplit.substring(separator + 1).trim();
      headers[name] = value;
    }

    var out = {
      url: request.url,
      method: request.method,
      status: response.status,
      data: response.responseText,
      headers: headers
    };

    var contentType = (headers["content-type"]||headers["Content-Type"]||null)

    if(contentType != null) {
      if(contentType.indexOf("application/json") == 0 || contentType.indexOf("+json") > 0) {
        if(response.responseText && response.responseText !== "")
          out.obj = JSON.parse(response.responseText);
        else
          out.obj = {}
      }
    }

    if(response.status >= 200 && response.status < 300)
      cb.response(out);
    else if(response.status === 0 || (response.status >= 400 && response.status < 599))
      cb.error(out);
    else
      return cb.response(out);
  };

  jQuery.support.cors = true;
  return jQuery.ajax(obj);
}

/*
 * ShredHttpClient is a light-weight, node or browser HTTP client
 */
var ShredHttpClient = function(options) {
  this.options = (options||{});
  this.isInitialized = false;

  var identity, toString;

  if (typeof window !== 'undefined') {
    this.Shred = require("./shred");
    this.content = require("./shred/content");
  }
  else
    this.Shred = require("shred");
  this.shred = new this.Shred();
}

ShredHttpClient.prototype.initShred = function () {
  this.isInitialized = true;
  this.registerProcessors(this.shred);
}

ShredHttpClient.prototype.registerProcessors = function(shred) {
  var identity = function(x) {
    return x;
  };
  var toString = function(x) {
    return x.toString();
  };

  if (typeof window !== 'undefined') {
    this.content.registerProcessor(["application/json; charset=utf-8", "application/json", "json"], {
      parser: identity,
      stringify: toString
    });
  } else {
    this.Shred.registerProcessor(["application/json; charset=utf-8", "application/json", "json"], {
      parser: identity,
      stringify: toString
    });
  }
}

ShredHttpClient.prototype.execute = function(obj) {
  if(!this.isInitialized)
    this.initShred();

  var cb = obj.on, res;

  var transform = function(response) {
    var out = {
      headers: response._headers,
      url: response.request.url,
      method: response.request.method,
      status: response.status,
      data: response.content.data
    };

    var contentType = (response._headers["content-type"]||response._headers["Content-Type"]||null)

    if(contentType != null) {
      if(contentType.indexOf("application/json") == 0 || contentType.indexOf("+json") > 0) {
        if(response.content.data && response.content.data !== "")
          out.obj = JSON.parse(response.content.data);
        else
          out.obj = {}
      }
    }
    return out;
  };

  res = {
    error: function(response) {
      if (obj)
        return cb.error(transform(response));
    },
    redirect: function(response) {
      if (obj)
        return cb.redirect(transform(response));
    },
    307: function(response) {
      if (obj)
        return cb.redirect(transform(response));
    },
    response: function(response) {
      if (obj)
        return cb.response(transform(response));
    }
  };
  if (obj) {
    obj.on = res;
  }
  return this.shred.request(obj);
};/**
 * SwaggerHttp is a wrapper for executing requests
 */
var SwaggerHttp = function() {};

SwaggerHttp.prototype.execute = function(obj) {
  if(obj && (typeof obj.useJQuery === 'boolean'))
    this.useJQuery = obj.useJQuery;
  else
    this.useJQuery = this.isIE8();

  if(this.useJQuery)
    return new JQueryHttpClient().execute(obj);
  else
    return new ShredHttpClient().execute(obj);
}

SwaggerHttp.prototype.isIE8 = function() {
  var detectedIE = false;
  if (typeof navigator !== 'undefined' && navigator.userAgent) {
    nav = navigator.userAgent.toLowerCase();
    if (nav.indexOf('msie') !== -1) {
      var version = parseInt(nav.split('msie')[1]);
      if (version <= 8) {
        detectedIE = true;
      }
    }
  }
  return detectedIE;
};

/*
 * JQueryHttpClient lets a browser take advantage of JQuery's cross-browser magic.
 * NOTE: when jQuery is available it will export both '$' and 'jQuery' to the global space.
 *       Since we are using closures here we need to alias it for internal use.
 */
var JQueryHttpClient = function(options) {
  "use strict";
  if(!jQuery){
    var jQuery = window.jQuery;
  }
}

JQueryHttpClient.prototype.execute = function(obj) {
  var cb = obj.on;
  var request = obj;

  obj.type = obj.method;
  obj.cache = false;

  obj.beforeSend = function(xhr) {
    var key, results;
    if (obj.headers) {
      results = [];
      var key;
      for (key in obj.headers) {
        if (key.toLowerCase() === "content-type") {
          results.push(obj.contentType = obj.headers[key]);
        } else if (key.toLowerCase() === "accept") {
          results.push(obj.accepts = obj.headers[key]);
        } else {
          results.push(xhr.setRequestHeader(key, obj.headers[key]));
        }
      }
      return results;
    }
  };

  obj.data = obj.body;
  obj.complete = function(response, textStatus, opts) {
    var headers = {},
        headerArray = response.getAllResponseHeaders().split("\n");

    for(var i = 0; i < headerArray.length; i++) {
      var toSplit = headerArray[i].trim();
      if(toSplit.length === 0)
        continue;
      var separator = toSplit.indexOf(":");
      if(separator === -1) {
        // Name but no value in the header
        headers[toSplit] = null;
        continue;
      }
      var name = toSplit.substring(0, separator).trim(),
          value = toSplit.substring(separator + 1).trim();
      headers[name] = value;
    }

    var out = {
      url: request.url,
      method: request.method,
      status: response.status,
      data: response.responseText,
      headers: headers
    };

    var contentType = (headers["content-type"]||headers["Content-Type"]||null)

    if(contentType != null) {
      if(contentType.indexOf("application/json") == 0 || contentType.indexOf("+json") > 0) {
        if(response.responseText && response.responseText !== "")
          out.obj = JSON.parse(response.responseText);
        else
          out.obj = {}
      }
    }

    if(response.status >= 200 && response.status < 300)
      cb.response(out);
    else if(response.status === 0 || (response.status >= 400 && response.status < 599))
      cb.error(out);
    else
      return cb.response(out);
  };

  jQuery.support.cors = true;
  return jQuery.ajax(obj);
}

/*
 * ShredHttpClient is a light-weight, node or browser HTTP client
 */
var ShredHttpClient = function(options) {
  this.options = (options||{});
  this.isInitialized = false;

  var identity, toString;

  if (typeof window !== 'undefined') {
    this.Shred = require("./shred");
    this.content = require("./shred/content");
  }
  else
    this.Shred = require("shred");
  this.shred = new this.Shred();
}

ShredHttpClient.prototype.initShred = function () {
  this.isInitialized = true;
  this.registerProcessors(this.shred);
}

ShredHttpClient.prototype.registerProcessors = function(shred) {
  var identity = function(x) {
    return x;
  };
  var toString = function(x) {
    return x.toString();
  };

  if (typeof window !== 'undefined') {
    this.content.registerProcessor(["application/json; charset=utf-8", "application/json", "json"], {
      parser: identity,
      stringify: toString
    });
  } else {
    this.Shred.registerProcessor(["application/json; charset=utf-8", "application/json", "json"], {
      parser: identity,
      stringify: toString
    });
  }
}

ShredHttpClient.prototype.execute = function(obj) {
  if(!this.isInitialized)
    this.initShred();

  var cb = obj.on, res;

  var transform = function(response) {
    var out = {
      headers: response._headers,
      url: response.request.url,
      method: response.request.method,
      status: response.status,
      data: response.content.data
    };

    var contentType = (response._headers["content-type"]||response._headers["Content-Type"]||null)

    if(contentType != null) {
      if(contentType.indexOf("application/json") == 0 || contentType.indexOf("+json") > 0) {
        if(response.content.data && response.content.data !== "")
          out.obj = JSON.parse(response.content.data);
        else
          out.obj = {}
      }
    }
    return out;
  };

  res = {
    error: function(response) {
      if (obj)
        return cb.error(transform(response));
    },
    redirect: function(response) {
      if (obj)
        return cb.redirect(transform(response));
    },
    307: function(response) {
      if (obj)
        return cb.redirect(transform(response));
    },
    response: function(response) {
      if (obj)
        return cb.response(transform(response));
    }
  };
  if (obj) {
    obj.on = res;
  }
  return this.shred.request(obj);
};