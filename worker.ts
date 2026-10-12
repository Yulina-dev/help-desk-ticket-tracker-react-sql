import {z} from 'zod';
interface Env {DB:D1Database;ASSETS:Fetcher}
async function tickets(request:Request,db:D1Database) {
 await db.prepare('CREATE TABLE IF NOT EXISTS tickets (id TEXT PRIMARY KEY NOT NULL,title TEXT NOT NULL,category TEXT NOT NULL,priority TEXT NOT NULL,status TEXT NOT NULL,created_at INTEGER NOT NULL)').run();
 const ticketDb=()=>db;
const status = z.enum(['Open', 'In progress', 'Resolved']);
const input = z.object({title:z.string().trim().min(1).max(120),category:z.enum(['Hardware','Software','Network','Account access','Other']),priority:z.enum(['Low','Medium','High']),status});
const fields = 'id, title, category, priority, status, created_at AS createdAt';
function failure(e: unknown) {
  console.error('Ticket API failed', e);
  return Response.json({error:'Unable to access tickets. Please try again.'},{status:503});
}
function sameOrigin(request: Request) {
  const origin=request.headers.get('origin');
  return !origin || origin === new URL(request.url).origin;
}
async function GET() {
  try {
    const rows=await ticketDb().prepare(`SELECT ${fields} FROM tickets ORDER BY created_at DESC, id DESC`).all();
    return Response.json({tickets:rows.results},{headers:{'Cache-Control':'no-store'}});
  } catch(e) { return failure(e); }
}
async function POST(request:Request) {
  if(!sameOrigin(request)) return Response.json({error:'Invalid request origin'},{status:403});
  let parsed;
  try { parsed=input.safeParse(await request.json()); } catch {return Response.json({error:'Invalid JSON'},{status:400});}
  if(!parsed.success) return Response.json({error:'Enter a title and valid ticket details.'},{status:400});
  try {
    const p=parsed.data;
    const ticket={id:crypto.randomUUID(),...p,createdAt:Date.now()};
    await ticketDb().prepare('INSERT INTO tickets (id,title,category,priority,status,created_at) VALUES (?,?,?,?,?,?)').bind(ticket.id,p.title,p.category,p.priority,p.status,ticket.createdAt).run();
    return Response.json({ticket},{status:201});
  } catch(e) { return failure(e); }
}
async function PATCH(request:Request) {
  if(!sameOrigin(request)) return Response.json({error:'Invalid request origin'},{status:403});
  let p;
  try {p=z.object({id:z.string().uuid(),status}).safeParse(await request.json());}catch{return Response.json({error:'Invalid JSON'},{status:400});}
  if(!p.success) return Response.json({error:'Invalid ticket or status'},{status:400});
  try {
    const row=await ticketDb().prepare(`UPDATE tickets SET status=? WHERE id=? RETURNING ${fields}`).bind(p.data.status,p.data.id).first();
    if(!row)return Response.json({error:'Ticket no longer exists'},{status:404});
    return Response.json({ticket:row});
  } catch(e) {return failure(e);}
}
async function DELETE(request:Request) {
  if(!sameOrigin(request))return Response.json({error:'Invalid request origin'},{status:403});
  let p;
  try{p=z.object({id:z.string().uuid()}).safeParse(await request.json());}catch{return Response.json({error:'Invalid JSON'},{status:400});}
  if(!p.success)return Response.json({error:'Invalid ticket'},{status:400});
  try{
    const row=await ticketDb().prepare('DELETE FROM tickets WHERE id=? RETURNING id').bind(p.data.id).first();
    if(!row)return Response.json({error:'Ticket no longer exists'},{status:404});
    return Response.json({deleted:p.data.id});
  }catch(e){return failure(e);}
}

 switch(request.method){case 'GET':return GET();case 'POST':return POST(request);case 'PATCH':return PATCH(request);case 'DELETE':return DELETE(request);default:return Response.json({error:'Method not allowed'},{status:405,headers:{Allow:'GET, POST, PATCH, DELETE'}});}
}
export default {async fetch(request:Request,env:Env):Promise<Response>{
 if(new URL(request.url).pathname==='/api/tickets'){try{return await tickets(request,env.DB);}catch(error){console.error('Database unavailable',error);return Response.json({error:'Unable to access tickets. Please try again.'},{status:503});}}
 return env.ASSETS.fetch(request);
}};
