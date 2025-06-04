const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

// Middleware để parse JSON
app.use(express.json());
app.use(express.static(path.join(__dirname, '.')));

// Route mặc định
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// API để gửi tin nhắn
app.post('/api/messages', (req, res) => {
  const { name, message } = req.body;
  if (!name || !message) {
    return res.status(400).json({ error: 'Tên và lời nhắn là bắt buộc!' });
  }

  const timestamp = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
  const newMessage = { name, message, timestamp };

  // Đọc file messages.json
  let messages = [];
  try {
    const data = fs.readFileSync('messages.json', 'utf8');
    messages = JSON.parse(data);
  } catch (error) {
    console.log('Không tìm thấy file messages.json, tạo mới.');
  }

  // Thêm tin nhắn mới
  messages.push(newMessage);

  // Ghi lại file
  fs.writeFileSync('messages.json', JSON.stringify(messages, null, 2));
  res.json({ success: true, message: newMessage });
});

// API để lấy danh sách tin nhắn
app.get('/api/messages', (req, res) => {
  try {
    const data = fs.readFileSync('messages.json', 'utf8');
    const messages = JSON.parse(data);
    res.json(messages);
  } catch (error) {
    res.json([]);
  }
});

app.listen(port, () => {
  console.log(`Server đang chạy tại http://localhost:${port}`);
});
