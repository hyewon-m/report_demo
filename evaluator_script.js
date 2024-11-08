

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
  const ctx = document.getElementById(canvasId).getContext('2d');
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
        label: label + ' Score Distribution',
        data: data,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderWidth: 2,
        pointRadius: 5,
        pointBackgroundColor: 'rgba(75, 192, 192, 1)',
        fill: true
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          title: { display: true, text: 'Number of Candidates' }
        },
        x: {
          title: { display: true, text: 'Score Range' }
        }
      },
      plugins: {
        legend: { display: true },
        tooltip: {
          callbacks: {
            label: function (context) {
              return `${context.dataset.label}: ${context.parsed.y} Candidates`;
            }
          }
        },
        annotation: {
          annotations: {
            line1: {
              type: 'line',
              xMin: scoreIndex,
              xMax: scoreIndex,
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 2,
              label: {
                content: `Evaluator Score: ${score}`,
                enabled: true,
                position: 'top'
              }
            }
          }
        }
      }
    }
  });
}

function getCompetencyDescription(score, field) {
  if (field === 'DS') {
    if (score >= 80) return "You demonstrate excellent competence in the field of data science. You can skillfully handle core techniques such as data preprocessing, feature scaling, and visualization. You have the ability to effectively analyze complex datasets and derive insights.";
    else if (score >= 60) return "You have a good understanding of basic data science concepts and can apply them in practical situations. You can perform basic data analysis and modeling tasks, but may need additional learning for more complex problems.";
    else return "You understand the basic concepts of data science, but more learning and practice are needed. Basic data processing and analysis are possible, but you may have difficulties applying advanced techniques.";
  } else if (field === 'SQL') {
    if (score >= 80) return "You are proficient in SQL and can write and optimize complex queries. You possess advanced skills to efficiently extract and manipulate data from large-scale databases.";
    else if (score >= 60) return "You understand the basic syntax of SQL and can perform common database operations. You can write simple to moderately complex queries, but may need additional learning for more complex optimization techniques.";
    else return "You understand the basics of SQL, but need to improve your ability to write more complex queries. You can use basic SELECT, INSERT, UPDATE, DELETE statements, but may have difficulties with advanced features like joins or subqueries.";
  }
}

function getCompetencyComments(scores, field) {
  const comments = [];
  if (field === 'DS') {
    if (scores.preprocessing >= 30) comments.push("Your data preprocessing skills are excellent. You have effective refinement and transformation techniques for various data types.");
    else comments.push("You need to improve your data preprocessing techniques. Additional learning on handling missing values, outlier detection, and data normalization would be beneficial.");

    if (scores.featureScaling >= 28) comments.push("You can perform feature scaling effectively. Your ability to apply various scaling techniques appropriately to different situations is noteworthy.");
    else comments.push("You need additional learning on feature scaling techniques. A deeper understanding of various scaling methods like normalization, standardization, and when to apply them is necessary.");

    if (scores.visualization >= 27) comments.push("Your data visualization skills are outstanding. You have the visualization techniques to effectively represent complex data and derive insights.");
    else comments.push("You need to further develop your data visualization skills. Additional learning on various chart types and the use of visualization libraries would be helpful.");
  } else if (field === 'SQL') {
    if (scores.dataRetrieval >= 25) comments.push("Your data retrieval skills are excellent. You can efficiently write queries with complex conditions.");
    else comments.push("You need to improve your data retrieval query writing skills. Additional learning on using various conditions in WHERE clauses and utilizing subqueries would be beneficial.");

    if (scores.dataFiltering >= 28) comments.push("You can perform data filtering effectively. Your ability to use complex conditions for data filtering is outstanding.");
    else comments.push("You need additional learning on data filtering techniques. A deeper understanding of advanced WHERE clause usage and HAVING clause utilization is necessary.");

    if (scores.dataJoining >= 25) comments.push("Your data joining skills are excellent. You can appropriately use various join types according to the situation.");
    else comments.push("You need to further develop your data joining skills. Additional learning on various join types such as INNER JOIN, OUTER JOIN, CROSS JOIN, and their applications would be helpful.");
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
            text: 'Time (minutes)'
          }
        },
        y: {
          title: {
            display: true,
            text: 'Question'
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
              return `${context.label}: ${start}min - ${end}min`;
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
    if (activity.detail === 'Video play button') {
      detailCell.innerHTML = '<i class="fas fa-play-circle"></i> ';
    } else {
      detailCell.textContent = activity.detail;
    }
  });
}

// DS Gantt chart data
const dsGanttData = {
  labels: ['Question 1', 'Question 2', 'Question 3', 'Question 4'],
  datasets: [
    {
      label: 'Question Solving',
      data: [
        { x: [0, 25], y: 'Question 1' },
        { x: [30, 60], y: 'Question 2' },
        { x: [65, 90], y: 'Question 3' },
        { x: [95, 110], y: 'Question 4' }
      ],
      backgroundColor: 'rgba(75, 192, 192, 0.6)'
    },
    {
      label: 'Tab Switching',
      data: [
        { x: [15, 17], y: 'Question 1' },
        { x: [45, 47], y: 'Question 2' },
        { x: [80, 82], y: 'Question 3' }
      ],
      backgroundColor: 'rgba(255, 99, 132, 0.6)'
    },
    {
      label: 'Copy and Paste',
      data: [
        { x: [5, 6], y: 'Question 1' },
        { x: [50, 53], y: 'Question 2' },
        { x: [67, 70], y: 'Question 3' }
      ],
      backgroundColor: '#e4ec9a'
    }
  ]
};

// SQL Gantt chart data
const sqlGanttData = {
  labels: ['Question 1', 'Question 2', 'Question 3', 'Question 4'],
  datasets: [
    {
      label: 'Question Solving',
      data: [
        { x: [0, 20], y: 'Question 1' },
        { x: [25, 50], y: 'Question 2' },
        { x: [55, 75], y: 'Question 3' },
        { x: [80, 100], y: 'Question 4' }
      ],
      backgroundColor: 'rgba(75, 192, 192, 0.6)'
    },
    {
      label: 'Tab Switching',
      data: [
        { x: [10, 12], y: 'Question 1' },
        { x: [35, 37], y: 'Question 2' },
        { x: [65, 67], y: 'Question 3' }
      ],
      backgroundColor: 'rgba(255, 99, 132, 0.6)'
    },
    {
      label: 'Copy and Paste',
      data: [
        { x: [5, 6], y: 'Question 1' },
        { x: [40, 42], y: 'Question 2' },
        { x: [70, 72], y: 'Question 3' }
      ],
      backgroundColor: '#e4ec9a'
    }
  ]
};

// DS suspicious activities data
const dsSuspiciousActivities = [
  { time: '00:15:00', problem: 'Question 1', type: 'Tab Switching', detail: 'Video play button' },
  { time: '00:05:00', problem: 'Question 1', type: 'Copy and Paste', detail: 'Video play button' },
  { time: '00:45:00', problem: 'Question 2', type: 'Tab Switching', detail: 'Video play button' },
  { time: '00:50:00', problem: 'Question 2', type: 'Copy and Paste', detail: 'Video play button' },
  { time: '01:20:00', problem: 'Question 3', type: 'Tab Switching', detail: 'Video play button' },
  { time: '01:07:00', problem: 'Question 3', type: 'Copy and Paste', detail: 'Video play button' }
];

// SQL suspicious activities data
const sqlSuspiciousActivities = [
  { time: '00:10:00', problem: 'Question 1', type: 'Tab Switching', detail: 'Video play button' },
  { time: '00:05:00', problem: 'Question 1', type: 'Copy and Paste', detail: 'Video play button' },
  { time: '00:35:00', problem: 'Question 2', type: 'Tab Switching', detail: 'Video play button' },
  { time: '00:40:00', problem: 'Question 2', type: 'Copy and Paste', detail: 'Video play button' },
  { time: '00:65:00', problem: 'Question 3', type: 'Tab Switching', detail: 'Video play button' },
  { time: '00:70:00', problem: 'Question 3', type: 'Copy and Paste', detail: 'Video play button' },
  { time: '00:75:00', problem: 'Question 3', type: 'Tab Switching', detail: 'Video play button' },
  { time: '00:85:00', problem: 'Question 4', type: 'Tab Switching', detail: 'Video play button' },
  { time: '00:90:00', problem: 'Question 4', type: 'Copy and Paste', detail: 'Video play button' },
  { time: '00:95:00', problem: 'Question 4', type: 'Tab Switching', detail: 'Video play button' }
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


function addTagClickListeners() {
  const tags = document.querySelectorAll('.tag');
  tags.forEach(tag => {
    tag.addEventListener('click', function () {
      const tagName = this.getAttribute('data-tag');
      highlightCodeSection(tagName);
    });
  });
}
