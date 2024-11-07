function goToPage(page) {
  window.location.href = page;
}


// 평가자 테이블의 행 클릭 이벤트 설정 함수
function setupEvaluatorTableClickEvents() {
  const evaluatorRows = document.querySelectorAll('.evaluator-table tbody tr');
  evaluatorRows.forEach(row => {
      row.addEventListener('click', function() {
          const evaluatorName = this.querySelector('td:first-child').textContent;
          goToEvaluatorPage(evaluatorName);
      });
  });
}

// 평가자 페이지로 이동하는 함수
function goToEvaluatorPage(evaluatorName) {
  console.log(`Going to ${evaluatorName}'s page`);
  // 실제 구현: 평가자 페이지로 이동
  window.location.href = `evaluator-details.html?name=${encodeURIComponent(evaluatorName)}`;
}

// 필터 토글 함수
function toggleFilter(filterId) {
  const filterContent = document.getElementById(filterId);
  filterContent.style.display = filterContent.style.display === 'none' ? 'block' : 'none';
}

const evaluators = [
  "John Smith", "Emma Johnson", "Michael Williams", "Olivia Brown", "William Jones",
  "Ava Davis", "James Miller", "Sophia Wilson", "Robert Taylor", "Isabella Anderson",
  "David Thomas", "Mia Martinez", "Joseph Garcia", "Charlotte Robinson", "Charles Clark",
  "Amelia Rodriguez", "Daniel Lewis", "Harper Lee", "Matthew Walker", "Evelyn Hall",
  "Andrew Allen", "Abigail Young", "Christopher King", "Emily Wright", "Joshua Scott",
  "Elizabeth Green", "Ryan Baker", "Sofia Adams", "Kevin Nelson", "Grace Hill"
];

const tbody = document.querySelector("#evaluatorTable tbody");

evaluators.forEach(name => {
  const row = document.createElement("tr");
  const dsScore = Math.floor(Math.random() * 101);
  const sqlScore = Math.floor(Math.random() * 101);
  const dsStatus = dsScore >= 70 ? "Pass" : "Fail";
  const sqlStatus = sqlScore >= 70 ? "Pass" : "Fail";

  row.innerHTML = `
      <td>${name}</td>
      <td>${dsScore}</td>
      <td>${dsStatus}</td>
      <td>${sqlScore}</td>
      <td>${sqlStatus}</td>
  `;
  tbody.appendChild(row);
});

document.addEventListener('DOMContentLoaded', setupEvaluatorTableClickEvents);
