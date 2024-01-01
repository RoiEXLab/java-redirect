# java-redirect
A Firefox Addon which redirects you to the latest javadocs

### Test URLs
https://docs.oracle.com/javase/8/docs/api/java/lang/String.html
https://docs.oracle.com/javase/8/javafx/api/javafx/scene/control/Dialog.html
https://docs.oracle.com/en/java/javase/11/docs/api/java.net.http/java/net/http/HttpClient.html


### Module mappings

#### Java 10
Execute on https://docs.oracle.com/javase/10/docs/api/module-overview-frame.html to get module JSON for java 10:

```js
JSON.stringify((await Promise.all(Array.prototype.map.call(document.querySelectorAll('body > main > ul > li > a'), async a => {
  const response = await fetch(a.href);
  const dummyElement = document.createElement('html');
  dummyElement.innerHTML = await response.text();
  return Array.prototype.map.call(dummyElement.querySelectorAll('main > ul > li > a'), p => ({ package: p.innerHTML, module: a.innerHTML }));
}))).flatMap(a => a));
```

#### Java 11
Execute on https://docs.oracle.com/en/java/javase/11/docs/api/allpackages-index.html to get module JSON for java 11:

```js
JSON.stringify((await Promise.all(Array.prototype.map.call(document.querySelectorAll('main > div > ul > li > table > tbody > tr > th > a'), async a => {
  const response = await fetch(a.href);
  const dummyElement = document.createElement('html');
  dummyElement.innerHTML = await response.text();
  return { package: a.innerHTML, module: dummyElement.querySelector('main > div > div > a').innerHTML };
}))));
```
#### Java 12/13/14/15
Execute on https://docs.oracle.com/en/java/javase/12/docs/api/allpackages-index.html to get module JSON for java 12 (works for 13/14/15 too with updated URL):

```js
JSON.stringify((await Promise.all(Array.prototype.map.call(document.querySelectorAll('tr > th > a'), async a => {
  const response = await fetch(a.href);
  const dummyElement = document.createElement('html');
  dummyElement.innerHTML = await response.text();
  return { package: a.innerHTML, module: dummyElement.querySelector('main > div > div > a').innerHTML };
}))));
```

#### Java 17/18/19/20/21
Execute on https://docs.oracle.com/en/java/javase/16/docs/api/allpackages-index.html to get module JSON for java 16 (works for 17-21 too with updated URL):

```js
JSON.stringify((await Promise.all(Array.prototype.map.call(document.querySelectorAll('div.col-first > a'), async a => {
  const response = await fetch(a.href);
  const dummyElement = document.createElement('html');
  dummyElement.innerHTML = await response.text();
  return { package: a.innerHTML, module: dummyElement.querySelector('main > div > div > a').innerHTML };
}))));
```
