import { getStore } from "@netlify/blobs";

function respond(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {"Content-Type":"application/json","Cache-Control":"no-store"}
  });
}
function clean(v, max=5000) {
  return String(v ?? "").slice(0, max);
}

export default async (request) => {
  if (request.method !== "POST") return respond(405,{error:"Method not allowed"});
  try {
    const body = await request.json();
    if (body.botField) return respond(200,{ok:true});

    const orderNumber=clean(body.orderNumber,80).trim();
    const customerName=clean(body.customerName,200).trim();
    const studentName=clean(body.studentName,200).trim();
    if(!orderNumber||!customerName||!studentName){
      return respond(400,{error:"Missing required order information."});
    }

    const order={
      orderNumber,
      createdAt:new Date().toISOString(),
      status:"New",
      paymentStatus:"Pending checkout",
      data:{
        package:clean(body.package,100), size:clean(body.size,100),
        length:clean(body.length,100), fullness:clean(body.fullness,100),
        primaryColor:clean(body.primaryColor,40), primaryColorName:clean(body.primaryColorName,100),
        secondaryColor:clean(body.secondaryColor,40), secondaryColorName:clean(body.secondaryColorName,100),
        accentColor:clean(body.accentColor,100), style:clean(body.style,100),
        studentName, nickname:clean(body.nickname,150), school:clean(body.school,200),
        mascot:clean(body.mascot,150), grade:clean(body.grade,80),
        gradYear:clean(body.gradYear,40), number:clean(body.number,40),
        homecomingDate:clean(body.homecomingDate,40), activities:clean(body.activities),
        favorites:clean(body.favorites), song:clean(body.song,500),
        quote:clean(body.quote,1000), specialDate:clean(body.specialDate,500),
        addons:Array.isArray(body.addons)?body.addons.slice(0,30).map(x=>clean(x,200)):[],
        braid:clean(body.braid,200), printedRibbon:clean(body.printedRibbon,200),
        ribbonText:clean(body.ribbonText,1000), instructions:clean(body.instructions,8000),
        inspirationCount:Number(body.inspirationCount||0),
        customerName, phone:clean(body.phone,80), email:clean(body.email,250),
        contactMethod:clean(body.contactMethod,80), estimatedTotal:Number(body.estimatedTotal||0),
        promoCodeApplied:clean(body.promoCodeApplied,100),
        referralStudent:clean(body.referralStudent,200),
        referralSchool:clean(body.referralSchool,200)
      }
    };

    const store=getStore({name:"heart-and-soul-orders",consistency:"strong"});
    await store.setJSON(`order:${orderNumber}`,order);

    return respond(200,{ok:true,orderNumber});
  }catch(err){
    console.error("save-order",err);
    return respond(500,{error:err?.message||"Could not save order."});
  }
};
