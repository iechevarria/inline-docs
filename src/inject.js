// [!!~ README.md ~!!]

const addEmbeddedDocs = () => {
  let repoURL = window.location.pathname.substring(1).split('/');
  let user = repoURL[0];
  let repo = repoURL[1];
  let branch = repoURL[3];
  try { 
    let table = document.querySelector('.file').getElementsByTagName("TABLE")[0]; 
    let tableEntries = table.getElementsByTagName("TD")
    for (let i = 0; i < tableEntries.length; i++) {
      if (tableEntries[i].innerHTML.match(/\[!!\~.*\~!!\]/)) { // look for link
        let path = (tableEntries[i].innerHTML.split("[!!\~")[1].split("\~!!]")[0]).replace(/^\s+|\s+$/g, ''); // get, strip link
        if (path.endsWith('.md')) {
          makeCorsRequest(user, repo, path, branch, tableEntries[i]);
        }
      }
    }
  } catch (TypeError) {
    console.log('No code on this page');
  }
};

// [!!~ docs/sample.md ~!!]

//https://www.html5rocks.com/en/tutorials/cors/
const createCORSRequest = (method, url) => {
  let xhr = new XMLHttpRequest();
  if ("withCredentials" in xhr) {
    xhr.open(method, url, true);
  } else if (typeof XDomainRequest != "undefined") {
    xhr = new XDomainRequest();
    xhr.open(method, url);
  } else {
    xhr = null;
  }
  return xhr;
};

const makeCorsRequest = (user, repo, path, branch, node) => {
  console.log('Finding ' + path +  ' in ' + user + '\'s repo ' + repo);
  let url = 'https://api.github.com/repos/' + user + '/' + repo + '/contents/' + path;
  let xhr = createCORSRequest('GET', url);
  if (!xhr) {
    alert('CORS not supported');
    return;
  }

  xhr.onload = function() {
    let pt1 = '<tr><td></td><td><div style="margin-top: 1em; margin-bottom: 1em; padding: 2em 2em 2em 2em; margin-right: 2em; box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19); max-width: 900px;">';
    let pt2 = '</div></td></tr>';
    console.log(path.split('/'));
    let obj = micromarkdown.parse(atob(JSON.parse(this.responseText).content));
    obj = obj.replace(/<img src="*"/g, function (x) {
      return x + 'https://raw.githubusercontent.com/' + user + '/' + repo + '/' + branch + '/' + path.split('/').slice(0, -1).join('/') + '/'; //https://stackoverflow.com/questions/3214409/javascript-get-all-but-last-item-in-array
    });
    obj = obj.replace(/<img\ /g, function (x) {
      return x + 'style="max-width: 100%;"';
    });
    console.log(obj);
    node.parentNode.insertAdjacentHTML('afterend', pt1 + obj + pt2);
    console.log(path + ' successfully embedded in GitHub repo');
  };

  xhr.onerror = function() {
    alert('Error making the request.');
  };

  xhr.send();
};

addEmbeddedDocs();
