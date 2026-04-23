import http from 'http';

const PORT = process.env.PORT || 3000;

// ─── Hardcoded responses ──────────────────────────────────────────────────────

const RESPONSES = {
  gettoken: {
    access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImRlbW9fdXNlciIsImlhdCI6MTc3NjkwNTIyMCwiZXhwIjoxNzc2OTA4ODIwfQ.jSG0sOSIPtqoxzX9SSdH6WXLMjKybKaiX0hi0hDqVWU"
  },

  documents: {
    status: 0,
    msg: null,
    data: [
      {
        documentName: "BangKeChiPhi.pdf",
        documentKey: "DOC001",
        documentType: "PDF",
        fileName: "BangKe.pdf",
        createDate: "2026-04-01",
        expiredDate: "2026-05-01",
        sender: "HIS",
        previewUrl: "https://www.w3.org/WAI/WCAG21/Techniques/pdf/sample.pdf"
      }
    ]
  },

  getstatus: (body) => {
    const keys = body.documentKeys || ["DOC001"];
    return {
      status: 0,
      msg: null,
      data: keys.map(k => ({
        documentKey: k,
        status: 2,
        previewUrl: "https://www.w3.org/WAI/WCAG21/Techniques/pdf/sample.pdf"
      }))
    };
  },

  sign: {
    status: 0,
    msg: "Ký số thành công"
  }
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function readBody(req) {
  return new Promise((resolve) => {
    let data = '';
    req.on('data', chunk => data += chunk);
    req.on('end', () => {
      try { resolve(JSON.parse(data)); }
      catch { resolve({}); }
    });
  });
}

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

  // Health check
  if (url === '/health' && method === 'GET') {
    send(res, { status: 'ok', timestamp: new Date().toISOString() });
    return;
  }

  // POST /api/authenticate/gettoken
  if (url === '/api/authenticate/gettoken' && method === 'POST') {
    send(res, RESPONSES.gettoken);
    return;
  }

  // POST /api/documents
  if (url === '/api/documents' && method === 'POST') {
    send(res, RESPONSES.documents);
    return;
  }

  // POST /api/document/getstatus
  if (url === '/api/document/getstatus' && method === 'POST') {
    const body = await readBody(req);
    send(res, RESPONSES.getstatus(body));
    return;
  }

  // POST /api/document/sign
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
  console.log(`  GET  /health`);
});
