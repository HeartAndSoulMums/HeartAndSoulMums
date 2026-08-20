import { getStore } from "@netlify/blobs";

function respond(status,body){
  return new Response(JSON.stringify(body),{
    status,
    headers:{"Content-Type":"application/json","Cache-Control":"no-store"}
  });
}
function authorized(request){
  const expected=process.env.OWNER_DASHBOARD_KEY||"";
  const supplied=request.headers.get("x-owner-key")||"";
  return Boolean(expected&&supplied&&expected===supplied);
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
        build:"JSON-READ-FIX"
      });
    }catch(err){
      return respond(500,{ok:false,error:err?.message||"Storage test failed.",build:"JSON-READ-FIX"});
    }
  }

  if(!authorized(request))return respond(401,{error:"Unauthorized"});
  const s=store();

  try{
    if(request.method==="GET"){
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
      return respond(200,{orders:results});
    }

    if(request.method==="POST"){
      const body=await request.json();
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
