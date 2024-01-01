const computeModuleMap = async (version) => {
  const restrictedVersion = Math.min(21, version);
  const response = await fetch(browser.runtime.getURL(`json/modules-v${restrictedVersion}.json`));
  const json = await response.json();
  return json.reduce((map, element) => {
    map[element.package] = element.module;
    return map;
  }, {});
};


const getReplaceAlgorithm = async version => {
  const versionInt = parseInt(version, 10) || 21;
  const [moduleMap, javaFxModuleMap] = versionInt >= 11
    ? await Promise.all([computeModuleMap(versionInt), computeModuleMap(10)])
    : null;
	switch (versionInt) {
		case 8:
			return url => url.replace(/^https?\:\/\/docs\.oracle\.com\/javase\/(?:[678]|(?:1\.(?:(?:5\.0)|(?:4\.2)|[3])))/g, 'https://docs.oracle.com/javase/8');
		case 9:
			return url => url.replace(/^https?\:\/\/docs\.oracle\.com\/(?:javafx\/2|(?:javafx|javase)\/(?:[6789]|(?:1\.(?:(?:5\.0)|(?:4\.2)|[3])))\/(?:docs|javafx))/g, 'https://docs.oracle.com/javase/9/docs');
		case 10:
			return url => url.replace(/^https?\:\/\/docs\.oracle\.com\/(?:javafx\/2|(?:javafx|javase)\/(?:[6789]|10|(?:1\.(?:(?:5\.0)|(?:4\.2)|[3])))\/(?:docs|javafx))/g, 'https://docs.oracle.com/javase/10/docs');
		case 11:
		  return url => {
				if (url.includes('javafx')) {
					return url.replace(/^https?\:\/\/docs\.oracle\.com\/(?:javafx\/2|javase\/(?:[89]|10)\/javafx)\/api\/([a-z/]+)\//g, (_, g1) => `https://openjfx.io/javadoc/11/${javaFxModuleMap[g1.replace(/\//g, '.')]}/${g1}/`);
				}
				return url.replace(/^https?\:\/\/docs\.oracle\.com\/javase\/(?:[6789]|10|(?:1\.(?:(?:5\.0)|(?:4\.2)|[3])))\/docs\/api\/([a-z/]+)\//g, (_, g1) => `https://docs.oracle.com/en/java/javase/11/docs/api/${moduleMap[g1.replace(/\//g, '.')]}/${g1}/`);
			};
    case 12:
      return url => {
        if (url.includes('javafx')) {
          return url.replace(/^https?\:\/\/docs\.oracle\.com\/(?:javafx\/2|(?:en\/java\/)?javase\/(?:[89]|10|11)\/javafx)\/api\/(?:((?:java|jdk)\.(?:\w|\.)+)\/)?([a-z/]+)\//g, (_, g1, g2) => `https://openjfx.io/javadoc/12/${g1 || javaFxModuleMap[g2.replace(/\//g, '.')]}/${g2}/`);
        }
        return url.replace(/^https?\:\/\/docs\.oracle\.com\/(?:en\/java\/)?javase\/(?:[6789]|10|11|(?:1\.(?:(?:5\.0)|(?:4\.2)|[3])))\/docs\/api\/(?:((?:java|jdk)\.(?:\w|\.)+)\/)?([a-z/]+)\//g, (_, g1, g2) => `https://docs.oracle.com/en/java/javase/12/docs/api/${g1 || moduleMap[g2.replace(/\//g, '.')]}/${g2}/`);
      };
    case 13:
      return url => {
        if (url.includes('javafx')) {
          return url.replace(/^https?\:\/\/docs\.oracle\.com\/(?:javafx\/2|(?:en\/java\/)?javase\/(?:[89]|1[012])\/javafx)\/api\/(?:((?:java|jdk)\.(?:\w|\.)+)\/)?([a-z/]+)\//g, (_, g1, g2) => `https://openjfx.io/javadoc/13/${g1 || javaFxModuleMap[g2.replace(/\//g, '.')]}/${g2}/`);
        }
        return url.replace(/^https?\:\/\/docs\.oracle\.com\/(?:en\/java\/)?javase\/(?:[6789]|1[012]|(?:1\.(?:(?:5\.0)|(?:4\.2)|[3])))\/docs\/api\/(?:((?:java|jdk)\.(?:\w|\.)+)\/)?([a-z/]+)\//g, (_, g1, g2) => `https://docs.oracle.com/en/java/javase/13/docs/api/${g1 || moduleMap[g2.replace(/\//g, '.')]}/${g2}/`);
      };
    case 14:
      return url => {
        if (url.includes('javafx')) {
          return url.replace(/^https?\:\/\/docs\.oracle\.com\/(?:javafx\/2|(?:en\/java\/)?javase\/(?:[89]|1[0123])\/javafx)\/api\/(?:((?:java|jdk)\.(?:\w|\.)+)\/)?([a-z/]+)\//g, (_, g1, g2) => `https://openjfx.io/javadoc/14/${g1 || javaFxModuleMap[g2.replace(/\//g, '.')]}/${g2}/`);
        }
        return url.replace(/^https?\:\/\/docs\.oracle\.com\/(?:en\/java\/)?javase\/(?:[6789]|1[0123]|(?:1\.(?:(?:5\.0)|(?:4\.2)|[3])))\/docs\/api\/(?:((?:java|jdk)\.(?:\w|\.)+)\/)?([a-z/]+)\//g, (_, g1, g2) => `https://docs.oracle.com/en/java/javase/14/docs/api/${g1 || moduleMap[g2.replace(/\//g, '.')]}/${g2}/`);
      };
    case 15:
      return url => {
        if (url.includes('javafx')) {
          return url.replace(/^https?\:\/\/docs\.oracle\.com\/(?:javafx\/2|(?:en\/java\/)?javase\/(?:[89]|1[01234])\/javafx)\/api\/(?:((?:java|jdk)\.(?:\w|\.)+)\/)?([a-z/]+)\//g, (_, g1, g2) => `https://openjfx.io/javadoc/15/${g1 || javaFxModuleMap[g2.replace(/\//g, '.')]}/${g2}/`);
        }
        return url.replace(/^https?\:\/\/docs\.oracle\.com\/(?:en\/java\/)?javase\/(?:[6789]|1[01234]|(?:1\.(?:(?:5\.0)|(?:4\.2)|[3])))\/docs\/api\/(?:((?:java|jdk)\.(?:\w|\.)+)\/)?([a-z/]+)\//g, (_, g1, g2) => `https://docs.oracle.com/en/java/javase/15/docs/api/${g1 || moduleMap[g2.replace(/\//g, '.')]}/${g2}/`);
      };
    case 16:
      return url => {
        if (url.includes('javafx')) {
          return url.replace(/^https?\:\/\/docs\.oracle\.com\/(?:javafx\/2|(?:en\/java\/)?javase\/(?:[89]|1[012345])\/javafx)\/api\/(?:((?:java|jdk)\.(?:\w|\.)+)\/)?([a-z/]+)\//g, (_, g1, g2) => `https://openjfx.io/javadoc/16/${g1 || javaFxModuleMap[g2.replace(/\//g, '.')]}/${g2}/`);
        }
        return url.replace(/^https?\:\/\/docs\.oracle\.com\/(?:en\/java\/)?javase\/(?:[6789]|1[012345]|(?:1\.(?:(?:5\.0)|(?:4\.2)|[3])))\/docs\/api\/(?:((?:java|jdk)\.(?:\w|\.)+)\/)?([a-z/]+)\//g, (_, g1, g2) => `https://docs.oracle.com/en/java/javase/16/docs/api/${g1 || moduleMap[g2.replace(/\//g, '.')]}/${g2}/`);
      };
    case 17:
      return url => {
        if (url.includes('javafx')) {
          return url.replace(/^https?\:\/\/docs\.oracle\.com\/(?:javafx\/2|(?:en\/java\/)?javase\/(?:[89]|1[0123456])\/javafx)\/api\/(?:((?:java|jdk)\.(?:\w|\.)+)\/)?([a-z/]+)\//g, (_, g1, g2) => `https://openjfx.io/javadoc/17/${g1 || javaFxModuleMap[g2.replace(/\//g, '.')]}/${g2}/`);
        }
        return url.replace(/^https?\:\/\/docs\.oracle\.com\/(?:en\/java\/)?javase\/(?:[6789]|1[0123456]|(?:1\.(?:(?:5\.0)|(?:4\.2)|[3])))\/docs\/api\/(?:((?:java|jdk)\.(?:\w|\.)+)\/)?([a-z/]+)\//g, (_, g1, g2) => `https://docs.oracle.com/en/java/javase/17/docs/api/${g1 || moduleMap[g2.replace(/\//g, '.')]}/${g2}/`);
      };
    case 18:
      return url => {
        if (url.includes('javafx')) {
          return url.replace(/^https?\:\/\/docs\.oracle\.com\/(?:javafx\/2|(?:en\/java\/)?javase\/(?:[89]|1[01234567])\/javafx)\/api\/(?:((?:java|jdk)\.(?:\w|\.)+)\/)?([a-z/]+)\//g, (_, g1, g2) => `https://openjfx.io/javadoc/18/${g1 || javaFxModuleMap[g2.replace(/\//g, '.')]}/${g2}/`);
        }
        return url.replace(/^https?\:\/\/docs\.oracle\.com\/(?:en\/java\/)?javase\/(?:[6789]|1[01234567]|(?:1\.(?:(?:5\.0)|(?:4\.2)|[3])))\/docs\/api\/(?:((?:java|jdk)\.(?:\w|\.)+)\/)?([a-z/]+)\//g, (_, g1, g2) => `https://docs.oracle.com/en/java/javase/18/docs/api/${g1 || moduleMap[g2.replace(/\//g, '.')]}/${g2}/`);
      };
    case 19:
      return url => {
        if (url.includes('javafx')) {
          return url.replace(/^https?\:\/\/docs\.oracle\.com\/(?:javafx\/2|(?:en\/java\/)?javase\/(?:[89]|1[012345678])\/javafx)\/api\/(?:((?:java|jdk)\.(?:\w|\.)+)\/)?([a-z/]+)\//g, (_, g1, g2) => `https://openjfx.io/javadoc/19/${g1 || javaFxModuleMap[g2.replace(/\//g, '.')]}/${g2}/`);
        }
        return url.replace(/^https?\:\/\/docs\.oracle\.com\/(?:en\/java\/)?javase\/(?:[6789]|1[012345678]|(?:1\.(?:(?:5\.0)|(?:4\.2)|[3])))\/docs\/api\/(?:((?:java|jdk)\.(?:\w|\.)+)\/)?([a-z/]+)\//g, (_, g1, g2) => `https://docs.oracle.com/en/java/javase/19/docs/api/${g1 || moduleMap[g2.replace(/\//g, '.')]}/${g2}/`);
      };
    case 20:
      return url => {
        if (url.includes('javafx')) {
          return url.replace(/^https?\:\/\/docs\.oracle\.com\/(?:javafx\/2|(?:en\/java\/)?javase\/(?:[89]|1\d)\/javafx)\/api\/(?:((?:java|jdk)\.(?:\w|\.)+)\/)?([a-z/]+)\//g, (_, g1, g2) => `https://openjfx.io/javadoc/20/${g1 || javaFxModuleMap[g2.replace(/\//g, '.')]}/${g2}/`);
        }
        return url.replace(/^https?\:\/\/docs\.oracle\.com\/(?:en\/java\/)?javase\/(?:[6789]|1\d|(?:1\.(?:(?:5\.0)|(?:4\.2)|[3])))\/docs\/api\/(?:((?:java|jdk)\.(?:\w|\.)+)\/)?([a-z/]+)\//g, (_, g1, g2) => `https://docs.oracle.com/en/java/javase/20/docs/api/${g1 || moduleMap[g2.replace(/\//g, '.')]}/${g2}/`);
      };
    case 21:
      return url => {
        if (url.includes('javafx')) {
          return url.replace(/^https?\:\/\/docs\.oracle\.com\/(?:javafx\/2|(?:en\/java\/)?javase\/(?:[89]|1\d|20)\/javafx)\/api\/(?:((?:java|jdk)\.(?:\w|\.)+)\/)?([a-z/]+)\//g, (_, g1, g2) => `https://openjfx.io/javadoc/21/${g1 || javaFxModuleMap[g2.replace(/\//g, '.')]}/${g2}/`);
        }
        return url.replace(/^https?\:\/\/docs\.oracle\.com\/(?:en\/java\/)?javase\/(?:[6789]|1\d|20|(?:1\.(?:(?:5\.0)|(?:4\.2)|[3])))\/docs\/api\/(?:((?:java|jdk)\.(?:\w|\.)+)\/)?([a-z/]+)\//g, (_, g1, g2) => `https://docs.oracle.com/en/java/javase/21/docs/api/${g1 || moduleMap[g2.replace(/\//g, '.')]}/${g2}/`);
      };
    default:
      throw new Error(`Invalid version ${versionInt}`);
	}
};

browser.webRequest.onBeforeRequest.addListener(
	async details => {
		// Only redirect HTML
		if (!details.url.match(/\.html(?:#.*)?$/)) {
			return {};
		}
		const result = await browser.storage.sync.get();
		const replaceUrl = await getReplaceAlgorithm(result['java-version']);
		const redirectionTarget = replaceUrl(details.url);

		if (redirectionTarget !== details.url) {
			const response = await fetch(redirectionTarget, { method: 'HEAD' });
			if (response.ok && !response.redirected) {
			  return { redirectUrl: redirectionTarget };
			}
		}
		return {};
	},
	{
		urls: ['*://docs.oracle.com/*'],
		types: ['main_frame', 'sub_frame']
	},
	['blocking']
);

/*
Execute on https://docs.oracle.com/javase/10/docs/api/module-overview-frame.html
to get module JSON for java 10:

JSON.stringify((await Promise.all(Array.prototype.map.call(document.querySelectorAll('body > main > ul > li > a'), async a => {
  const response = await fetch(a.href);
  const dummyElement = document.createElement('html');
  dummyElement.innerHTML = await response.text();
  return Array.prototype.map.call(dummyElement.querySelectorAll('main > ul > li > a'), p => ({ package: p.innerHTML, module: a.innerHTML }));
}))).flatMap(a => a));

Execute on https://docs.oracle.com/en/java/javase/11/docs/api/allpackages-index.html
to get module JSON for java 11:

JSON.stringify((await Promise.all(Array.prototype.map.call(document.querySelectorAll('main > div > ul > li > table > tbody > tr > th > a'), async a => {
  const response = await fetch(a.href);
  const dummyElement = document.createElement('html');
  dummyElement.innerHTML = await response.text();
  return { package: a.innerHTML, module: dummyElement.querySelector('main > div > div > a').innerHTML };
}))));

Execute on https://docs.oracle.com/en/java/javase/12/docs/api/allpackages-index.html
to get module JSON for java 12 (works for 13/14/15 too with updated URL):

JSON.stringify((await Promise.all(Array.prototype.map.call(document.querySelectorAll('tr > th > a'), async a => {
  const response = await fetch(a.href);
  const dummyElement = document.createElement('html');
  dummyElement.innerHTML = await response.text();
  return { package: a.innerHTML, module: dummyElement.querySelector('main > div > div > a').innerHTML };
}))));

Execute on https://docs.oracle.com/en/java/javase/16/docs/api/allpackages-index.html
to get module JSON for java 16 (works for 17-21 too with updated URL):

JSON.stringify((await Promise.all(Array.prototype.map.call(document.querySelectorAll('div.col-first > a'), async a => {
  const response = await fetch(a.href);
  const dummyElement = document.createElement('html');
  dummyElement.innerHTML = await response.text();
  return { package: a.innerHTML, module: dummyElement.querySelector('main > div > div > a').innerHTML };
}))));
*/
