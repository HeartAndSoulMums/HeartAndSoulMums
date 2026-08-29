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
function parsePhotoDataUrl(v){
  const s=String(v||"");
  const m=s.match(/^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/);
  if(!m)return null;
  if(m[2].length>8_000_000)throw new Error("Uploaded photo is too large.");
  return {contentType:m[1],base64:m[2]};
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
        package:clean(body.package,100),
        baseLength:clean(body.baseLength,100),
        length:clean(body.length,100), fullness:clean(body.fullness,100),
        primaryColor:clean(body.primaryColor,40), primaryColorName:clean(body.primaryColorName,100),
        secondaryColor:clean(body.secondaryColor,40), secondaryColorName:clean(body.secondaryColorName,100),
        thirdColor:clean(body.thirdColor,40), thirdColorName:clean(body.thirdColorName,100),
        accentColor:clean(body.accentColor,40), accentColorName:clean(body.accentColorName,100),
        style:clean(body.style,100),
        studentName, ribbonName:clean(body.ribbonName,150),
        schoolRibbonText:clean(body.schoolRibbonText,200),
        grade:clean(body.grade,80), gradYear:clean(body.gradYear,40),
        homecomingDate:clean(body.homecomingDate,40), activities:clean(body.activities),
        quote:clean(body.quote,1000),
        addons:Array.isArray(body.addons)?body.addons.slice(0,30).map(x=>clean(x,200)):[],
        ledColor:clean(body.ledColor,40), ledColorName:clean(body.ledColorName,100),
        charmDetails:clean(body.charmDetails,2000),
        stuffedAnimalDetails:clean(body.stuffedAnimalDetails,2000),
        extraWordQty:Number(body.extraWordQty||0),
        extraWordsText:clean(body.extraWordsText,2000),
        braid:clean(body.braid,200), printedRibbon:clean(body.printedRibbon,200),
        ribbonText:clean(body.ribbonText,1000), instructions:clean(body.instructions,8000),
        inspirationCount:Math.min(3,Number(body.inspirationCount||0)),
        hasInspirationPhotos:Array.isArray(body.inspirationImages) && body.inspirationImages.length>0,
        customerName, phone:clean(body.phone,80), email:clean(body.email,250),
        contactMethod:clean(body.contactMethod,80), estimatedTotal:Number(body.estimatedTotal||0),
        promoCodeApplied:clean(body.promoCodeApplied,100),
        referralStudent:clean(body.referralStudent,200),
        referralSchool:clean(body.referralSchool,200),
        photoAddonFile:clean(body.photoAddonFile,300),
        hasPhoto:Boolean(body.photoDataUrl)
      }
    };

    const store=getStore("heart-and-soul-orders");

    const photo=parsePhotoDataUrl(body.photoDataUrl);
    if(photo){
      await store.set(`photo:${orderNumber}`,photo.base64,{
        metadata:{contentType:photo.contentType,fileName:clean(body.photoAddonFile,300)}
      });
    }

    const inspirationItems=Array.isArray(body.inspirationImages)?body.inspirationImages.slice(0,3):[];
    let inspirationStored=0;
    for(let i=0;i<inspirationItems.length;i++){
      const item=inspirationItems[i]||{};
      const parsed=parsePhotoDataUrl(item.dataUrl);
      if(!parsed)continue;
      await store.set(`inspiration:${orderNumber}:${i}`,parsed.base64,{
        metadata:{
          contentType:parsed.contentType,
          fileName:clean(item.fileName,300),
          index:i
        }
      });
      inspirationStored++;
    }

    order.data.inspirationCount=inspirationStored;
    order.data.hasInspirationPhotos=inspirationStored>0;

    await store.setJSON(`order:${orderNumber}`,order);

    return respond(200,{
      ok:true,
      orderNumber,
      photoStored:Boolean(photo),
      inspirationStored
    });
  }catch(err){
    console.error("save-order",err);
    return respond(500,{error:err?.message||"Could not save order."});
  }
};
