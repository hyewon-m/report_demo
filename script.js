function showTab(tabId) {
  const tabs = document.querySelectorAll('.tab');
  const buttons = document.querySelectorAll('.tab-button');

  tabs.forEach(tab => tab.style.display = 'none');
  buttons.forEach(button => button.classList.remove('active'));

  const selectedTab = document.getElementById(tabId);
  const selectedButton = document.querySelector(`[onclick="showTab('${tabId}')"]`);

  if (selectedTab) {
      selectedTab.style.display = 'block';
  }

  if (selectedButton) {
      selectedButton.classList.add('active');
  }

  // DS나 SQL 탭이 선택된 경우, 부모 탭(evaluation)도 표시
  if (tabId === 'ds' || tabId === 'sql') {
      document.getElementById('evaluation').style.display = 'block';
  }
}

// 필터 토글 함수
function toggleFilter(filterId) {
  const filterContent = document.getElementById(filterId);
  filterContent.style.display = filterContent.style.display === 'none' ? 'block' : 'none';
}

// 페이지 이동 함수
function goToPage(page) {
  window.location.href = page;
}

let charts = {};

function createChart(canvasId, type, data, options) {
    // 기존 차트가 있다면 제거합니다.
    if (charts[canvasId]) {
        charts[canvasId].destroy();
    }

    const ctx = document.getElementById(canvasId).getContext('2d');
    charts[canvasId] = new Chart(ctx, {
        type: type,
        data: data,
        options: options
    });

    return charts[canvasId];
}

// 통계 업데이트 함수
function updateStats(field, testData, allData) {
  const calculateStats = (data) => {
      const average = data.reduce((a, b) => a + b, 0) / data.length;
      const max = Math.max(...data);
      const min = Math.min(...data);
      const median = data.sort((a, b) => a - b)[Math.floor(data.length / 2)];
      return { average, max, min, median };
  };

  const testStats = calculateStats(testData);
  const allStats = calculateStats(allData);

  document.getElementById(`${field}Average`).innerHTML = `${testStats.average.toFixed(2)} <span style="color: #ff6384;">(${allStats.average.toFixed(2)})</span>`;
  document.getElementById(`${field}Max`).innerHTML = `${testStats.max} <span style="color: #ff6384;">(${allStats.max})</span>`;
  document.getElementById(`${field}Min`).innerHTML = `${testStats.min} <span style="color: #ff6384;">(${allStats.min})</span>`;
  document.getElementById(`${field}Median`).innerHTML = `${testStats.median} <span style="color: #ff6384;">(${allStats.median})</span>`;
}

// 정답자 수 차트 생성 함수
function createCorrectAnswersChart(canvasId, label, testData, allData) {
  const data = {
      labels: ['문제 1', '문제 2', '문제 3'],
      datasets: [
          {
              label: '테스트 참가자',
              data: testData,
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1
          },
          {
              label: '전체 참가자',
              data: allData,
              backgroundColor: 'rgba(255, 99, 132, 0.6)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 1
          }
      ]
  };

  const options = {
      responsive: true,
      scales: {
          y: {
              beginAtZero: true,
              title: {
                  display: true,
                  text: '정답자 수'
              }
          }
      },
      plugins: {
          title: {
              display: true,
              text: label + ' 문제별 정답자 수'
          }
      }
  };

  createChart(canvasId, 'bar', data, options);
}

// 점수 분포 차트 생성 함수
function createScoreDistributionChart(canvasId, label, testScores, allScores) {
  const createData = (scores) => {
      const data = [0, 0, 0, 0, 0];
      scores.forEach(score => {
          const index = Math.min(Math.floor(score / 20), 4);
          data[index]++;
      });
      return data;
  };

  const data = {
      labels: ['0-20', '21-40', '41-60', '61-80', '81-100'],
      datasets: [
          {
              label: '테스트 참가자',
              data: createData(testScores),
              borderColor: 'rgba(75, 192, 192, 1)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderWidth: 2,
              pointRadius: 5,
              pointBackgroundColor: 'rgba(75, 192, 192, 1)',
              fill: true
          },
          {
              label: '전체 참가자',
              data: createData(allScores),
              borderColor: 'rgba(255, 99, 132, 1)',
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              borderWidth: 2,
              pointRadius: 5,
              pointBackgroundColor: 'rgba(255, 99, 132, 1)',
              fill: true
          }
      ]
  };

  const options = {
      responsive: true,
      scales: {
          y: {
              beginAtZero: true,
              title: {
                  display: true,
                  text: '인원 수'
              }
          },
          x: {
              title: {
                  display: true,
                  text: '점수 구간'
              }
          }
      },
      plugins: {
          legend: { display: true },
          title: {
              display: true,
              text: label + ' 평가 참가자 점수 분포'
          }
      }
  };

  createChart(canvasId, 'line', data, options);
}

// 평가자 페이지로 이동하는 함수
function goToEvaluatorPage(evaluatorName) {
  console.log(`Going to ${evaluatorName}'s page`);
  // 실제 구현: 평가자 페이지로 이동
  window.location.href = `evaluator-details.html?name=${encodeURIComponent(evaluatorName)}`;
}

// 페이지 로드 시 실행되는 함수
document.addEventListener('DOMContentLoaded', function () {
  // 초기 탭 설정
  showTab('overview');

  // 데이터 로드 및 차트 생성
  loadData();

  // 평가자 테이블의 행 클릭 이벤트 설정
  setupEvaluatorTableClickEvents();
});

function loadData() {
  // DS 데이터
  const dsCorrectAnswersTest = [20, 15, 25];
  const dsCorrectAnswersAll = [30, 25, 35];
  const dsScoresTest = [65, 70, 75, 80, 85, 90, 95];
  const dsScoresAll = [60, 65, 70, 75, 80, 85, 90, 95, 100];

  createCorrectAnswersChart('dsCorrectAnswersChart', 'DS', dsCorrectAnswersTest, dsCorrectAnswersAll);
  updateStats('ds', dsScoresTest, dsScoresAll);
  createScoreDistributionChart('dsScoreDistributionChart', 'DS', dsScoresTest, dsScoresAll);

  // SQL 데이터
  const sqlCorrectAnswersTest = [18, 22, 20];
  const sqlCorrectAnswersAll = [28, 32, 30];
  const sqlScoresTest = [60, 65, 70, 75, 80, 85, 90];
  const sqlScoresAll = [55, 60, 65, 70, 75, 80, 85, 90, 95];

  createCorrectAnswersChart('sqlCorrectAnswersChart', 'SQL', sqlCorrectAnswersTest, sqlCorrectAnswersAll);
  updateStats('sql', sqlScoresTest, sqlScoresAll);
  createScoreDistributionChart('sqlScoreDistributionChart', 'SQL', sqlScoresTest, sqlScoresAll);
}

// DOMContentLoaded 이벤트 리스너를 수정합니다.
document.addEventListener('DOMContentLoaded', function () {
  // 현재 페이지 URL을 확인
  const currentPage = window.location.pathname.split("/").pop();

  if (currentPage === 'index.html' || currentPage === '') {
      // index.html 페이지일 경우
      showTab('overview');
      setupEvaluatorTableClickEvents();
  } else if (currentPage === 'test-result.html') {
      // test-result.html 페이지일 경우
      showTab('evaluation');
      showTab('ds'); // DS 탭을 기본으로 보여줍니다
      loadData();
  }
});

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
