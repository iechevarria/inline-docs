const addEmbeddedDocs = () => {
  let repoURI = window.location.pathname.substring(1);
  repoURI = repoURI.endsWith('/') ? repoURI.slice(0, -1) : repoURI;
  console.log(repoURI);
  let table = document.querySelector('.file').getElementsByTagName("TABLE")[0];
  tds = table.getElementsByTagName("TD")
  for (let i = 0; i < tds.length; i++) {
    if (tds[i].innerHTML.match(/\[!!\ .*\ !!\]/)) {
      let url = tds[i].innerHTML.split("[!! ")[1].split(" !!]")[0];
      console.log(url);
      makeCorsRequest(tds[i]);
    }
  }
}

// [!! docs/sample.md !!]

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
}

const makeCorsRequest = (node) => {
  let url = 'https://api.github.com/repos/iechevarria/pong-js/readme';
  let xhr = createCORSRequest('GET', url);
  if (!xhr) {
    alert('CORS not supported');
    return;
  }

  xhr.onload = function() {
    let pt1 = '<tr><td></td><td><div style="margin-top: 1em; margin-bottom: 1em; padding: 2em 2em 2em 2em; margin-right: 2em; box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19); max-width: 900px;">';
    let pt2 = '</div></td></tr>';
    let obj = micromarkdown.parse(atob(JSON.parse(this.responseText).content));
    node.parentNode.insertAdjacentHTML('afterend', pt1 + obj + pt2);
  };

  xhr.onerror = function() {
    alert('Error making the request.');
  };

  xhr.send();
}

// [!! README.md !!]

document.addEventListener("pjax:end", addEmbeddedDocs());
