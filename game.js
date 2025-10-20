// Lấy dữ liệu câu hỏi từ localStorage
let originalQuestions = JSON.parse(localStorage.getItem('halloweenQuestions')) || [];
let questions = JSON.parse(JSON.stringify(originalQuestions)); // Copy để không ảnh hưởng bản gốc
let gameResults = []; // Lưu kết quả các câu hỏi đã chơi

// Biến quản lý vòng xoay
let canvas = document.getElementById('wheelCanvas');
let ctx = canvas.getContext('2d');
let isSpinning = false;
let currentRotation = 0;
let spinVelocity = 0;
let selectedQuestion = null;
let selectedQuestionIndex = -1;

// Màu sắc Halloween cho vòng xoay
const colors = ['#FF6B00', '#FF0000', '#8B00FF', '#000000', '#FFA500', '#660000', '#4B0082', '#FF4500'];

// 100+ tên nhân vật Halloween
const halloweenCharacters = [
    "👻 Ma", "🎃 Bí Ngô", "🦇 Dơi", "🧛 Ma Cà Rồng", "🧟 Zombie",
    "💀 Đầu Lâu", "🕷️ Nhện", "🕸️ Mạng Nhện", "👹 Quỷ", "👺 Yêu Tinh",
    "🧙 Phù Thủy", "🧙‍♀️ Mụ Phù Thủy", "🔮 Pha Lê", "⚰️ Quan Tài", "🪦 Bia Mộ",
    "🌙 Trăng Máu", "⭐ Sao Ma", "🦴 Xương", "🩸 Máu", "🔪 Dao",
    "🪓 Rìu", "⚡ Sét", "🌩️ Giông Bão", "🌫️ Sương Mù", "🌑 Trăng Tối",
    "🕯️ Nến", "🏚️ Nhà Ma", "🏰 Lâu Đài", "⛪ Nhà Thờ", "🗿 Tượng Đá",
    "👿 Ác Quỷ", "😈 Satan", "🤡 Hề Máu", "🎭 Mặt Nạ", "👁️ Con Mắt",
    "🧠 Não", "❤️‍🔥 Tim Đen", "🫀 Trái Tim", "🫁 Phổi", "🦷 Răng Nanh",
    "👄 Môi Máu", "💋 Nụ Hôn Tử", "🩹 Băng", "💉 Kim Tiêm", "💊 Thuốc Độc",
    "🧪 Hóa Chất", "⚗️ Lọ Thuốc", "🔬 Thí Nghiệm", "🧬 DNA", "🦠 Vi Khuẩn",
    "🐀 Chuột", "🐈‍⬛ Mèo Đen", "🐺 Sói", "🦉 Cú", "🦅 Đại Bàng Đêm",
    "🐍 Rắn Độc", "🦂 Bọ Cạp", "🕊️ Chim Quạ", "🦴 Bộ Xương", "💀 Sọ Người",
    "👹 Oni", "👺 Tengu", "🧛‍♀️ Lady Vampire", "🧛‍♂️ Count Dracula", "🧟‍♀️ Zombie Nữ",
    "🧟‍♂️ Zombie Nam", "👻 Bóng Ma", "🌫️ Hồn Ma", "💨 Linh Hồn", "⚡ Sấm Sét",
    "🌩️ Bão Tố", "🌪️ Lốc Xoáy", "🔥 Lửa Địa Ngục", "❄️ Băng Giá", "⛓️ Xích Sắt",
    "🗡️ Kiếm", "⚔️ Gươm Đôi", "🏹 Cung Tên", "🛡️ Khiên", "🪃 Boomerang Tử",
    "🔨 Búa", "⚒️ Cuốc", "🪚 Cưa", "🔧 Cờ Lê", "🪛 Tua Vít",
    "🔩 Đinh Ốc", "⛏️ Chim Cuốc", "🪤 Bẫy", "🧨 Pháo", "💣 Bom",
    "💥 Nổ", "🔫 Súng", "🗝️ Chìa Khóa", "🔐 Ổ Khóa", "🔓 Mở Khóa",
    "📿 Chuỗi Hạt", "🔔 Chuông Đêm", "📯 Kèn", "🎺 Trumpet Ma", "🎻 Violin Đêm",
    "🪕 Đàn Ma", "🥁 Trống Quỷ", "🔱 Đinh Ba", "⚰️ Hòm Quan Tài", "🪦 Mộ Cổ"
];

// Khởi tạo
function init() {
    if (questions.length === 0) {
        alert('👻 Không có câu hỏi nào! Vui lòng quay lại và thêm câu hỏi.');
        window.location.href = 'index.html';
        return;
    }
    
    updateQuestionCount();
    drawWheel();
}

// Vẽ vòng xoay
function drawWheel() {
    const numSegments = questions.length;
    const anglePerSegment = (2 * Math.PI) / numSegments;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < numSegments; i++) {
        const startAngle = currentRotation + (i * anglePerSegment);
        const endAngle = startAngle + anglePerSegment;
        
        // Vẽ phân đoạn
        ctx.beginPath();
        ctx.moveTo(200, 200);
        ctx.arc(200, 200, 200, startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = colors[i % colors.length];
        ctx.fill();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // Vẽ tên nhân vật Halloween thay vì số
        ctx.save();
        ctx.translate(200, 200);
        ctx.rotate(startAngle + anglePerSegment / 2);
        ctx.textAlign = 'center';
        ctx.fillStyle = 'white';
        ctx.font = 'bold 16px Arial';
        
        // Lấy tên nhân vật theo index
        const characterName = halloweenCharacters[i % halloweenCharacters.length];
        ctx.fillText(characterName, 120, 10);
        ctx.restore();
    }
    
    // Vẽ tâm
    ctx.beginPath();
    ctx.arc(200, 200, 30, 0, 2 * Math.PI);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 3;
    ctx.stroke();
}

// Quay vòng xoay
function spinWheel() {
    if (isSpinning) return;
    if (questions.length === 0) {
        alert('👻 Không có câu hỏi nào để quay!');
        return;
    }
    
    isSpinning = true;
    document.getElementById('spinBtn').disabled = true;
    
    // Tốc độ quay ngẫu nhiên - GIẢM thời gian xuống còn 2.5s
    spinVelocity = Math.random() * 0.5 + 0.8;
    
    // Ẩn câu hỏi cũ
    document.getElementById('answersGrid').innerHTML = '';
    document.getElementById('questionText').textContent = '🎃 Đang quay... 👻';
    
    animateWheel();
}

// Animation vòng xoay
function animateWheel() {
    if (spinVelocity > 0.001) {
        currentRotation += spinVelocity;
        spinVelocity *= 0.96; // Tăng hệ số giảm tốc để quay nhanh hơn
        drawWheel();
        requestAnimationFrame(animateWheel);
    } else {
        // Dừng quay
        isSpinning = false;
        document.getElementById('spinBtn').disabled = false;
        
        // Tính toán câu hỏi được chọn
        const normalizedRotation = currentRotation % (2 * Math.PI);
        const anglePerSegment = (2 * Math.PI) / questions.length;
        
        // Mũi tên chỉ xuống (góc 0), ta cần tính segment ở vị trí đó
        let selectedIndex = Math.floor((2 * Math.PI - normalizedRotation) / anglePerSegment) % questions.length;
        
        selectedQuestion = questions[selectedIndex];
        selectedQuestionIndex = selectedIndex;
        
        // Xóa câu hỏi đã quay khỏi danh sách GAME (không xóa trong localStorage)
        questions.splice(selectedIndex, 1);
        
        // KHÔNG lưu lại vào localStorage - giữ nguyên câu hỏi gốc
        // localStorage.setItem('halloweenQuestions', JSON.stringify(questions));
        
        // Cập nhật số lượng câu hỏi
        updateQuestionCount();
        
        // Vẽ lại vòng xoay với số câu hỏi mới
        drawWheel();
        
        displayQuestion();
    }
}

// Hiển thị câu hỏi và đáp án
function displayQuestion() {
    if (!selectedQuestion) return;
    
    const questionDisplay = document.getElementById('questionDisplay');
    questionDisplay.classList.add('show');
    
    // Hiển thị thông báo câu hỏi đã bị xóa
    const questionText = document.getElementById('questionText');
    questionText.innerHTML = `
        <div style="margin-bottom: 10px;">
            <span style="font-size: 0.8em; color: #ffa500;">🔥</span>
        </div>
        ${selectedQuestion.question}
    `;
    
    const answersGrid = document.getElementById('answersGrid');
    answersGrid.innerHTML = '';
    
    selectedQuestion.answers.forEach((answer, index) => {
        const answerBox = document.createElement('div');
        answerBox.className = 'answer-box';
        answerBox.textContent = answer;
        answerBox.dataset.index = index;
        answerBox.onclick = function() {
            // Bỏ chọn tất cả
            document.querySelectorAll('.answer-box').forEach(box => {
                box.classList.remove('selected');
            });
            // Chọn đáp án này
            this.classList.add('selected');
            
            // Lưu kết quả
            saveResult(parseInt(this.dataset.index));
        };
        answersGrid.appendChild(answerBox);
    });
}

// Lưu kết quả câu hỏi
function saveResult(selectedAnswerIndex) {
    const isCorrect = selectedAnswerIndex === selectedQuestion.correctAnswer;
    
    gameResults.push({
        question: selectedQuestion.question,
        answers: selectedQuestion.answers,
        correctAnswer: selectedQuestion.correctAnswer,
        selectedAnswer: selectedAnswerIndex,
        isCorrect: isCorrect
    });
    
    // Hiển thị feedback ngay lập tức
    const answerBoxes = document.querySelectorAll('.answer-box');
    answerBoxes.forEach((box, index) => {
        if (index === selectedQuestion.correctAnswer) {
            box.classList.add('correct');
        }
        if (index === selectedAnswerIndex && !isCorrect) {
            box.classList.add('wrong');
        }
        box.style.pointerEvents = 'none'; // Vô hiệu hóa click
    });
    
    // Kiểm tra nếu hết câu hỏi
    if (questions.length === 0) {
        setTimeout(() => {
            showResults();
        }, 2000);
    }
}

// Hiển thị bảng kết quả
function showResults() {
    const totalQuestions = originalQuestions.length;
    const answeredQuestions = gameResults.length;
    const correctAnswers = gameResults.filter(r => r.isCorrect).length;
    const score = answeredQuestions > 0 ? Math.round((correctAnswers / answeredQuestions) * 100) : 0;
    
    // Tạo map kết quả để dễ tra cứu
    const resultsMap = {};
    gameResults.forEach(result => {
        resultsMap[result.question] = result;
    });
    
    let resultsHTML = `
        <div class="results-overlay">
            <div class="results-panel">
                <h1>🎃 Kết Quả Halloween Bingo 👻</h1>
                <div class="score-summary">
                    <div class="score-circle">
                        <div class="score-value">${score}%</div>
                        <div class="score-label">Điểm Số</div>
                    </div>
                    <div class="score-details">
                        <p>✅ Đúng: <strong>${correctAnswers}</strong> câu</p>
                        <p>❌ Sai: <strong>${answeredQuestions - correctAnswers}</strong> câu</p>
                        <p>⏭️ Bỏ qua: <strong>${totalQuestions - answeredQuestions}</strong> câu</p>
                        <p>📊 Tổng: <strong>${totalQuestions}</strong> câu</p>
                    </div>
                </div>
                
                <h2>📋 Chi Tiết Tất Cả Câu Hỏi</h2>
                <div class="results-list">
                    ${originalQuestions.map((question, index) => {
                        const result = resultsMap[question.question];
                        const itemClass = result ? (result.isCorrect ? 'correct-item' : 'wrong-item') : 'unanswered-item';
                        const icon = result ? (result.isCorrect ? '✅' : '❌') : '⏭️';
                        
                        return `
                            <div class="result-item ${itemClass}">
                                <div class="result-header">
                                    <span class="result-number">${icon} Câu ${index + 1}</span>
                                    ${!result ? '<span style="color: #ffa500; font-size: 0.9em;">(Chưa trả lời)</span>' : ''}
                                </div>
                                <div class="result-question">${question.question}</div>
                                <div class="result-answers">
                                    ${question.answers.map((ans, i) => {
                                        const isCorrect = i === question.correctAnswer;
                                        const isSelected = result && i === result.selectedAnswer;
                                        const isWrong = isSelected && !result.isCorrect;
                                        
                                        return `
                                            <div class="result-answer ${isCorrect ? 'answer-correct' : ''} ${isWrong ? 'answer-wrong' : ''}">
                                                ${isCorrect ? '✓ ' : ''}
                                                ${isWrong ? '✗ ' : ''}
                                                ${ans}
                                            </div>
                                        `;
                                    }).join('')}
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
                
                <div class="results-buttons">
                    <button class="btn-back-home" onclick="backToManagement()">
                        🏠 Quay Lại Trang Chủ
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', resultsHTML);
}

// Cập nhật số lượng câu hỏi
function updateQuestionCount() {
    document.getElementById('questionCount').textContent = questions.length;
}

// Quay lại trang quản lý
function backToManagement() {
    window.location.href = 'index.html';
}

// Kết thúc game sớm và hiển thị kết quả
function endGameEarly() {
    // Có thể kết thúc bất kỳ lúc nào, không cần kiểm tra đã trả lời hay chưa
    showResults();
}

// Khởi động khi trang load
window.onload = init;
