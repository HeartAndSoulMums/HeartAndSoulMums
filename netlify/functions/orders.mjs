import { getStore } from "@netlify/blobs";

function respond(status,body){
  return new Response(JSON.stringify(body),{
    status,
    headers:{"Content-Type":"application/json","Cache-Control":"no-store"}
  });
}
function validKey(supplied){
  const expected=process.env.OWNER_DASHBOARD_KEY||"";
  return Boolean(expected && supplied && expected===supplied);
}
async function deadline(promise,ms,label){
  let timer;
  try{
    return await Promise.race([
      promise,
      new Promise((_,reject)=>{
        timer=setTimeout(()=>reject(new Error(`${label} timed out after ${ms/1000} seconds.`)),ms);
      })
    ]);
  }finally{
    if(timer)clearTimeout(timer);
  }
}
function store(){
  return getStore("heart-and-soul-orders");
}

async function readJSON(store, key){
  return await store.get(key, {type:"json", consistency:"strong"});
}

export default async(request)=>{
  const url=new URL(request.url);

  if(request.method==="GET"&&url.searchParams.get("health")==="1"){
    return respond(200,{
      ok:true,
      ownerKeyConfigured:Boolean(process.env.OWNER_DASHBOARD_KEY),
      storage:"Netlify Blobs",
      build:"STORAGE-FIX-LIST-PREFIX"
    });
  }

  if(request.method==="GET"&&url.searchParams.get("storageTest")==="1"){
    try{
      const s=store();
      const result=await deadline(s.list({prefix:"order:"}),6000,"Storage list");
      const blobs=result.blobs||[];
      let firstRead=null;
      if(blobs.length){
        const value=await deadline(readJSON(s,blobs[0].key),6000,"Storage read");
        firstRead=value ? {
          ok:true,
          orderNumber:value.orderNumber||null,
          studentName:value.data?.studentName||null
        } : {ok:false};
      }
      return respond(200,{
        ok:true,
        blobCount:blobs.length,
        firstRead,
        build:"LOGIN-FIX"
      });
    }catch(err){
      return respond(500,{ok:false,error:err?.message||"Storage test failed.",build:"LOGIN-FIX"});
    }
  }

  const s=store();

  try{
    if(request.method==="POST"){
      const body=await request.json();
      if(!validKey(String(body.ownerKey||""))) return respond(401,{error:"Unauthorized"});

      if(body.action==="list"){
        const listed=await deadline(s.list({prefix:"order:"}),6000,"Order list");
      const blobs=(listed.blobs||[]).slice(0,500);

      const results=[];
      // Read sequentially in small batches to avoid overwhelming storage.
      for(let i=0;i<blobs.length;i+=20){
        const batch=blobs.slice(i,i+20);
        const values=await deadline(
          Promise.all(batch.map(async b=>{
            try{return await readJSON(s,b.key);}catch{return null;}
          })),
          7000,
          "Order read"
        );
        results.push(...values.filter(Boolean));
      }

        results.sort((a,b)=>String(b.createdAt||"").localeCompare(String(a.createdAt||"")));
        return respond(200,{orders:results,build:"LOGIN-FIX"});
      }

      if(body.action==="photo"){
        const orderNumber=String(body.orderNumber||"").trim();
        if(!orderNumber)return respond(400,{error:"Missing order number."});

        const key=`photo:${orderNumber}`;
        const base64=await deadline(s.get(key,{type:"text",consistency:"strong"}),6000,"Photo read");
        if(!base64)return respond(404,{error:"Photo not found."});

        const entry=await deadline(s.getMetadata(key),6000,"Photo metadata");
        const contentType=entry?.metadata?.contentType||"image/jpeg";
        return respond(200,{
          ok:true,
          dataUrl:`data:${contentType};base64,${base64}`,
          fileName:entry?.metadata?.fileName||""
        });
      }

      if(body.action!=="status") return respond(400,{error:"Invalid action."});
      const orderNumber=String(body.orderNumber||"").trim();
      const status=String(body.status||"").trim();
      const allowed=["New","Design Approved","In Production","Ready for Pickup","Completed","Cancelled"];
      if(!orderNumber||!allowed.includes(status))return respond(400,{error:"Invalid status update."});

      const key=`order:${orderNumber}`;
      const order=await deadline(readJSON(s,key),6000,"Order status read");
      if(!order)return respond(404,{error:"Order not found."});

      order.status=status;
      order.statusUpdatedAt=new Date().toISOString();
      await deadline(s.setJSON(key,order),6000,"Order status save");
      return respond(200,{ok:true,orderNumber,status});
    }

    return respond(405,{error:"Method not allowed."});
  }catch(err){
    console.error("orders",err);
    return respond(500,{error:err?.message||"Could not load orders."});
  }
};
