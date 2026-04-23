import http from 'http';

const PORT = process.env.PORT || 3000;


const RESPONSES = {
  gettoken: {
    access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImRlbW9fdXNlciIsImlhdCI6MTc3NjkwNTIyMCwiZXhwIjoxNzc2OTA4ODIwfQ.jSG0sOSIPtqoxzX9SSdH6WXLMjKybKaiX0hi0hDqVWU"
  },

  documents: {
    status: "success",
    msg: null,
    data: "get documents thành công"
  },

  getstatus: () => {
    return {
      status: "success",
      msg: null,
      data: "get status thành công"
    };
  },

  sign: {
    status: "success",
    msg: "Ký số thành công"
  }
};


function send(res, body, status = 200) {
  const json = JSON.stringify(body, null, 2);
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  });
  res.end(json);
}

// ─── Router ───────────────────────────────────────────────────────────────────

const server = http.createServer(async (req, res) => {
  const url = req.url.split('?')[0];
  const method = req.method;

  // CORS preflight
  if (method === 'OPTIONS') {
    send(res, {}, 204);
    return;
  }

  console.log(`[${new Date().toISOString()}] ${method} ${url}`);

  if (url === '/api/authenticate/gettoken' && method === 'POST') {
    send(res, RESPONSES.gettoken);
    return;
  }

  if (url === '/api/documents' && method === 'POST') {
    send(res, RESPONSES.documents);
    return;
  }

  if (url === '/api/document/getstatus' && method === 'POST') {
    send(res, RESPONSES.getstatus());
    return;
  }

  if (url === '/api/document/sign' && method === 'POST') {
    send(res, RESPONSES.sign);
    return;
  }

  // 404
  send(res, { status: 1, msg: 'Route not found' }, 404);
});

server.listen(PORT, () => {
  console.log(`[Server] Running at http://localhost:${PORT}`);
  console.log(`[Server] Endpoints:`);
  console.log(`  POST /api/authenticate/gettoken`);
  console.log(`  POST /api/documents`);
  console.log(`  POST /api/document/getstatus`);
  console.log(`  POST /api/document/sign`);
});
