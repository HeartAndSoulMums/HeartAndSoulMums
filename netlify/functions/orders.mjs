import { getStore } from "@netlify/blobs";

const API = "https://api.netlify.com/api/v1";

function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store"
    },
    body: JSON.stringify(body)
  };
}

function isAuthorized(event) {
  const expected = process.env.OWNER_DASHBOARD_KEY;
  const supplied = event.headers["x-owner-key"] || event.headers["X-Owner-Key"];
  return Boolean(expected && supplied && supplied === expected);
}

async function netlifyFetch(path) {
  const token = process.env.NETLIFY_ACCESS_TOKEN;
  if (!token) throw new Error("NETLIFY_ACCESS_TOKEN is not configured.");
  const response = await fetch(`${API}${path}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Netlify API ${response.status}: ${text.slice(0, 300)}`);
  }
  return response.json();
}

async function getFormId() {
  if (process.env.MUM_ORDER_FORM_ID) return process.env.MUM_ORDER_FORM_ID;

  const siteId = process.env.SITE_ID;
  if (!siteId) throw new Error("SITE_ID or MUM_ORDER_FORM_ID must be configured.");

  const forms = await netlifyFetch(`/sites/${encodeURIComponent(siteId)}/forms`);
  const form = forms.find(f => f.name === "mum-order");
  if (!form) throw new Error('Could not find a Netlify form named "mum-order".');
  return form.id;
}

async function readStatuses(orderNumbers) {
  const store = getStore("heart-and-soul-order-status");
  const pairs = await Promise.all(orderNumbers.map(async (orderNo) => {
    if (!orderNo) return [orderNo, null];
    try {
      return [orderNo, await store.get(orderNo, { type: "json" })];
    } catch {
      return [orderNo, null];
    }
  }));
  return Object.fromEntries(pairs);
}

export default async (request, context) => {
  const event = {
    headers: Object.fromEntries(request.headers.entries())
  };

  if (!isAuthorized(event)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" }
    });
  }

  try {
    if (request.method === "GET") {
      const formId = await getFormId();
      const submissions = await netlifyFetch(`/forms/${encodeURIComponent(formId)}/submissions`);

      const orders = submissions.map(s => ({
        id: s.id,
        created_at: s.created_at,
        data: s.data || {}
      }));

      let statuses = {};
      try {
        statuses = await readStatuses(
          orders.map(o => o.data.orderNumber || o.id)
        );
      } catch (statusError) {
        console.warn("Status storage unavailable; continuing with New status.", statusError);
      }

      for (const order of orders) {
        const orderNo = order.data.orderNumber || order.id;
        order.status = statuses[orderNo]?.status || "New";
        order.statusUpdatedAt = statuses[orderNo]?.updatedAt || null;
      }

      return new Response(JSON.stringify({ orders }), {
        status: 200,
        headers: { "Content-Type": "application/json", "Cache-Control": "no-store" }
      });
    }

    if (request.method === "POST") {
      const payload = await request.json();
      const orderNumber = String(payload.orderNumber || "").trim();
      const status = String(payload.status || "").trim();
      const allowed = ["New", "Design Approved", "In Production", "Ready for Pickup", "Completed", "Cancelled"];

      if (!orderNumber || !allowed.includes(status)) {
        return new Response(JSON.stringify({ error: "Invalid status update" }), {
          status: 400,
          headers: { "Content-Type": "application/json" }
        });
      }

      const store = getStore("heart-and-soul-order-status");
      await store.setJSON(orderNumber, {
        status,
        updatedAt: new Date().toISOString()
      });

      return new Response(JSON.stringify({ ok: true, orderNumber, status }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message || "Server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" }
    });
  }
};
