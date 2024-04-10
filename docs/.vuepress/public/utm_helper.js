function getUTMParametersAndSetCookie() {
  var utmParameters = {};
  var params = new URLSearchParams(window.location.search);
  for (const [key, value] of params.entries()) {
    if (key.startsWith("utm_")) {
      utmParameters[key] = value;
    }
  }
  if (Object.keys(utmParameters).length !== 0) {
    utmParameters['referrer'] = document.referrer;
    var rootDomain = getRootDomain(document.domain);
    console.log(document.domain)
    var existingCookie = getCookieByName("utmParameters");
    if (!existingCookie) {
      setCookie("utmParameters", JSON.stringify(utmParameters), 30, rootDomain);
    }
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

getUTMParametersAndSetCookie();