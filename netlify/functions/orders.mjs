import { getStore } from "@netlify/blobs";

function respond(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {"Content-Type":"application/json","Cache-Control":"no-store"}
  });
}
function authorized(request) {
  const expected = process.env.OWNER_DASHBOARD_KEY || "";
  const supplied = request.headers.get("x-owner-key") || "";
  return Boolean(expected && supplied && expected === supplied);
}

export default async (request) => {
  const url = new URL(request.url);

  if (request.method === "GET" && url.searchParams.get("health") === "1") {
    return respond(200,{
      ok:true,
      ownerKeyConfigured:Boolean(process.env.OWNER_DASHBOARD_KEY),
      storage:"Netlify Blobs"
    });
  }

  if (!authorized(request)) return respond(401,{error:"Unauthorized"});

  const store = getStore("heart-and-soul-orders");

  try {
    if (request.method === "GET") {
      let index = [];
      try {
        index = await store.get("order-index",{type:"json"}) || [];
        if (!Array.isArray(index)) index = [];
      } catch {}

      const orders = (await Promise.all(index.slice(0,500).map(async orderNumber=>{
        try { return await store.get(`order:${orderNumber}`,{type:"json"}); }
        catch { return null; }
      }))).filter(Boolean).sort((a,b)=>String(b.createdAt||"").localeCompare(String(a.createdAt||"")));

      return respond(200,{orders});
    }

    if (request.method === "POST") {
      const body = await request.json();
      const orderNumber = String(body.orderNumber||"").trim();
      const status = String(body.status||"").trim();
      const allowed = ["New","Design Approved","In Production","Ready for Pickup","Completed","Cancelled"];
      if (!orderNumber || !allowed.includes(status)) return respond(400,{error:"Invalid status update."});

      const order = await store.get(`order:${orderNumber}`,{type:"json"});
      if (!order) return respond(404,{error:"Order not found."});
      order.status = status;
      order.statusUpdatedAt = new Date().toISOString();
      await store.setJSON(`order:${orderNumber}`,order);
      return respond(200,{ok:true,orderNumber,status});
    }

    return respond(405,{error:"Method not allowed."});
  } catch (err) {
    console.error(err);
    return respond(500,{error:err?.message||"Could not load orders."});
  }
};
