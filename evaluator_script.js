

function updateScoreProgressColors() {
  const scoreProgressBars = document.querySelectorAll('.score-progress');
  scoreProgressBars.forEach(bar => {
    const width = parseFloat(bar.style.width);
    if (width < 70) {
      bar.classList.add('low-score');
    } else {
      bar.classList.remove('low-score');
    }
  });
}

function openTab(tabName) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablink");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(tabName).style.display = "block";
  event.currentTarget.className += " active";
  
  // 서브탭의 첫 번째 탭을 자동으로 열기
  var firstSubTab = document.getElementById(tabName).getElementsByClassName("subtablink")[0];
  if (firstSubTab) {
    firstSubTab.click();
  }
  
  updateTabContent(tabName);
}
function updateTabContent(tabName) {
  if (tabName === 'ds' || tabName === 'sql') {
    updateCompetencyInfo();
    runAnimations(tabName);
  }
}
function openSubTab(subTabName, parentTabName, event) {
  subtabcontent = document.getElementById(parentTabName).getElementsByClassName("subtabcontent");
  for (i = 0; i < subtabcontent.length; i++) {
    subtabcontent[i].style.display = "none";
  }
  subtablinks = document.getElementById(parentTabName).getElementsByClassName("subtablink");
  for (i = 0; i < subtablinks.length; i++) {
    subtablinks[i].className = subtablinks[i].className.replace(" active", "");
  }
  document.getElementById(subTabName).style.display = "block";
  event.currentTarget.className += " active";
  
  setTimeout(updateScoreProgressColors, 100);
  if (subTabName.includes('list')) {
    showSuspiciousActivities(parentTabName);
  }
}

function showSuspiciousActivities(parentTabName) {
  const tableId = parentTabName === 'ds' ? 'dsSuspiciousActivities' : 'sqlSuspiciousActivities';
  const table = document.getElementById(tableId);
  
  if (table) {
    // 테이블 데이터 표시
    const tbody = table.querySelector('tbody');
    tbody.innerHTML = ''; // 기존 데이터 삭제

    const activities = parentTabName === 'ds' ? dsSuspiciousActivities : sqlSuspiciousActivities;

    activities.forEach(activity => {
      const row = tbody.insertRow();
      row.insertCell(0).textContent = activity.time;
      row.insertCell(1).textContent = activity.problemNumber;
      row.insertCell(2).textContent = activity.activityType;
      
      // 영상 확인 링크 추가
      const videoCell = row.insertCell(3);
      const videoLink = document.createElement('a');
      videoLink.href = activity.videoLink;
      videoLink.textContent = '확인';
      videoLink.target = '_blank'; // 새 탭에서 열기
      videoCell.appendChild(videoLink);
    });

    table.style.display = 'table';
  }
}
// 페이지 로드 시 첫 번째 탭을 자동으로 열기
document.addEventListener('DOMContentLoaded', function() {
  document.getElementsByClassName("tablink")[0].click();
  const code = `import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.feature_selection import SelectKBest, f_regression
from sklearn.metrics import mean_squared_error, r2_score
from sklearn.ensemble import RandomForestRegressor
from sklearn.linear_model import LinearRegression, Ridge, Lasso
import matplotlib.pyplot as plt
import codepresso_util as cu

# Preprocessing
def evaluate_model():
movies_df = pd.read_csv('data.csv', low_memory=False)

features = ['budget', 'popularity', 'runtime', 'vote_average', 'vote_count']
target = 'revenue'

movies_df = movies_df.dropna(subset=features + [target])

X = movies_df[features]
y = movies_df[target]

# model prediction and evaluation
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

selector = SelectKBest(score_func=f_regression, k=2)
X_train_selected = selector.fit_transform(X_train_scaled, y_train)
X_test_selected = selector.transform(X_test_scaled)

selected_features = X.columns[selector.get_support()].tolist()

models = {
'Random Forest': RandomForestRegressor(n_estimators=100, random_state=42),
'Linear Regression': LinearRegression(),
'Ridge Regression': Ridge(alpha=1.0),
'Lasso Regression': Lasso(alpha=1.0)
}

model_scores = {}
for name, model in models.items():
model.fit(X_train_selected, y_train)
y_pred = model.predict(X_test_selected)
mse = mean_squared_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)
model_scores[name] = {'MSE': mse, 'R2': r2}

best_model_name = min(model_scores, key=lambda x: model_scores[x]['MSE'])
best_model = models[best_model_name]

print(f"Best model: {best_model_name}")
print(f"Best MSE: {model_scores[best_model_name]['MSE']}")
print(f"Best R2: {model_scores[best_model_name]['R2']}")

y_pred = best_model.predict(X_test_selected)

# Visualization
plt.figure(figsize=(10, 6))
plt.scatter(y_test, y_pred, alpha=0.5)
plt.plot([y_test.min(), y_test.max()], [y_test.min(), y_test.max()], 'r--', lw=2)
plt.xlabel('Actual Revenue')
plt.ylabel('Predicted Revenue')
plt.title(f'Actual vs Predicted Box Office Revenue\\nusing {best_model_name}')
plt.show()

return selected_features, best_model_name

# $ANNOTATION_2
cu.validate(evaluate_model)`;

document.getElementById("codeEditor").textContent = code;
addTagClickListeners();
highlightCode();
});

// 페이지 로드 시 초기 상태 설정
document.addEventListener('DOMContentLoaded', function () {
  // DS 탭의 초기 서브 탭 설정
  document.getElementById('chartTab').style.display = "block";
  // document.querySelector('#ds .sub-tab-button').classList.add("active");
  document.querySelector('.tab-button[onclick="openTab(\'ds\')"]').addEventListener('click', function () {
    openTab('ds');
  });
  // SQL 탭의 초기 서브 탭 설정
  document.getElementById('sqlChartTab').style.display = "block";
  // document.querySelector('#sql .sub-tab-button').classList.add("active");
  document.querySelector('.tab-button[onclick="openTab(\'sql\')"]').addEventListener('click', function () {
    openTab('sql');
  });
  const toggleInputs = document.querySelectorAll('.toggle-input');
  toggleInputs.forEach(input => {
    input.addEventListener('change', function () {
      const contentId = this.closest('.toggle-container').querySelector('div').id;
      const content = document.getElementById(contentId);
      if (this.checked) {
        content.style.display = 'block';
      } else {
        content.style.display = 'none';
      }
    });
  });
  const closeBtn = document.querySelector('.close');
  updateCompetencyInfo();
});


function runAnimations(tabName) {
  document.querySelectorAll('.time-progress').forEach(el => {
    el.style.width = '0%';
  });

  setTimeout(() => {
    if (tabName === 'ds') {
      document.getElementById('dsTimeProgress').style.width = '91.7%';
    } else if (tabName === 'sql') {
      document.getElementById('sqlTimeProgress').style.width = '83.3%';
    }
  }, 100);
}


function createScoreDistributionChart(canvasId, label, data, score) {
  const ctx = document.getElementById(canvasId);
  if (!ctx) {
    console.error(`Canvas with id ${canvasId} not found`);
    return;
  }
  const labels = ['0-20', '21-40', '41-60', '61-80', '81-100'];
  const scoreIndex = Math.floor(score / 20);
  
  if (window.myChart && window.myChart[canvasId]) {
    window.myChart[canvasId].destroy();
  }

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: label + ' 점수 분포',
        data: data,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderWidth: 2,
        pointRadius: 5,
        pointBackgroundColor: 'rgba(75, 192, 192, 1)',
        fill: true
      }, {
        label: '평가자 점수',
        data: labels.map((_, index) => index === scoreIndex ? score : null),
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 2,
        pointRadius: 7,
        pointStyle: 'dot'
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          title: { display: true, text: '인원 수' }
        },
        x: {
          title: { display: true, text: '점수 구간' }
        }
      },
      plugins: {
        legend: { display: true },
        title: { display: true, text: label + ' 평가 참가자 점수 분포' },
        tooltip: {
          callbacks: {
            label: function (context) {
              if (context.dataset.label === '평가자 점수') {
                return `평가자 점수: ${score}`;
              }
              return `${context.dataset.label}: ${context.parsed.y}명`;
            }
          }
        }
      }
    }
  });
}

function getCompetencyDescription(score, field) {
  if (field === 'DS') {
    if (score >= 80) return "데이터 사이언스 분야에서 뛰어난 역량을 보여주고 있습니다.데이터 전처리, 특성 스케일링, 시각화 등의 핵심 기술을 능숙하게 다룰 수 있습니다. 복잡한 데이터셋을 효과적으로 분석하고 인사이트를 도출할 수 있는 능력을 갖추고 있습니다.";
    else if (score >= 60) return "데이터 사이언스의 기본 개념을 잘 이해하고 있으며, 실무에 적용할 수 있는 수준입니다. 기본적인 데이터 분석과 모델링 작업을 수행할 수 있지만, 더 복잡한 문제에 대해서는 추가적인 학습이 필요할 수 있습니다.";
    else return "데이터 사이언스의 기초 개념을 이해하고 있지만, 더 많은 학습과 실습이 필요합니다. 기본적인 데이터 처리와 분석은 가능하지만, 고급 기술의 적용에는 어려움이 있을 수 있습니다.";
  } else if (field === 'SQL') {
    if (score >= 80) return "SQL을 능숙하게 다루며, 복잡한 쿼리를 작성하고 최적화할 수 있는 수준입니다. 대규모 데이터베이스에서 효율적으로 데이터를 추출하고 조작할 수 있는 고급 기술을 보유하고 있습니다.";
    else if (score >= 60) return "SQL의 기본 문법을 이해하고 일반적인 데이터베이스 작업을 수행할 수 있는 수준입니다. 간단한 쿼리부터 중간 수준의 복잡한 쿼리까지 작성할 수 있지만, 더 복잡한 최적화 기법에 대해서는 추가 학습이 필요할 수 있습니다.";
    else return "SQL의 기초를 이해하고 있지만, 더 복잡한 쿼리 작성 능력을 향상시킬 필요가 있습니다. 기본적인 SELECT, INSERT, UPDATE, DELETE 문은 사용할 수 있지만, 조인이나 서브쿼리 등의 고급 기능 사용에는 어려움이 있을 수 있습니다.";
  }
}
function getCompetencyComments(scores, field) {
  const comments = [];
  if (field === 'DS') {
    if (scores.preprocessing >= 30) comments.push("데이터 전처리 능력이 우수합니다. 다양한 데이터 유형에 대한 효과적인 정제 및 변환 기술을 보유하고 있습니다.");
    else comments.push("데이터 전처리 기술을 더 향상시킬 필요가 있습니다. 결측치 처리, 이상치 탐지, 데이터 정규화 등의 기법에 대한 추가 학습이 도움이 될 것입니다.");

    if (scores.featureScaling >= 28) comments.push("특성 스케일링을 효과적으로 수행할 수 있습니다. 다양한 스케일링 기법을 상황에 맞게 적용할 수 있는 능력이 돋보입니다.");
    else comments.push("특성 스케일링 기법에 대한 추가 학습이 필요합니다. 정규화, 표준화 등 다양한 스케일링 방법의 특성과 적용 시기에 대한 이해를 깊게 할 필요가 있습니다.");

    if (scores.visualization >= 27) comments.push("데이터 시각화 능력이 뛰어납니다. 복잡한 데이터를 효과적으로 표현하고 인사이트를 도출할 수 있는 시각화 기술을 보유하고 있습니다.");
    else comments.push("데이터 시각화 기술을 더 발전시킬 필요가 있습니다. 다양한 차트 유형과 시각화 라이브러리 사용법에 대한 추가 학습이 도움이 될 것입니다.");
  } else if (field === 'SQL') {
    if (scores.dataRetrieval >= 25) comments.push("데이터 검색 능력이 우수합니다. 복잡한 조건을 가진 쿼리를 효율적으로 작성할 수 있습니다.");
    else comments.push("데이터 검색 쿼리 작성 능력을 향상시킬 필요가 있습니다. WHERE 절의 다양한 조건 사용과 서브쿼리 활용 등에 대한 추가 학습이 도움이 될 것입니다.");

    if (scores.dataFiltering >= 28) comments.push("데이터 필터링을 효과적으로 수행할 수 있습니다. 복잡한 조건을 사용한 데이터 필터링 능력이 뛰어납니다.");
    else comments.push("데이터 필터링 기법에 대한 추가 학습이 필요합니다. 고급 WHERE 절 사용법과 HAVING 절 활용 등에 대한 이해를 깊게 할 필요가 있습니다.");

    if (scores.dataJoining >= 25) comments.push("데이터 조인 능력이 뛰어납니다. 다양한 조인 유형을 상황에 맞게 적절히 사용할 수 있습니다.");
    else comments.push("데이터 조인 기술을 더 발전시킬 필요가 있습니다. INNER JOIN, OUTER JOIN, CROSS JOIN 등 다양한 조인 유형과 그 활용에 대한 추가 학습이 도움이 될 것입니다.");
  }
  return comments;
}

function updateCompetencyInfo() {
  const dsScore = 85;
  const sqlScore = 70;
  const dsScores = { preprocessing: 30, featureScaling: 28, visualization: 27 };
  const sqlScores = { dataRetrieval: 15, dataFiltering: 30, dataJoining: 20 };

  document.getElementById('dsCompetencyDescription').textContent = getCompetencyDescription(dsScore, 'DS');
  document.getElementById('sqlCompetencyDescription').textContent = getCompetencyDescription(sqlScore, 'SQL');

  const dsComments = getCompetencyComments(dsScores, 'DS');
  const sqlComments = getCompetencyComments(sqlScores, 'SQL');

  document.getElementById('dsCompetencyComments').innerHTML = dsComments.map(comment => `<li>${comment}</li>`).join('');
  document.getElementById('sqlCompetencyComments').innerHTML = sqlComments.map(comment => `<li>${comment}</li>`).join('');

  // 분포 그래프 생성
  createScoreDistributionChart('dsScoreDistributionChart', 'DS', [5, 10, 20, 30, 35], dsScore);
  createScoreDistributionChart('sqlScoreDistributionChart', 'SQL', [8, 15, 25, 28, 24], sqlScore);
}

function createGanttChart(canvasId, data) {
  const ctx = document.getElementById(canvasId).getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: data,
    options: {
      indexAxis: 'y',
      scales: {
        x: {
          type: 'linear',
          position: 'top',
          title: {
            display: true,
            text: '시간 (분)'
          }
        },
        y: {
          title: {
            display: true,
            text: '문제'
          }
        }
      },
      plugins: {
        legend: {
          display: true,
          position: 'bottom'
        },
        tooltip: {
          callbacks: {
            title: function (context) {
              return context[0].dataset.label;
            },
            label: function (context) {
              const start = context.raw.x[0];
              const end = context.raw.x[1];
              return `${context.label}: ${start}분 - ${end}분`;
            }
          }
        }
      }
    }
  });
}

function populateSuspiciousActivitiesTable(tableId, activities) {
  const tableBody = document.querySelector(`#${tableId} tbody`);
  activities.forEach(activity => {
    const row = tableBody.insertRow();
    row.insertCell(0).textContent = activity.time;
    row.insertCell(1).textContent = activity.problem;
    row.insertCell(2).textContent = activity.type;
    const detailCell = row.insertCell(3);
    if (activity.detail === '동영상 재생버튼') {
      detailCell.innerHTML = '<i class="fas fa-play-circle"></i> ';
    } else {
      detailCell.textContent = activity.detail;
    }
  });
}

// DS 간트 차트 데이터
const dsGanttData = {
  labels: ['문제 1', '문제 2', '문제 3', '문제 4'],
  datasets: [
    {
      label: '문제 풀이',
      data: [
        { x: [0, 25], y: '문제 1' },
        { x: [30, 60], y: '문제 2' },
        { x: [65, 90], y: '문제 3' },
        { x: [95, 110], y: '문제 4' }
      ],
      backgroundColor: 'rgba(75, 192, 192, 0.6)'
    },
    {
      label: '탭 전환',
      data: [
        { x: [15, 17], y: '문제 1' },
        { x: [45, 47], y: '문제 2' },
        { x: [80, 82], y: '문제 3' }
      ],
      backgroundColor: 'rgba(255, 99, 132, 0.6)'
    },
    {
      label: '복사 붙여넣기',
      data: [
        { x: [5, 6], y: '문제 1' },
        { x: [50, 53], y: '문제 2' },
        { x: [67, 70], y: '문제 3' }
      ],
      backgroundColor: '#e4ec9a'
    }
  ]
};

// SQL 간트 차트 데이터
const sqlGanttData = {
  labels: ['문제 1', '문제 2', '문제 3', '문제 4'],
  datasets: [
    {
      label: '문제 풀이',
      data: [
        { x: [0, 20], y: '문제 1' },
        { x: [25, 50], y: '문제 2' },
        { x: [55, 75], y: '문제 3' },
        { x: [80, 100], y: '문제 4' }
      ],
      backgroundColor: 'rgba(75, 192, 192, 0.6)'
    },
    {
      label: '탭 전환',
      data: [
        { x: [10, 12], y: '문제 1' },
        { x: [35, 37], y: '문제 2' },
        { x: [65, 67], y: '문제 3' }
      ],
      backgroundColor: 'rgba(255, 99, 132, 0.6)'
    },
    {
      label: '복사 붙여넣기',
      data: [
        { x: [5, 6], y: '문제 1' },
        { x: [40, 42], y: '문제 2' },
        { x: [70, 72], y: '문제 3' }
      ],
      backgroundColor: '#e4ec9a'
    }
  ]
};

// DS 부정행위 데이터
const dsSuspiciousActivities = [
  { time: '00:15:00', problem: '1번문제', type: '탭 전환', detail: '동영상 재생버튼' },
  { time: '00:05:00', problem: '1번문제', type: '복사 붙여넣기', detail: '동영상 재생버튼' },
  { time: '00:45:00', problem: '2번문제', type: '탭 전환', detail: '동영상 재생버튼' },
  { time: '00:50:00', problem: '2번문제', type: '복사 붙여넣기', detail: '동영상 재생버튼' },
  { time: '01:20:00', problem: '3번문제', type: '탭 전환', detail: '동영상 재생버튼' },
  { time: '01:07:00', problem: '3번문제', type: '복사 붙여넣기', detail: '동영상 재생버튼' }
];

// SQL 부정행위 데이터
const sqlSuspiciousActivities = [
  { time: '00:10:00', problem: '1번문제', type: '탭 전환', detail: '동영상 재생버튼' },
  { time: '00:05:00', problem: '1번문제', type: '복사 붙여넣기', detail: '동영상 재생버튼' },
  { time: '00:35:00', problem: '2번문제', type: '탭 전환', detail: '동영상 재생버튼' },
  { time: '00:40:00', problem: '2번문제', type: '복사 붙여넣기', detail: '동영상 재생버튼' },
  { time: '00:65:00', problem: '3번문제', type: '탭 전환', detail: '동영상 재생버튼' },
  { time: '00:70:00', problem: '3번문제', type: '복사 붙여넣기', detail: '동영상 재생버튼' },
  { time: '00:75:00', problem: '3번문제', type: '탭 전환', detail: '동영상 재생버튼' },
  { time: '00:85:00', problem: '4번문제', type: '탭 전환', detail: '동영상 재생버튼' },
  { time: '00:90:00', problem: '4번문제', type: '복사 붙여넣기', detail: '동영상 재생버튼' },
  { time: '00:95:00', problem: '4번문제', type: '탭 전환', detail: '동영상 재생버튼' }
];

// 차트 및 테이블 생성
createGanttChart('ganttChart', dsGanttData);
createGanttChart('sqlGanttChart', sqlGanttData);
populateSuspiciousActivitiesTable('suspiciousActivitiesTable', dsSuspiciousActivities);
populateSuspiciousActivitiesTable('sqlSuspiciousActivitiesTable', sqlSuspiciousActivities);




function highlightCode() {
  hljs.highlightElement(document.getElementById("codeEditor"));
}


function highlightCodeSection(tagName) {
  const codeEditor = document.getElementById("codeEditor");
  const codeLines = codeEditor.textContent.split('\n');
  let inSection = false;
  const highlightedLines = codeLines.map(line => {
    if (line.includes(`# ${tagName}`)) {
      inSection = true;
      return `<span class="highlighted-line">${line}</span>`;
    } else if (line.includes('#') && inSection) {
      inSection = false;
    }
    return inSection ? `<span class="highlighted-line">${line}</span>` : line;
  });
  codeEditor.innerHTML = highlightedLines.join('\n');
}

function closeCodePopup() {
  document.getElementById("codePopup").style.display = "none";
}

// 팝업창 외부 클릭 시 닫기
window.onclick = function (event) {
  if (event.target == document.getElementById("codePopup")) {
    closeCodePopup();
  }
}
function addTagClickListeners() {
  const tags = document.querySelectorAll('.tag');
  tags.forEach(tag => {
    tag.addEventListener('click', function () {
      const tagName = this.getAttribute('data-tag');
      highlightCodeSection(tagName);
    });
  });
}
