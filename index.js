const ACAO = "http://127.0.0.1:5500";

async function handleRequest(req) {
  const resError = (msg) => {
    const res = JSON.stringify(msg);
    return new Response(res, {
      headers: {
        "Access-Control-Allow-Origin": ACAO,
        "content-type": "application/json; charset=utf-8",
      }
    });
  };

  if (req.method !== "POST") {
    resError({ message: "A method should be POST" });
  }

  const params = await req.json();

  const headers = {};
  if (params.headers) {
    for (const [key, value] of Object.entries(params.headers)) {
      headers[key] = value;
    }
  }

  let apiRes;
  if (params.method === "GET") {
    const query = new URLSearchParams(params.query);
    apiRes = await fetch(`${params.url}?${query}`, headers);
  } else if (params.method === "POST") {
    const options = {
      method: "POST",
      headers: headers,
      body: JSON.stringify(params.body)
    };
    apiRes = await fetch(params.url, options);
  } else {
    resError({ message: 'A method in body should be GET or POST' });
  }

  if (apiRes.ok) {
    const json = await apiRes.json();
    const res = JSON.stringify(json);
    return new Response(res, {
      headers: {
        "Access-Control-Allow-Origin": ACAO,
        "content-type": "application/json; charset=utf-8",
      }
    });
  } else {
    console.log("API response error:");
    console.log(apiRes);
    resError(apiRes);
  }
}

// fetchで待機
addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request));
});