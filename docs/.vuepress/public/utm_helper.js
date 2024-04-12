var script = document.createElement('script');
script.setAttribute('type','text/javascript');
script.setAttribute('src',"https://cdn.jsdelivr.net/npm/browser-tool@1.2.2/dist/browser.min.js");
document.getElementsByTagName('head')[0].appendChild(script);

function getUTMParametersAndSetCookie() {
  var utmParameters = {};
  var params = new URLSearchParams(window.location.search);
  for (const [key, value] of params.entries()) {
    if (key.startsWith("utm_")) {
      utmParameters[key] = value;
    }
  }
  if (document.referrer) {
    var referrerDomain = new URL(document.referrer).hostname;
    utmParameters['referrer'] = referrerDomain;
  } else {
    utmParameters['referrer'] = "direct";
  }
  if (browser) {
    uaInfo = browser()
    utmParameters['browser'] = uaInfo.browser
    utmParameters['device'] = uaInfo.device
  }
  var rootDomain = getRootDomain(document.domain);
  var existingCookie = getCookieByName("utmParameters");
  if (!existingCookie) {
    setCookie("utmParameters", JSON.stringify(utmParameters), 30, rootDomain);
  }
}

function getRootDomain(domain) {
  var parts = domain.split(".");
  var rootDomain = parts.slice(-2).join(".");
  return rootDomain;
}

function getCookieByName(name) {
  var cookies = document.cookie.split("; ");
  for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i].split("=");
    var cookieName = decodeURIComponent(cookie[0]);
    var cookieValue = decodeURIComponent(cookie[1]);
    if (cookieName === name) {
      return cookieValue;
    }
  }
  return null;
}

function setCookie(name, value, days, domain) {
  var expires = "";
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + encodeURIComponent(value) + expires + "; domain=." + domain + "; path=/";
}

window.onload = getUTMParametersAndSetCookie;