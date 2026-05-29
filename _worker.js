export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    
    // CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Max-Age": "86400"
        }
      });
    }

    const headers = {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Cookie": env.ZHIHU_COOKIE || "",
      "Accept": "application/json"
    };

    // 1. Answer Route: /answer/:id
    const answerMatch = path.match(/^\/answer\/(\d+)/);
    if (answerMatch) {
      const answerId = answerMatch[1];
      const zhihuUrl = `https://www.zhihu.com/api/v4/answers/${answerId}?include=content`;
      try {
        const res = await fetch(zhihuUrl, { headers });
        const data = await res.json();
        return new Response(JSON.stringify(data), {
          status: res.status,
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Access-Control-Allow-Origin": "*"
          }
        });
      } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), {
          status: 500,
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
        });
      }
    }

    // 2. Article Route: /article/:id
    const articleMatch = path.match(/^\/article\/(\d+)/);
    if (articleMatch) {
      const articleId = articleMatch[1];
      const zhihuUrl = `https://zhuanlan.zhihu.com/api/articles/${articleId}`;
      try {
        const res = await fetch(zhihuUrl, { headers });
        const data = await res.json();
        return new Response(JSON.stringify(data), {
          status: res.status,
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Access-Control-Allow-Origin": "*"
          }
        });
      } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), {
          status: 500,
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
        });
      }
    }

    // 3. Default Route
    return new Response(JSON.stringify({
      message: "Zhihu Cookie Proxy Worker is running!",
      usage: {
        answer: "/answer/{answer_id}",
        article: "/article/{article_id}"
      }
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
};
