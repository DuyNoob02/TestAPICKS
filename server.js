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

// dùng res.setHeader + res.end thay vì res.writeHead
// vì Vercel dùng object res của Express-like, không phải Node http thuần
function send(res, body, status = 200) {
  const json = JSON.stringify(body, null, 2);
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.statusCode = status;
  res.end(json);
}

// export default handler thay vì http.createServer + server.listen
export default async function handler(req, res) {
  const url = req.url.split('?')[0];
  const method = req.method;

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

  send(res, { status: 1, msg: 'Route not found' }, 404);
}
