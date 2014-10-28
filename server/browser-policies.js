var rootUrl = __meteor_runtime_config__.ROOT_URL;


BrowserPolicy.content.allowConnectOrigin("https://ddp.votez.pe");
BrowserPolicy.content.allowScriptOrigin("https://ddp.votez.pe");
BrowserPolicy.content.allowConnectOrigin("wss://ddp.votez.pe");
BrowserPolicy.content.allowScriptOrigin("wss://ddp.votez.pe");
BrowserPolicy.content.allowOriginForAll("wss://ddp.votez.pe/");



BrowserPolicy.content.allowConnectOrigin(rootUrl);
//BrowserPolicy.content.allowConnectOrigin(rootUrl.replace('http', 'ws'));
BrowserPolicy.content.allowConnectOrigin(rootUrl.replace(/http(s?)/, 'ws$1'));

BrowserPolicy.content.allowInlineScripts();
BrowserPolicy.content.allowInlineStyles();
BrowserPolicy.content.allowEval();
BrowserPolicy.framing.allowAll();

BrowserPolicy.content.allowSameOriginForAll(),
BrowserPolicy.content.allowDataUrlForAll(),
BrowserPolicy.content.allowOriginForAll(rootUrl);
BrowserPolicy.content.allowOriginForAll("*.votez.pe");

BrowserPolicy.content.allowConnectOrigin("*.votez.pe");
BrowserPolicy.content.allowImageOrigin("*.votez.pe");

BrowserPolicy.content.allowConnectOrigin("*.cloudflare.com");
BrowserPolicy.content.allowScriptOrigin("*.cloudflare.com");

BrowserPolicy.content.allowConnectOrigin("*.googleapis.com");
BrowserPolicy.content.allowScriptOrigin("*.googleapis.com");
BrowserPolicy.content.allowOriginForAll("*")
//BrowserPolicy.content.allow<ContentType>Origin(origin)

BrowserPolicy.content.allowScriptOrigin("*.google-analytics.com");
BrowserPolicy.content.allowImageOrigin("*.google-analytics.com");

BrowserPolicy.content.allowConnectOrigin("*.facebook.net");
BrowserPolicy.content.allowConnectOrigin("*.facebook.com");
BrowserPolicy.content.allowScriptOrigin("*.facebook.net");
BrowserPolicy.content.allowScriptOrigin("*.facebook.com");

BrowserPolicy.content.allowConnectOrigin("*.kadira.io");
BrowserPolicy.content.allowScriptOrigin("*.kadira.io");
BrowserPolicy.content.allowOriginForAll("*.kadira.io");
BrowserPolicy.content.allowConnectOrigin("https://engine.kadira.io");
BrowserPolicy.content.allowScriptOrigin("https://engine.kadira.io");

