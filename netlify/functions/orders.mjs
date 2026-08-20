const API = "https://api.netlify.com/api/v1";

function response(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store"
    }
  });
}

function authorized(request) {
  const expected = process.env.OWNER_DASHBOARD_KEY || "";
  const supplied = request.headers.get("x-owner-key") || "";
  return Boolean(expected && supplied && expected === supplied);
}

async function fetchWithTimeout(url, options = {}, ms = 8000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

export default async (request) => {
  const url = new URL(request.url);

  if (request.method === "GET" && url.searchParams.get("health") === "1") {
    return response(200, {
      ok: true,
      ownerKeyConfigured: Boolean(process.env.OWNER_DASHBOARD_KEY),
      accessTokenConfigured: Boolean(process.env.NETLIFY_ACCESS_TOKEN),
      formIdConfigured: Boolean(process.env.MUM_ORDER_FORM_ID)
    });
  }

  if (!authorized(request)) {
    return response(401, { error: "Unauthorized" });
  }

  if (request.method === "GET" && url.searchParams.get("ping") === "1") {
    return response(200, { ok: true, authenticated: true });
  }

  if (request.method !== "GET") {
    return response(405, { error: "Only order viewing is enabled in this version." });
  }

  const token = process.env.NETLIFY_ACCESS_TOKEN;
  const formId = process.env.MUM_ORDER_FORM_ID;

  if (!token) return response(500, { error: "NETLIFY_ACCESS_TOKEN is missing." });
  if (!formId) return response(500, { error: "MUM_ORDER_FORM_ID is missing." });

  try {
    const apiResponse = await fetchWithTimeout(
      `${API}/forms/${encodeURIComponent(formId)}/submissions`,
      { headers: { Authorization: `Bearer ${token}` } },
      8000
    );

    const raw = await apiResponse.text();

    if (!apiResponse.ok) {
      let detail = raw;
      try {
        const parsed = JSON.parse(raw);
        detail = parsed.message || parsed.error || raw;
      } catch {}
      return response(apiResponse.status, {
        error: `Netlify order API returned ${apiResponse.status}: ${String(detail).slice(0, 220)}`
      });
    }

    let submissions;
    try {
      submissions = JSON.parse(raw);
    } catch {
      return response(500, { error: "Netlify returned unreadable order data." });
    }

    const orders = (Array.isArray(submissions) ? submissions : []).map(s => ({
      id: s.id,
      created_at: s.created_at,
      status: "New",
      data: s.data || {}
    }));

    return response(200, { orders });
  } catch (err) {
    if (err?.name === "AbortError") {
      return response(504, { error: "Netlify's order API timed out after 8 seconds." });
    }
    console.error("orders function error", err);
    return response(500, { error: err?.message || "Could not retrieve orders." });
  }
};
