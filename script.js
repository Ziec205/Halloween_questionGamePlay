// Lấy dữ liệu từ localStorage hoặc sử dụng mặc định
let questions = JSON.parse(localStorage.getItem('halloweenQuestions')) || [];

let editingIndex = -1; // Index của câu hỏi đang chỉnh sửa

// Khởi tạo
function init() {
    updateQuestionCount();
    renderQuestionsList();
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
        
        // Vẽ số thứ tự
        ctx.save();
        ctx.translate(200, 200);
        ctx.rotate(startAngle + anglePerSegment / 2);
        ctx.textAlign = 'center';
        ctx.fillStyle = 'white';
        ctx.font = 'bold 24px Arial';
        ctx.fillText(i + 1, 120, 10);
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
        alert('Vui lòng thêm ít nhất một câu hỏi!');
        return;
    }
    
    isSpinning = true;
    document.getElementById('spinBtn').disabled = true;
    
    // Tốc độ quay ngẫu nhiên
    spinVelocity = Math.random() * 0.3 + 0.5;
    
    // Ẩn câu hỏi cũ
    document.getElementById('answersGrid').innerHTML = '';
    document.getElementById('questionText').textContent = 'Đang quay...';
    
    animateWheel();
}

// Animation vòng xoay
function animateWheel() {
    if (spinVelocity > 0.001) {
        currentRotation += spinVelocity;
        spinVelocity *= 0.2; // Giảm tốc độ
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
        displayQuestion();
    }
}

// Hiển thị câu hỏi và đáp án
function displayQuestion() {
    if (!selectedQuestion) return;
    
    const questionDisplay = document.getElementById('questionDisplay');
    questionDisplay.classList.add('show');
    
    document.getElementById('questionText').textContent = selectedQuestion.question;
    
    const answersGrid = document.getElementById('answersGrid');
    answersGrid.innerHTML = '';
    
    selectedQuestion.answers.forEach((answer, index) => {
        const answerBox = document.createElement('div');
        answerBox.className = 'answer-box';
        answerBox.textContent = answer;
        answerBox.onclick = function() {
            // Bỏ chọn tất cả
            document.querySelectorAll('.answer-box').forEach(box => {
                box.classList.remove('selected');
            });
            // Chọn đáp án này
            this.classList.add('selected');
        };
        answersGrid.appendChild(answerBox);
    });
}

// Render danh sách câu hỏi
function renderQuestionsList() {
    const questionsList = document.getElementById('questionsList');
    
    if (questions.length === 0) {
        questionsList.innerHTML = '<div class="empty-state">👻 Chưa có câu hỏi nào. Hãy thêm câu hỏi đầu tiên!</div>';
        return;
    }
    
    questionsList.innerHTML = questions.map((q, index) => `
        <div class="question-item">
            <div class="question-item-header">
                <span class="question-number">🎃 Câu ${index + 1}</span>
                <div class="question-item-buttons">
                    <button class="btn-edit" onclick="editQuestion(${index})">✏️ Sửa</button>
                    <button class="btn-delete" onclick="deleteQuestion(${index})">🗑️ Xóa</button>
                </div>
            </div>
            <div class="question-item-text">${q.question}</div>
            <div class="question-item-answers">
                ${q.answers.map((a, i) => `
                    <div class="question-item-answer ${i === q.correctAnswer ? 'correct-answer' : ''}">
                        ${i === q.correctAnswer ? '✓ ' : ''}${i + 1}. ${a}
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');
}

// Lưu câu hỏi (Thêm hoặc Sửa)
function saveQuestion() {
    const questionInput = document.getElementById('questionInput');
    const answer1 = document.getElementById('answer1');
    const answer2 = document.getElementById('answer2');
    const answer3 = document.getElementById('answer3');
    const answer4 = document.getElementById('answer4');
    
    // Lấy đáp án đúng
    const correctAnswerRadio = document.querySelector('input[name="correctAnswer"]:checked');
    
    // Kiểm tra input
    if (!questionInput.value.trim()) {
        alert('👻 Vui lòng nhập câu hỏi ma quái!');
        return;
    }
    
    if (!answer1.value.trim() || !answer2.value.trim() || 
        !answer3.value.trim() || !answer4.value.trim()) {
        alert('🎃 Vui lòng nhập đầy đủ 4 đáp án kinh hoàng!');
        return;
    }
    
    if (!correctAnswerRadio) {
        alert('💀 Vui lòng chọn đáp án đúng!');
        return;
    }
    
    const questionData = {
        question: questionInput.value.trim(),
        answers: [
            answer1.value.trim(),
            answer2.value.trim(),
            answer3.value.trim(),
            answer4.value.trim()
        ],
        correctAnswer: parseInt(correctAnswerRadio.value)
    };
    
    if (editingIndex >= 0) {
        // Sửa câu hỏi
        questions[editingIndex] = questionData;
        cancelEdit();
    } else {
        // Thêm câu hỏi mới
        questions.push(questionData);
    }
    
    // Reset form
    questionInput.value = '';
    answer1.value = '';
    answer2.value = '';
    answer3.value = '';
    answer4.value = '';
    document.querySelectorAll('input[name="correctAnswer"]').forEach(radio => radio.checked = false);
    
    // Lưu vào localStorage
    saveToLocalStorage();
    
    // Cập nhật UI
    updateQuestionCount();
    renderQuestionsList();
}

// Sửa câu hỏi
function editQuestion(index) {
    editingIndex = index;
    const question = questions[index];
    
    // Điền dữ liệu vào form
    document.getElementById('questionInput').value = question.question;
    document.getElementById('answer1').value = question.answers[0];
    document.getElementById('answer2').value = question.answers[1];
    document.getElementById('answer3').value = question.answers[2];
    document.getElementById('answer4').value = question.answers[3];
    
    // Chọn đáp án đúng
    document.querySelectorAll('input[name="correctAnswer"]').forEach(radio => {
        radio.checked = (parseInt(radio.value) === question.correctAnswer);
    });
    
    // Thay đổi UI
    document.getElementById('formTitle').textContent = '✏️ Chỉnh Sửa Câu Hỏi';
    document.getElementById('btnText').textContent = 'Cập Nhật';
    document.getElementById('cancelBtn').style.display = 'block';
    
    // Scroll to form
    document.querySelector('.add-question-section').scrollIntoView({ behavior: 'smooth' });
}

// Hủy chỉnh sửa
function cancelEdit() {
    editingIndex = -1;
    
    // Reset form
    document.getElementById('questionInput').value = '';
    document.getElementById('answer1').value = '';
    document.getElementById('answer2').value = '';
    document.getElementById('answer3').value = '';
    document.getElementById('answer4').value = '';
    document.querySelectorAll('input[name="correctAnswer"]').forEach(radio => radio.checked = false);
    
    // Thay đổi UI
    document.getElementById('formTitle').textContent = '🦇 Thêm Câu Hỏi Mới';
    document.getElementById('btnText').textContent = 'Thêm Câu Hỏi';
    document.getElementById('cancelBtn').style.display = 'none';
}

// Xóa câu hỏi
function deleteQuestion(index) {
    questions.splice(index, 1);
    
    // Lưu vào localStorage
    saveToLocalStorage();
    
    // Cập nhật UI
    updateQuestionCount();
    renderQuestionsList();
    
    // Nếu đang sửa câu hỏi này thì hủy
    if (editingIndex === index) {
        cancelEdit();
    } else if (editingIndex > index) {
        editingIndex--;
    }
}

// Lưu vào localStorage
function saveToLocalStorage() {
    localStorage.setItem('halloweenQuestions', JSON.stringify(questions));
}

// Bắt đầu game
function startGame() {
    if (questions.length === 0) {
        alert('👻 Vui lòng thêm ít nhất một câu hỏi trước khi bắt đầu!');
        return;
    }
    
    // Lưu vào localStorage trước khi chuyển trang
    saveToLocalStorage();
    
    // Chuyển sang trang game
    window.location.href = 'game.html';
}

// Cập nhật số lượng câu hỏi
function updateQuestionCount() {
    document.getElementById('questionCount').textContent = questions.length;
}

// Khởi động khi trang load
window.onload = init;
