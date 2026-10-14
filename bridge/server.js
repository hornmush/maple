import http from 'node:http';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
const PORT=8787, HOST='127.0.0.1';
const client=new Client({name:'mvp-lab-bridge',version:'0.1.0'});
let ready=false, tools=[], lastError='';
async function connect(){
 try{
  const transport=new StdioClientTransport({command:process.platform==='win32'?'cmd':'npx',args:process.platform==='win32'?['/c','npx','-y','maple-auction-mcp']:['-y','maple-auction-mcp'],stderr:'pipe'});
  transport.stderr?.on('data',chunk=>console.error('[MCP]',String(chunk).trim()));
  await client.connect(transport);
  tools=(await client.listTools()).tools.map(t=>({name:t.name,description:t.description,inputSchema:t.inputSchema}));
  ready=true;console.log('MCP 연결 성공:',tools.map(t=>t.name).join(', '));
 }catch(e){lastError=String(e);console.error('MCP 연결 실패:',lastError)}
}
const allowed=new Set(['https://maple-delta-two.vercel.app','http://localhost:3000','http://127.0.0.1:8787']);
const server=http.createServer(async(req,res)=>{
 const origin=req.headers.origin;
 if(origin&&allowed.has(origin)){res.setHeader('Access-Control-Allow-Origin',origin);res.setHeader('Vary','Origin')}
 res.setHeader('Content-Type','application/json; charset=utf-8');
 if(req.method==='OPTIONS'){res.setHeader('Access-Control-Allow-Methods','GET,OPTIONS');res.setHeader('Access-Control-Allow-Headers','Content-Type');res.writeHead(204);return res.end()}
 if(origin&&!allowed.has(origin)){res.writeHead(403);return res.end(JSON.stringify({error:'Origin not allowed'}))}
 if(req.method!=='GET'){res.writeHead(405);return res.end(JSON.stringify({error:'Method not allowed'}))}
 if(req.url==='/health'||req.url==='/'){return res.end(JSON.stringify({bridge:'running',mcpConnected:ready,tools:tools.map(t=>t.name),error:lastError}))}
 if(req.url==='/tools'){return res.end(JSON.stringify({mcpConnected:ready,tools,error:lastError}))}
 res.writeHead(404);res.end(JSON.stringify({error:'Unknown endpoint'}));
});
server.listen(PORT,HOST,()=>{console.log('MVP LAB bridge: http://'+HOST+':'+PORT+'/health');connect()});
