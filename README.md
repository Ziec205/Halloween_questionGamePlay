# 🎃 Halloween Bingo Game 👻

> Trò chơi Bingo phong cách Halloween với vòng xoay ma quái và câu hỏi kinh dị!

![Halloween](https://img.shields.io/badge/Theme-Halloween-orange?style=for-the-badge)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

## 📖 Mô Tả

Halloween Bingo Game là một trò chơi tương tác với giao diện Halloween ma quái, bao gồm:
- 🎡 Vòng xoay may mắn với 100+ tên nhân vật Halloween
- 🧛‍♂️ Các nhân vật Halloween bay lượn: ma, dơi, bí ngô, ma cà rồng, thây ma
- 📝 Hệ thống quản lý câu hỏi đầy đủ (thêm, sửa, xóa)
- 🎯 Chọn đáp án đúng và xem kết quả chi tiết
- 💯 Bảng điểm hiển thị sau khi hoàn thành
- 💾 Câu hỏi được lưu an toàn, không bị mất sau khi chơi

## ✨ Tính Năng

### 🎮 Trang Quản Lý Câu Hỏi (index.html)
- ➕ Thêm câu hỏi mới với 4 đáp án
- ✅ Chọn đáp án đúng bằng radio button
- ✏️ Chỉnh sửa câu hỏi đã tạo
- 🗑️ Xóa câu hỏi (có xác nhận)
- 💾 Lưu tự động vào localStorage
- 🎃 5 câu hỏi Halloween mẫu sẵn có

### 🎡 Trang Game (game.html)
- 🎯 Vòng xoay tốc độ cao (2.5 giây)
- 👻 Hiển thị 100+ tên nhân vật Halloween thay vì số
- 🔥 Câu hỏi tạm thời bị xóa khi chơi, nhưng vẫn lưu trong localStorage
- ✅ Feedback tức thì khi chọn đáp án (đúng/sai)
- 📊 Bảng điểm chi tiết cuối game:
  - Điểm số tổng (%)
  - Số câu đúng/sai
  - Chi tiết từng câu trả lời
- 🧛‍♂️ Ma cà rồng chỉ câu hỏi thay vì mũi tên thông thường
- 🔄 Quay lại trang quản lý - câu hỏi vẫn còn nguyên!

### 🎭 Hiệu Ứng Halloween
- 🎃 3 quả bí ngô quay tròn bay lượn
- 👻 3 con ma bay theo đường cong phức tạp
- 🦇 5 con dơi bay zigzag khắp màn hình
- 🧛 2 ma cà rồng bay lượn ma mị
- 🧟 2 thây ma đi lang thang
- 💀 2 đầu lâu quay tròn và nảy
- ✨ Hơn 10 loại animation độc đáo

## 🚀 Cài Đặt & Chạy

### Yêu Cầu
- Trình duyệt web hiện đại (Chrome, Firefox, Edge, Safari)
- Không cần cài đặt thêm gì khác!

### Cách Chạy

1. **Clone repository:**
```bash
git clone https://github.com/Ziec205/Halloween_Bingo_GamePlay-.git
cd Halloween_Bingo_GamePlay-
```

2. **Mở file index.html:**
   - Cách 1: Double click vào file `index.html`
   - Cách 2: Click chuột phải → "Open with" → Chọn trình duyệt
   - Cách 3: Kéo thả file vào trình duyệt

3. **Bắt đầu chơi:**
   - Thêm câu hỏi của bạn
   - Nhấn "BẮT ĐẦU CHƠI GAME"
   - Quay vòng xoay và trả lời câu hỏi!

## 📁 Cấu Trúc Dự Án

```
Halloween_Bingo_GamePlay-/
│
├── index.html          # Trang quản lý câu hỏi
├── game.html           # Trang chơi game với vòng xoay
├── style.css           # CSS cho cả 2 trang
├── script.js           # JavaScript cho index.html
├── game.js             # JavaScript cho game.html
└── README.md           # File này
```

## 🎯 Hướng Dẫn Sử Dụng

### Tạo Câu Hỏi
1. Nhập câu hỏi vào ô "Câu hỏi"
2. Nhập 4 đáp án
3. **Click radio button** bên cạnh đáp án đúng
4. Nhấn "Thêm Câu Hỏi"

### Chỉnh Sửa Câu Hỏi
1. Nhấn nút "Sửa" bên cạnh câu hỏi muốn sửa
2. Form sẽ tự động điền thông tin
3. Chỉnh sửa nội dung
4. Nhấn "Cập Nhật Câu Hỏi"

### Chơi Game
1. Nhấn "BẮT ĐẦU CHƠI GAME" ở cuối trang quản lý
2. Nhấn "QUAY VÒNG XOAY" để chọn câu hỏi ngẫu nhiên
3. Click vào đáp án của bạn
4. Xem kết quả đúng/sai ngay lập tức
5. Câu hỏi sẽ tạm thời biến mất trong game
6. Tiếp tục quay cho đến hết câu hỏi
7. Xem bảng điểm chi tiết cuối game
8. **Quay lại trang quản lý - câu hỏi vẫn còn đó!** 🎉

## 🎨 Giao Diện

### Màu Sắc Chủ Đạo
- 🟠 Cam Halloween (#ff6b00, #ffa500)
- 🔴 Đỏ ma quái (#ff0000, #cc0000)
- 🟣 Tím bí ẩn (#8b00ff, #4b0082)
- ⚫ Đen kinh dị (#1a0b2e, #2d1b4e)

### Nhân Vật Halloween (100+ tên)
👻 Ma | 🎃 Bí Ngô | 🦇 Dơi | 🧛 Ma Cà Rồng | 🧟 Zombie | 💀 Đầu Lâu | 🕷️ Nhện | 👹 Quỷ | 🧙 Phù Thủy | 🔮 Pha Lê | ⚰️ Quan Tài | 🪦 Bia Mộ | 🌙 Trăng Máu | 🦴 Xương | 🩸 Máu | 🔪 Dao | 🏚️ Nhà Ma | 🏰 Lâu Đài | 👿 Ác Quỷ | 😈 Satan | 🤡 Hề Máu | 🎭 Mặt Nạ | 🧠 Não | 🦷 Răng Nanh | 💊 Thuốc Độc | 🧪 Hóa Chất | 🐀 Chuột | 🐈‍⬛ Mèo Đen | 🐺 Sói | 🦉 Cú | 🐍 Rắn Độc | 🦂 Bọ Cạp | và 70+ nhân vật khác...

## 💾 Lưu Trữ Dữ Liệu

- Sử dụng **localStorage** để lưu câu hỏi
- Dữ liệu không bị mất khi đóng trình duyệt
- **Câu hỏi GỐC luôn được giữ nguyên** trong localStorage
- Chỉ copy tạm thời khi chơi game
- Tự động đồng bộ giữa 2 trang

## 🔧 Tùy Chỉnh

### Thay Đổi Thời Gian Quay
```javascript
// Trong game.js, dòng ~150
spinVelocity = Math.random() * 0.5 + 0.8; // Tăng 0.8 lên 1.0 để quay nhanh hơn
```

### Thêm Nhân Vật Halloween
```javascript
// Trong game.js, mảng halloweenCharacters
const halloweenCharacters = [
    "👻 Ma", "🎃 Bí Ngô", "🦇 Dơi",
    "🧌 Nhân vật của bạn" // Thêm vào đây
];
```

### Thêm Câu Hỏi Mẫu
```javascript
// Trong script.js
questions.push({
    question: "Câu hỏi của bạn?",
    answers: ["Đáp án 1", "Đáp án 2", "Đáp án 3", "Đáp án 4"],
    correctAnswer: 0 // Index của đáp án đúng (0-3)
});
```

## 🐛 Xử Lý Lỗi Thường Gặp

### Vòng xoay không quay
- Kiểm tra console (F12) xem có lỗi JavaScript không
- Đảm bảo đã có ít nhất 1 câu hỏi

### Mất dữ liệu câu hỏi
- ✅ **ĐÃ SỬA**: Câu hỏi không còn bị mất khi chơi game!
- Câu hỏi gốc luôn được lưu trong localStorage
- Chỉ copy tạm thời khi chơi

### Animation không hoạt động
- Kiểm tra file `style.css` đã được load chưa
- Thử refresh trình duyệt (Ctrl + F5)

### Không thấy tên nhân vật trên vòng xoay
- Kiểm tra mảng `halloweenCharacters` trong game.js
- Font size có thể nhỏ, zoom trình duyệt lên

## 🤝 Đóng Góp

Mọi đóng góp đều được chào đón! Để đóng góp:

1. Fork dự án
2. Tạo branch mới (`git checkout -b feature/TinhNangMoi`)
3. Commit thay đổi (`git commit -m '🎃 Thêm tính năng mới'`)
4. Push lên branch (`git push origin feature/TinhNangMoi`)
5. Tạo Pull Request

## 📝 License

Dự án này được phát hành dưới giấy phép MIT. Xem file `LICENSE` để biết thêm chi tiết.

## 👨‍💻 Tác Giả

- **GitHub**: [@Ziec205](https://github.com/Ziec205)
- **Dự án**: [Halloween Bingo GamePlay](https://github.com/Ziec205/Halloween_Bingo_GamePlay-)

## 🎃 Credits

- Emoji từ Unicode Standard
- Animation và hiệu ứng tự thiết kế
- 100+ tên nhân vật Halloween độc đáo

## 📞 Liên Hệ

Nếu bạn có câu hỏi hoặc gợi ý, hãy tạo [Issue](https://github.com/Ziec205/Halloween_Bingo_GamePlay-/issues) trên GitHub!

---

<div align="center">

### 🎃 Happy Halloween! 👻

**Made with 💀 and ☕**

⭐ Nếu bạn thích dự án này, hãy cho một Star nhé! ⭐

</div>
