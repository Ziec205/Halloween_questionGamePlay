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

// Tạo pool tên nhân vật Halloween (sẽ sinh động và đủ lớn - tối thiểu 1000 mục)
const halloweenBase = [
    "👻 Ma", "🎃 Bí Ngô", "🦇 Dơi", "🧛 Ma Cà Rồng", "🧟 Zombie",
    "💀 Đầu Lâu", "🐺 Người Sói", "🐈‍⬛ Mèo Đen", "🕷️ Nhện", "🧙 Phù Thủy",
    "🏚️ Nhà Ma", "🦉 Cú", "🦂 Bọ Cạp", "🐍 Rắn", "🤡 Hề",
    "👹 Quỷ", "👺 Yêu Tinh", "🧛‍♀️ Lady Vampire", "🧛‍♂️ Count Dracula", "🧟‍♀️ Zombie Nữ"
];

// Sinh mảng 1000+ phần tử bằng cách kết hợp base với chỉ số nhóm để tránh trùng lặp
const halloweenCharacters = [];
const targetCount = 1000;
for (let i = 0; i < targetCount; i++) {
    const base = halloweenBase[i % halloweenBase.length];
    const group = Math.floor(i / halloweenBase.length) + 1;
    // Ví dụ: "� Ma #1", "� Bí Ngô #1", ... để dễ nhận biết
    halloweenCharacters.push(`${base} #${group}`);
}

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
        
    // Vẽ tên câu hỏi lên vòng xoay
    ctx.save();
    ctx.translate(200, 200);
    ctx.rotate(startAngle + anglePerSegment / 2);
    ctx.textAlign = 'center';
    ctx.fillStyle = 'white';
    ctx.font = 'bold 16px Arial';

    // Dùng tên câu hỏi mà người dùng đã đặt
    const segmentLabel = (questions[i] && questions[i].name) ? questions[i].name : `Câu ${i + 1}`;
    ctx.fillText(segmentLabel, 110, 10);
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
    
    // Phát âm thanh khi bắt đầu quay
    const wheelSound = document.getElementById('wheelSound');
    if (wheelSound) {
        wheelSound.currentTime = 0;
        wheelSound.volume = 0.5;
        wheelSound.play().catch(err => console.log('Cannot play wheel sound:', err));
    }
    
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
        
        // Phát âm thanh khi kết thúc quay
        const endWheelSound = document.getElementById('endWheelSound');
        if (endWheelSound) {
            endWheelSound.currentTime = 0;
            endWheelSound.volume = 0.6;
            endWheelSound.play().catch(err => console.log('Cannot play end wheel sound:', err));
        }
        
        // Tính toán câu hỏi được chọn
        const normalizedRotation = currentRotation % (2 * Math.PI);
        const anglePerSegment = (2 * Math.PI) / questions.length;
        
        // Mũi tên chỉ lên trên (góc -π/2 hay 3π/2), cần điều chỉnh để tính segment ở vị trí 12 giờ
        // Thêm π/2 để offset từ vị trí 3 giờ (0) lên vị trí 12 giờ (-π/2)
        const pointerAngle = Math.PI / 2; // 90 độ = vị trí 12 giờ
        const adjustedRotation = (normalizedRotation + pointerAngle) % (2 * Math.PI);
        let selectedIndex = Math.floor((2 * Math.PI - adjustedRotation) / anglePerSegment) % questions.length;
        
    // Lấy đối tượng câu hỏi được chọn và nhãn segment (nếu có)
    const picked = questions[selectedIndex];
    const pickedSegment = picked && picked.segment ? picked.segment : halloweenCharacters[selectedIndex % halloweenCharacters.length];
        
    // Gắn nhãn segment vào selectedQuestion để hiển thị
    selectedQuestion = picked ? picked : null;
    selectedQuestion = selectedQuestion ? Object.assign({}, selectedQuestion) : { question: 'Không có câu hỏi', answers: [], correctAnswer: -1 };
    selectedQuestion.segment = pickedSegment;
    selectedQuestionIndex = selectedIndex;
        
    // Xóa câu hỏi đã quay khỏi danh sách GAME (chỉ danh sách đang chơi), nhưng lưu nhãn đã được chọn để hiển thị trong kết quả
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
    
    // Hiển thị tên câu hỏi trong thẻ h2
    const h2Element = questionDisplay.querySelector('h2');
    if (h2Element && selectedQuestion.name) {
        h2Element.innerHTML = `👻 ${selectedQuestion.name} 👻`;
    }
    
    // Hiển thị nội dung câu hỏi trong questionText
    const questionText = document.getElementById('questionText');
    questionText.style.display = 'block';
    questionText.textContent = selectedQuestion.question;
    
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
    
    // Phát âm thanh dựa trên đáp án đúng hay sai
    if (isCorrect) {
        const trueAnswerSound = document.getElementById('trueAnswerSound');
        if (trueAnswerSound) {
            trueAnswerSound.currentTime = 0;
            trueAnswerSound.volume = 0.7;
            trueAnswerSound.play().catch(err => console.log('Cannot play true answer sound:', err));
        }
    } else {
        const wrongAnswerSound = document.getElementById('wrongAnswerSound');
        if (wrongAnswerSound) {
            wrongAnswerSound.currentTime = 0;
            wrongAnswerSound.volume = 0.7;
            wrongAnswerSound.play().catch(err => console.log('Cannot play wrong answer sound:', err));
        }
    }
    
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
    // Phát âm thanh khi mở bảng kết quả
    const resultSound = document.getElementById('resultSound');
    if (resultSound) {
        resultSound.currentTime = 0;
        resultSound.play().catch(e => console.log('Result sound error:', e));
    }
    
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
