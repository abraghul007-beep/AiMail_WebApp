require('dotenv').config();
const express = require('express');
const session = require('express-session');
const { google } = require('googleapis');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(session({ secret: process.env.SESSION_SECRET || 'dev-secret-change-me', resave:false, saveUninitialized:false, cookie:{httpOnly:true,sameSite:'lax',secure:process.env.NODE_ENV==='production',maxAge:86400000} }));
app.use(express.static(path.join(__dirname,'public')));

const SCOPES=['https://www.googleapis.com/auth/gmail.readonly','https://www.googleapis.com/auth/gmail.send','https://www.googleapis.com/auth/gmail.modify'];
function oauth(req){ return new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID,process.env.GOOGLE_CLIENT_SECRET,process.env.GOOGLE_REDIRECT_URI || `http://localhost:${PORT}/auth/callback`); }
function client(req){ const c=oauth(req); if(req.session.tokens)c.setCredentials(req.session.tokens); return c; }
function requireAuth(req,res,next){ if(!req.session.tokens)return res.status(401).json({error:'AUTH_REQUIRED'}); next(); }
function header(headers,name){ return (headers||[]).find(h=>h.name.toLowerCase()===name.toLowerCase())?.value||''; }
function decode(data){ if(!data)return ''; return Buffer.from(data.replace(/-/g,'+').replace(/_/g,'/'),'base64').toString('utf8'); }
function bodyFromPayload(p){ if(!p)return ''; if(p.mimeType==='text/plain'&&p.body?.data)return decode(p.body.data); for(const part of (p.parts||[])){const x=bodyFromPayload(part);if(x)return x;} return ''; }
function normalize(m){ return {id:m.id,threadId:m.threadId,sender:header(m.payload?.headers,'From'),to:header(m.payload?.headers,'To'),subject:header(m.payload?.headers,'Subject')||'(no subject)',date:header(m.payload?.headers,'Date'),snippet:m.snippet||'',body:bodyFromPayload(m.payload),unread:(m.labelIds||[]).includes('UNREAD'),labels:m.labelIds||[]}; }

app.get('/auth/url',(req,res)=>{const c=oauth(req);res.json({url:c.generateAuthUrl({access_type:'offline',prompt:'consent',scope:SCOPES})});});
app.get('/auth/callback',async(req,res)=>{try{const c=oauth(req);const {tokens}=await c.getToken(req.query.code);req.session.tokens=tokens;res.redirect('/');}catch(e){res.status(400).send('OAuth failed: '+e.message)}});
app.post('/auth/logout',(req,res)=>req.session.destroy(()=>res.json({ok:true})));
app.get('/api/me',requireAuth,async(req,res)=>{try{const gmail=google.gmail({version:'v1',auth:client(req)});const p=await gmail.users.getProfile({userId:'me'});res.json({email:p.data.emailAddress});}catch(e){res.status(500).json({error:e.message})}});
app.get('/api/messages',requireAuth,async(req,res)=>{try{const gmail=google.gmail({version:'v1',auth:client(req)});let q=req.query.q||'';if(req.query.from)q+=` from:${req.query.from}`;if(req.query.keyword)q+=` ${req.query.keyword}`;if(req.query.unread==='true')q+=' is:unread';if(req.query.after)q+=` after:${req.query.after}`;if(req.query.before)q+=` before:${req.query.before}`;const label=req.query.label||'INBOX';const list=await gmail.users.messages.list({userId:'me',labelIds:[label],q:q.trim(),maxResults:50});const msgs=await Promise.all((list.data.messages||[]).map(x=>gmail.users.messages.get({userId:'me',id:x.id,format:'full'})));res.json({messages:msgs.map(x=>normalize(x.data))});}catch(e){res.status(500).json({error:e.message})}});
app.get('/api/messages/:id',requireAuth,async(req,res)=>{try{const gmail=google.gmail({version:'v1',auth:client(req)});const x=await gmail.users.messages.get({userId:'me',id:req.params.id,format:'full'});res.json(normalize(x.data));}catch(e){res.status(500).json({error:e.message})}});
app.post('/api/messages/:id/read',requireAuth,async(req,res)=>{try{const gmail=google.gmail({version:'v1',auth:client(req)});await gmail.users.messages.modify({userId:'me',id:req.params.id,requestBody:{removeLabelIds:['UNREAD']}});res.json({ok:true});}catch(e){res.status(500).json({error:e.message})}});
app.post('/api/send',requireAuth,async(req,res)=>{try{const {to,subject,body}=req.body;if(!to||!subject||!body)return res.status(400).json({error:'To, subject and body are required'});const raw=[`To: ${to}`,`Subject: ${subject}`,'Content-Type: text/plain; charset=utf-8','',body].join('\r\n');const encoded=Buffer.from(raw).toString('base64url');const gmail=google.gmail({version:'v1',auth:client(req)});const r=await gmail.users.messages.send({userId:'me',requestBody:{raw:encoded}});res.json({ok:true,id:r.data.id});}catch(e){res.status(500).json({error:e.message})}});

app.post('/api/gmail/webhook',(req,res)=>{res.status(204).end();});
app.get('*',(req,res)=>res.sendFile(path.join(__dirname,'public','index.html')));
app.listen(PORT,()=>console.log(`AI Mail WebApp running on http://localhost:${PORT}`));
