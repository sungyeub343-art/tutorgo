import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const siteUrl = "https://tutorgo.kr";
const phoneNumber = "010-2928-3614";

const regions = [
  { slug: "changwon", name: "창원", type: "시", areas: "성산구, 의창구, 마산합포구, 마산회원구, 진해구", focus: "생활권과 학교별 시험 일정에 맞춘 내신 관리" },
  { slug: "jinju", name: "진주", type: "시", areas: "충무공동, 평거동, 초전동, 가좌동, 신안동", focus: "혁신도시와 구도심 학군을 아우르는 학교별 대비" },
  { slug: "tongyeong", name: "통영", type: "시", areas: "무전동, 광도면, 북신동, 미수동, 도남동", focus: "개념 이해와 서술형 풀이를 연결하는 내신 대비" },
  { slug: "sacheon", name: "사천", type: "시", areas: "사천읍, 정동면, 용현면, 벌리동, 향촌동", focus: "학생 일정과 학교 진도에 맞춘 꾸준한 학습 관리" },
  { slug: "gimhae", name: "김해", type: "시", areas: "장유동, 내외동, 삼계동, 율하동, 진영읍", focus: "다양한 학교 진도에 맞춘 취약 단원 집중 관리" },
  { slug: "miryang", name: "밀양", type: "시", areas: "내이동, 삼문동, 가곡동, 하남읍, 부북면", focus: "기초 연산부터 내신 응용까지 이어지는 단계별 수업" },
  { slug: "geoje", name: "거제", type: "시", areas: "고현동, 상문동, 수양동, 옥포동, 아주동", focus: "학교 일정과 학생 생활 패턴을 반영한 맞춤 진도" },
  { slug: "yangsan", name: "양산", type: "시", areas: "물금읍, 동면, 중부동, 평산동, 덕계동", focus: "신도시 생활권과 학교별 내신 흐름에 맞춘 학습 설계" },
  { slug: "uiryeong", name: "의령", type: "군", areas: "의령읍, 부림면, 지정면, 정곡면, 가례면", focus: "개인별 진도와 반복 학습으로 만드는 기초 자신감" },
  { slug: "haman", name: "함안", type: "군", areas: "가야읍, 칠원읍, 군북면, 대산면, 법수면", focus: "학년 전환기에 필요한 복습과 선행의 균형" },
  { slug: "changnyeong", name: "창녕", type: "군", areas: "창녕읍, 남지읍, 영산면, 대합면, 부곡면", focus: "취약 단원 진단과 시험 범위 중심의 밀착 관리" },
  { slug: "goseong", name: "고성", type: "군", areas: "고성읍, 회화면, 거류면, 동해면, 하이면", focus: "학생별 진도 격차를 줄이는 맞춤 커리큘럼" },
  { slug: "namhae", name: "남해", type: "군", areas: "남해읍, 창선면, 이동면, 삼동면, 미조면", focus: "거리와 일정을 고려한 대면·온라인 맞춤 수업" },
  { slug: "hadong", name: "하동", type: "군", areas: "하동읍, 진교면, 금남면, 옥종면, 화개면", focus: "개념 반복과 풀이 설명으로 키우는 자기주도 학습" },
  { slug: "sancheong", name: "산청", type: "군", areas: "산청읍, 신안면, 단성면, 시천면, 생초면", focus: "통학과 생활 패턴을 고려한 안정적인 학습 관리" },
  { slug: "hamyang", name: "함양", type: "군", areas: "함양읍, 안의면, 수동면, 서상면, 마천면", focus: "핵심 개념과 문제 적용을 연결하는 일대일 수업" },
  { slug: "geochang", name: "거창", type: "군", areas: "거창읍, 가조면, 위천면, 남상면, 웅양면", focus: "학교 진도와 진학 목표를 반영한 체계적인 내신 관리" },
  { slug: "hapcheon", name: "합천", type: "군", areas: "합천읍, 초계면, 삼가면, 야로면, 가야면", focus: "학습 공백을 줄이고 실전 문제 해결력을 높이는 수업" }
];

const grades = [
  ["예비중1", "초등 계산 습관을 점검하고 문자와 식, 기본 도형으로 이어지는 중학 수학의 첫 틀을 만듭니다."],
  ["예비중2", "일차방정식과 함수의 기초를 다시 확인한 뒤 식의 계산과 연립방정식을 안정적으로 연결합니다."],
  ["예비중3", "고등 수학과 바로 이어지는 함수·방정식·도형의 핵심 개념을 복습하고 내신 난도를 높입니다."],
  ["예비고1", "중학 전 범위의 취약점을 진단하고 공통수학의 다항식, 방정식, 경우의 수를 체계적으로 시작합니다."],
  ["예비고2", "공통수학의 빈틈을 보완하면서 학교 선택 과목과 진로에 맞춰 대수·미적분Ⅰ·확률과 통계 학습 순서를 설계합니다."],
  ["예비고3", "수능 출제 단원별 개념과 기출을 연결하고, 제한 시간 안에 점수를 만드는 실전 루틴을 완성합니다."]
];

// 학교급별 상세 페이지(/regions/{지역}/{학교급}/). {r}=지역명, {full}=시·군 포함 지역명, {areas}=주요 생활권
const levels = [
  {
    slug: "elementary", name: "초등", student: "초등학생", range: "초1~초6",
    title: "기초수학·수학공부 1:1 수업",
    summary: "연산 정확도와 문장제 해석력, 스스로 공부하는 습관까지 잡는 초등 1:1 수학",
    intro: "초등 수학은 진도를 빨리 나가는 것보다 계산 원리와 문제 읽는 힘을 정확하게 만드는 것이 먼저입니다. 아이가 왜 그렇게 풀었는지 말로 설명할 수 있을 때까지 확인합니다.",
    topics: [
      ["수학수업", "교과서 단원 순서에 맞춰 개념을 그림과 구체적인 예로 먼저 이해하고, 같은 원리의 문제를 말로 설명하며 풀어 봅니다. 한 번의 수업 안에서 개념 설명, 확인 문제, 오답 정리까지 마무리합니다."],
      ["수학공부", "매일 15~20분 연산, 주 2~3회 문장제 풀이처럼 아이가 지킬 수 있는 분량으로 수학공부 습관을 만듭니다. 과제 결과는 다음 수업에서 바로 확인하고 학부모님께 공유합니다."],
      ["기초수학", "받아올림·받아내림, 곱셈구구, 분수와 소수처럼 다음 학년의 발목을 잡는 기초를 학년과 관계없이 다시 점검합니다. 부족한 단원은 이전 학년 내용으로 돌아가 빈틈을 메웁니다."]
    ],
    grades: [
      ["초1", "수 세기와 덧셈·뺄셈의 원리를 손으로 익히며 수학에 대한 첫 자신감을 만듭니다."],
      ["초2", "받아올림이 있는 계산과 곱셈구구를 정확하고 빠르게 다지는 시기입니다."],
      ["초3", "나눗셈과 분수가 처음 등장하는 학년으로, 개념을 그림으로 이해하도록 지도합니다."],
      ["초4", "큰 수, 각도, 분수의 덧셈과 뺄셈 등 넓어지는 계산 범위의 정확도를 관리합니다."],
      ["초5", "약수와 배수, 약분과 통분, 분수의 곱셈 등 중학 수학의 바탕이 되는 단원을 집중 점검합니다."],
      ["초6", "비와 비율, 분수·소수의 나눗셈을 마무리하고 예비중1 과정으로 자연스럽게 연결합니다."]
    ],
    faq: [
      ["{r} 초등 수학과외는 몇 학년부터 가능한가요?", "초등 1학년부터 6학년까지 수업합니다. 학년보다 현재 연산·개념 수준을 먼저 확인해 시작 단원을 정합니다."],
      ["기초수학이 많이 부족한데 따라갈 수 있을까요?", "첫 상담에서 진단 문제로 막히는 지점을 찾고, 필요하면 이전 학년 내용부터 다시 다집니다. 1:1 수업이라 아이 속도에 맞춰 진행합니다."]
    ]
  },
  {
    slug: "middle", name: "중등", student: "중학생", range: "중1~중3",
    title: "수학내신·기초수학 1:1 수업",
    summary: "개념, 학교 내신, 고등 선행을 한 흐름으로 관리하는 중등 1:1 수학",
    intro: "중학 수학은 학년이 올라갈수록 이전 단원이 다음 단원의 도구가 됩니다. 학교 진도와 시험 일정을 기준으로 개념, 기초 보완, 내신 대비의 비중을 조절합니다.",
    topics: [
      ["수학수업", "학교 진도에 맞춘 개념 수업과 유형별 문제 적용을 함께 진행합니다. 풀이 과정을 학생이 직접 설명하게 해서 이해한 것과 외운 것을 구분합니다."],
      ["수학공부", "개념 노트, 오답 노트, 주간 과제 분량을 학생과 함께 정해 스스로 공부하는 방법을 익힙니다. 시험이 없는 기간에도 공부 리듬이 끊기지 않도록 관리합니다."],
      ["기초수학", "정수와 유리수 계산, 문자와 식, 일차방정식처럼 이후 모든 단원의 바탕이 되는 기초를 점검합니다. 초등 분수·소수 계산이 약하면 그 부분부터 보완합니다."],
      ["수학내신", "{r} 지역 학교의 시험 범위와 일정에 맞춰 교과서, 학교 프린트, 기출 유형을 정리합니다. 서술형 감점을 줄이도록 풀이 쓰는 법까지 연습합니다."]
    ],
    grades: [
      ["중1", "소인수분해, 정수와 유리수, 일차방정식, 좌표평면과 그래프로 중학 수학의 기초를 세웁니다. 자유학기에도 학습 공백이 생기지 않도록 관리합니다."],
      ["중2", "식의 계산, 연립방정식, 일차함수, 도형의 성질 등 난도가 크게 오르는 학년의 내신을 집중 대비합니다."],
      ["중3", "제곱근과 실수, 인수분해, 이차방정식, 이차함수, 삼각비를 정리하고 고등 공통수학 선행을 준비합니다."]
    ],
    faq: [
      ["{r} 중등 수학내신 대비는 언제부터 시작하나요?", "보통 시험 4~5주 전부터 학교 범위에 맞춘 내신 대비로 전환합니다. 그 전에는 개념 완성과 취약 단원 보완에 집중합니다."],
      ["선행과 내신 중 무엇을 먼저 해야 하나요?", "현재 학년 내용이 안정적일 때 선행을 병행합니다. 기초가 흔들리면 선행 속도를 줄이고 현행 내신부터 다집니다."]
    ]
  },
  {
    slug: "high", name: "고등", student: "고등학생", range: "고1~고3",
    title: "수학내신·수능수학 대비 1:1 수업",
    summary: "학교 내신 등급과 수능 수학을 함께 설계하는 고등 1:1 수학",
    intro: "고등 수학은 공부량보다 공부 순서가 점수를 좌우합니다. 학생의 교육과정과 선택 과목, 목표 대학을 기준으로 내신과 수능 준비의 균형을 잡습니다.",
    topics: [
      ["수학수업", "공통수학부터 대수, 미적분, 확률과 통계까지 학생의 교육과정과 선택 과목에 맞춰 수업합니다. 핵심 예제로 원리를 정리한 뒤 실전 문제로 확장합니다."],
      ["수학공부", "주간 학습 계획표로 개념 복습, 문제 풀이, 오답 재풀이 시간을 나눠 스스로 공부를 끝까지 이어가도록 돕습니다. 학원·학교 일정과 겹치지 않는 현실적인 분량을 정합니다."],
      ["기초수학", "중학 수학의 인수분해, 이차함수, 방정식이 약하면 고등 수학 전체가 흔들립니다. 고등 과정과 병행해 필요한 중학 기초를 짧고 집중적으로 다시 다집니다."],
      ["수학내신", "{r} 고등학교별 출제 경향과 시험 범위를 반영해 교과서, 부교재, 기출 문제를 정리합니다. 등급을 가르는 고난도 문항과 서술형까지 대비합니다."],
      ["수능대비", "학년별 모의고사 결과로 시간 배분과 취약 유형을 분석하고, 수능 일정에 맞춰 개념, 기출, 실전 모의고사 순서로 준비합니다."],
      ["수능수학", "응시 학년에 따라 달라지는 수능 수학 출제 범위를 기준으로 단원별 기출을 분석하고, 고난도 문항 접근법과 실수를 줄이는 검토 루틴을 훈련합니다."]
    ],
    grades: [
      ["고1", "공통수학1·2 전 범위를 다지며 첫 내신 등급의 기준을 만들고, 모의고사 유형에 익숙해지도록 준비합니다."],
      ["고2", "선택 과목 학습과 내신 관리를 병행하면서 수능 출제 범위의 개념을 미리 완성하는 시기입니다."],
      ["고3", "내신 마무리와 수능 기출 분석, 실전 모의고사 훈련으로 남은 기간의 점수 상승 폭을 키웁니다."]
    ],
    faq: [
      ["{r} 고등 수학내신과 수능대비를 함께 할 수 있나요?", "시험 기간에는 학교별 내신 대비에, 그 외 기간에는 수능 개념과 기출 학습에 비중을 두어 두 가지를 함께 관리합니다."],
      ["수능수학 성적이 오르지 않는데 도움이 될까요?", "최근 모의고사를 문항별로 분석해 시간 부족, 개념 공백, 계산 실수 중 원인을 구분하고 그에 맞는 훈련 계획을 세웁니다."]
    ]
  }
];

const commonFaq = [
  ["{full} 어느 지역까지 수업하나요?", "{areas} 등 {full} 전역 학생을 상담합니다. 거리와 일정에 따라 방문 수업 또는 온라인 수업을 안내합니다."],
  ["{r} 수학과외 상담은 어떻게 신청하나요?", `${phoneNumber}로 전화 주시면 학년, 최근 성적, 원하는 수업 목표를 확인한 뒤 수업 방향과 일정을 안내해 드립니다.`]
];

// 집중 프로그램 페이지(/regions/{지역}/{프로그램}/). 학년 전환기·수업 방식 키워드 대응
const programs = [
  {
    slug: "pre-middle", name: "예비중1", label: "초6 → 중1",
    title: "초6 겨울방학 중학수학 준비 1:1",
    summary: "초등 수학의 빈틈을 메우고 중1 첫 시험까지 준비하는 1:1 전환기 수업",
    intro: "중학교에 올라가면 문자와 음수가 등장하고 시험 방식도 달라집니다. 초등 6년의 계산 습관을 점검하고 중1 1학기 개념을 미리 다져 중학 수학을 자신 있게 시작하도록 돕습니다.",
    topics: [
      ["예비중1 수학 선행", "중1 1학기 소인수분해, 정수와 유리수, 문자와 식을 학생 속도에 맞춰 미리 학습합니다. 진도 속도보다 개념을 스스로 설명할 수 있는지를 기준으로 다음 단원으로 넘어갑니다."],
      ["초6 수학 복습", "분수·소수의 사칙연산, 비와 비율, 약수와 배수처럼 중학 수학에 바로 쓰이는 초등 단원을 진단 문제로 점검하고 부족한 부분만 골라 복습합니다."],
      ["중1 첫 시험 대비", "중학교는 학교마다 평가 방식이 다릅니다. 수행평가와 서술형 답안 쓰는 법, 시험 범위에 맞춰 공부 계획을 세우는 법을 미리 연습해 첫 시험의 부담을 줄입니다."],
      ["겨울방학 수학", "겨울방학을 진단, 초등 복습, 중1 개념, 실전 문제 단계로 나눠 계획합니다. 방학이 끝났을 때 중1 1학기 내용을 혼자 복습할 수 있는 상태를 목표로 합니다."]
    ],
    checklist: ["분수·소수 계산에서 실수가 잦은 학생", "중학교 첫 시험이 걱정되는 학생", "학원 진도를 따라가기 버거웠던 학생", "겨울방학을 계획적으로 보내고 싶은 학생"],
    faq: [
      ["{r} 예비중1 수학은 언제 시작하면 좋나요?", "초6 2학기 기말고사가 끝나는 11~12월 시작을 권합니다. 겨울방학 전체를 활용하면 초등 복습과 중1 1학기 개념을 무리 없이 준비할 수 있습니다."],
      ["중학 선행은 어디까지 해야 하나요?", "중1 1학기 개념을 확실히 이해하는 것이 우선입니다. 기초가 탄탄한 학생은 상담 후 2학기 내용까지 이어서 학습합니다."]
    ]
  },
  {
    slug: "pre-high", name: "예비고1", label: "중3 → 고1",
    title: "중3 겨울방학 고등수학 선행 1:1",
    summary: "중학 수학 총정리와 공통수학 선행으로 고1 첫 내신을 준비하는 1:1 전환기 수업",
    intro: "고등학교 첫 시험은 이후 3년의 공부 방향을 정합니다. 중학 핵심 단원의 빈틈을 먼저 확인하고, 공통수학 개념을 내신 수준의 문제까지 연결해 고1을 준비합니다.",
    topics: [
      ["예비고1 수학 선행", "공통수학1의 다항식, 방정식과 부등식, 경우의 수, 행렬을 개념부터 차근차근 학습합니다. 학교 내신 수준의 문제까지 풀 수 있도록 개념과 유형을 함께 다집니다."],
      ["중3 수학 총정리", "인수분해, 이차방정식, 이차함수처럼 고등 수학에서 매일 쓰이는 중학 단원을 진단하고 다시 정리합니다. 고등 선행이 막히는 이유는 대부분 여기서 시작됩니다."],
      ["고1 내신 대비", "고1 첫 중간고사에 맞춰 학교별 출제 경향과 서술형을 고려한 학습 계획을 미리 세웁니다. 시험 범위를 여러 번 반복할 수 있도록 진도를 역산해 준비합니다."],
      ["고1 3월 모의고사", "중학 전 범위에서 출제되는 고1 3월 모의고사에 대비해 제한 시간 안에 푸는 연습과 자주 틀리는 유형 점검을 함께 진행합니다."]
    ],
    checklist: ["인수분해·이차함수가 아직 불안한 학생", "고등학교 첫 내신 등급이 걱정되는 학생", "선행은 했지만 문제 적용이 어려운 학생", "진로와 선택 과목까지 미리 계획하고 싶은 학생"],
    faq: [
      ["{r} 예비고1 수학은 어디까지 선행해야 하나요?", "고1 1학기 내신 범위인 공통수학1을 개념과 기본 유형까지 확실히 하는 것이 우선입니다. 여유가 있으면 공통수학2까지 이어갑니다."],
      ["중학 수학이 약한데 고등 선행을 해도 될까요?", "중학 핵심 단원이 약하면 선행 효과가 떨어집니다. 진단 후 필요한 중학 단원을 짧게 복습하면서 고등 과정과 병행합니다."]
    ]
  },
  {
    slug: "online", name: "온라인", label: "화상 1:1",
    title: "화상 1:1 초·중·고 수학 수업",
    summary: "이동 시간 부담 없이 집에서 받는 초등·중등·고등 1:1 실시간 화상 수학 수업",
    intro: "{full}에서 통학 거리가 길거나 일정이 빠듯한 학생도 같은 기준의 1:1 수업을 받을 수 있도록 온라인 수업을 운영합니다. 진단, 과제, 오답 관리는 대면 수업과 똑같이 진행합니다.",
    topics: [
      ["화상 수학과외", "실시간 화상으로 얼굴을 보며 수업하고, 판서 화면을 공유해 풀이 과정을 함께 확인합니다. 학생이 푼 문제는 사진이나 화면으로 바로 확인해 피드백합니다."],
      ["온라인 수학수업 관리", "수업 내용, 과제 수행, 오답 기록을 매주 정리해 학부모님께 공유합니다. 온라인이라도 학습 관리는 대면 수업과 같은 기준으로 진행합니다."],
      ["온라인 수학내신", "{r} 지역 학교의 시험 범위와 프린트를 미리 받아 온라인으로도 학교별 내신 대비를 진행합니다. 시험 직전에는 수업 횟수와 시간을 조정해 집중 관리합니다."],
      ["대면·온라인 병행", "평소에는 온라인으로 수업하고 필요할 때 대면 수업을 함께하는 방식도 상담할 수 있습니다. 가능 여부는 거리와 일정에 따라 안내해 드립니다."]
    ],
    checklist: ["통학·이동 시간이 부담되는 학생", "주변에서 원하는 수준의 수업을 찾기 어려운 학생", "운동·예체능 등으로 일정이 불규칙한 학생", "집에서 집중해서 공부하고 싶은 학생"],
    faq: [
      ["{r} 온라인 수학과외도 효과가 있나요?", "1:1 실시간 수업이라 질문과 피드백이 바로 이루어집니다. 수업 전 진단과 매주 과제 관리로 대면 수업과 같은 기준으로 학습을 관리합니다."],
      ["온라인 수업에는 무엇이 필요한가요?", "인터넷이 연결된 컴퓨터나 태블릿, 문제 풀이를 촬영할 휴대폰이면 충분합니다. 첫 수업 전에 접속 방법을 안내해 드립니다."]
    ]
  }
];

const css = `@import url('https://fonts.googleapis.com/css2?family=Gowun+Batang:wght@700&family=Pretendard:wght@400;500;600;700;800&display=swap');
:root{--ink:#14231c;--forest:#164b35;--leaf:#2c7451;--lime:#c8e56f;--paper:#f5f2e9;--white:#fff;--line:#d9ddd3;--muted:#647068;--sun:#f2b84b;--radius:8px;--shadow:0 18px 50px rgba(20,35,28,.12)}
*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;color:var(--ink);background:var(--paper);font-family:Pretendard,"Noto Sans KR",sans-serif;line-height:1.65;word-break:keep-all}a{color:inherit;text-decoration:none}img{display:block;max-width:100%}.wrap{width:min(1120px,calc(100% - 40px));margin:auto}.nav{position:absolute;z-index:10;top:0;left:0;width:100%;color:#fff;border-bottom:1px solid rgba(255,255,255,.25)}.nav-inner{height:76px;display:flex;align-items:center;justify-content:space-between}.brand{font-family:"Gowun Batang",serif;font-size:22px;font-weight:700}.nav-links{display:flex;gap:26px;align-items:center;font-size:14px}.nav-cta,.button{display:inline-flex;align-items:center;justify-content:center;min-height:46px;padding:0 20px;background:var(--lime);color:var(--ink);border:0;border-radius:4px;font-weight:800}.hero{position:relative;min-height:720px;display:flex;align-items:center;color:#fff;overflow:hidden;background:#173f30}.hero:before{content:"";position:absolute;inset:0;background:linear-gradient(90deg,rgba(10,38,27,.91) 0%,rgba(10,38,27,.7) 48%,rgba(10,38,27,.16) 100%),url('https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=2000&q=85') center/cover}.hero-content{position:relative;padding:135px 0 78px;max-width:720px}.eyebrow{display:flex;align-items:center;gap:10px;margin:0 0 18px;text-transform:uppercase;font-size:13px;font-weight:700;letter-spacing:.08em}.eyebrow:before{content:"";width:34px;height:2px;background:var(--lime)}h1,h2,h3,p{margin-top:0}h1{font-family:"Gowun Batang",serif;font-size:clamp(46px,7vw,82px);line-height:1.14;margin-bottom:24px;letter-spacing:0}.hero-copy{max-width:610px;font-size:19px;color:rgba(255,255,255,.84);margin-bottom:34px}.hero-actions{display:flex;gap:12px;flex-wrap:wrap}.button.outline{background:transparent;color:#fff;border:1px solid rgba(255,255,255,.55)}.proof{position:relative;margin-top:-52px;z-index:2}.proof-grid{display:grid;grid-template-columns:repeat(3,1fr);background:#fff;box-shadow:var(--shadow)}.proof-item{padding:26px 30px;border-right:1px solid var(--line)}.proof-item:last-child{border:0}.proof-item strong{display:block;font-size:19px}.proof-item span{font-size:14px;color:var(--muted)}section{padding:100px 0}.section-head{display:flex;justify-content:space-between;align-items:end;gap:40px;margin-bottom:42px}.section-head h2,.split h2,.contact h2{font-family:"Gowun Batang",serif;font-size:clamp(32px,4vw,48px);line-height:1.25;margin-bottom:0}.section-head p{max-width:480px;color:var(--muted);margin-bottom:4px}.process{background:#fff}.steps{display:grid;grid-template-columns:repeat(4,1fr);border-top:1px solid var(--ink)}.step{padding:28px 24px 12px 0}.step-num{display:block;color:var(--leaf);font-size:13px;font-weight:800;margin-bottom:24px}.step h3{font-size:20px;margin-bottom:10px}.step p{font-size:15px;color:var(--muted)}.grades{background:var(--forest);color:#fff}.grades .section-head p{color:rgba(255,255,255,.68)}.grade-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:rgba(255,255,255,.2)}.grade{background:var(--forest);padding:30px;min-height:210px}.grade small{color:var(--lime);font-weight:700}.grade h3{margin:10px 0;font-size:22px}.grade p{font-size:15px;color:rgba(255,255,255,.7);margin:0}.regions{background:#eef0e9}.region-grid{display:grid;grid-template-columns:repeat(6,1fr);gap:10px}.region-link{min-height:82px;padding:16px;display:flex;align-items:end;justify-content:space-between;background:#fff;border:1px solid transparent;font-weight:700;transition:.2s}.region-link:hover{border-color:var(--leaf);color:var(--forest);transform:translateY(-2px)}.region-link span{color:var(--leaf)}.region-picker{position:fixed;z-index:100;inset:0;display:grid;place-items:center;padding:24px;background:rgba(5,27,20,.84);backdrop-filter:blur(7px)}.region-picker[hidden]{display:none}.region-picker-panel{width:min(780px,100%);max-height:min(740px,calc(100vh - 48px));display:flex;flex-direction:column;padding:30px 24px 24px;background:#fbfaf6;border-radius:24px;box-shadow:0 30px 80px rgba(0,0,0,.3)}.region-picker-head{position:relative;padding:0 44px 18px 0}.region-picker-label{margin:0 0 6px;color:var(--muted);font-size:12px;font-weight:800;letter-spacing:.16em}.region-picker-head h2{margin:0 0 4px;font-family:"Gowun Batang",serif;font-size:clamp(25px,4vw,34px);line-height:1.35}.region-picker-head p:last-of-type{margin:0;color:var(--muted);font-size:14px}.region-picker-close{position:absolute;top:0;right:0;width:42px;height:42px;padding:0;border:0;background:transparent;color:var(--muted);font-size:34px;font-weight:300;line-height:1;cursor:pointer}.region-picker-list{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;overflow:auto;padding:2px 6px 2px 0}.region-card{min-height:126px;padding:17px 12px;border:1px solid #d5e3db;border-radius:14px;background:#edf5f0;text-align:center;transition:.2s}.region-card:hover,.region-card:focus-visible{border-color:var(--leaf);background:#e3f0e8;transform:translateY(-2px);outline:0}.region-card strong{display:block;padding-bottom:10px;border-bottom:1px solid #d3e3da;font-size:17px}.region-card strong:before{content:"●";margin-right:8px;color:#ef5a3c;font-size:12px;text-shadow:0 0 0 #111}.region-areas{display:flex;justify-content:center;flex-wrap:wrap;gap:5px;margin-top:9px}.region-areas span{padding:2px 7px;border-radius:99px;background:#fff;color:var(--muted);font-size:11px;line-height:1.5}.region-picker-open{overflow:hidden}.split{display:grid;grid-template-columns:1fr 1fr;min-height:560px;background:#fff}.split-image{background:url('https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1400&q=85') center/cover}.split-copy{padding:80px max(40px,calc((100vw - 1120px)/2));padding-right:40px;display:flex;flex-direction:column;justify-content:center}.split-copy p{color:var(--muted)}.check-list{list-style:none;padding:0;margin:25px 0 0}.check-list li{padding:12px 0;border-bottom:1px solid var(--line);font-weight:600}.check-list li:before{content:"✓";color:var(--leaf);margin-right:12px}.local-intro{background:#fff}.local-copy{display:grid;grid-template-columns:.8fr 1.2fr;gap:80px}.local-copy p{color:var(--muted)}.contact{background:var(--sun);padding:80px 0}.contact-inner{display:flex;align-items:center;justify-content:space-between;gap:40px}.contact p{margin:12px 0 0}.contact .button{background:var(--ink);color:#fff;min-width:180px}footer{background:var(--ink);color:rgba(255,255,255,.65);padding:42px 0}.footer-inner{display:flex;justify-content:space-between;gap:30px;font-size:13px}.footer-brand{color:#fff;font-family:"Gowun Batang",serif;font-size:18px}.mobile-cta{display:none}.breadcrumb{font-size:13px;color:rgba(255,255,255,.65);margin-bottom:20px}.not-found{min-height:100vh;display:grid;place-items:center;text-align:center;padding:30px}.not-found h1{color:var(--forest)}
.topics{background:var(--paper)}.topic-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:16px}.topic{background:#fff;border:1px solid var(--line);border-radius:var(--radius);padding:28px}.topic small,.level-card small{color:var(--leaf);font-size:12px;font-weight:800;letter-spacing:.08em}.topic h3{margin:8px 0 10px;font-size:21px}.topic p{margin:0;color:var(--muted);font-size:15px}.levels{background:#fff}.level-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}.level-card{display:flex;flex-direction:column;padding:28px;background:var(--paper);border:1px solid var(--line);border-radius:var(--radius);transition:.2s}.level-card:hover{border-color:var(--leaf);transform:translateY(-2px)}.level-card h3{margin:8px 0;font-size:22px}.level-card p{color:var(--muted);font-size:15px}.chips{display:flex;flex-wrap:wrap;gap:6px;margin-top:auto}.chips span{padding:3px 10px;border-radius:99px;background:#e3f0e8;color:var(--forest);font-size:13px;font-weight:600}.level-card .more{margin-top:18px;color:var(--leaf);font-size:14px;font-weight:800}.level-card.current{border-color:var(--leaf);background:#edf5f0}.faq{background:#fff}.faq-list{border-top:1px solid var(--ink)}.faq-list details{padding:20px 0;border-bottom:1px solid var(--line)}.faq-list summary{display:flex;justify-content:space-between;gap:20px;font-size:18px;font-weight:700;list-style:none;cursor:pointer}.faq-list summary::-webkit-details-marker{display:none}.faq-list summary:after{content:"+";color:var(--leaf);font-size:22px;line-height:1}.faq-list details[open] summary:after{content:"−"}.faq-list details p{margin:12px 0 0;color:var(--muted)}.directory{display:grid;grid-template-columns:repeat(2,1fr);gap:0 32px;margin-top:48px}.directory-row{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid #d3d8cf;font-size:15px}.directory-row span{display:flex;gap:14px}.directory-row a{color:var(--leaf);font-weight:600}.directory-row a:hover{text-decoration:underline}
@media(max-width:900px){.nav-links a:not(.nav-cta){display:none}.hero{min-height:680px}.proof-grid{grid-template-columns:1fr}.proof-item{border-right:0;border-bottom:1px solid var(--line)}.steps{grid-template-columns:1fr 1fr}.grade-grid{grid-template-columns:1fr 1fr}.region-grid{grid-template-columns:repeat(3,1fr)}.region-picker-list{grid-template-columns:repeat(2,1fr)}.split{grid-template-columns:1fr}.split-image{min-height:390px}.local-copy{grid-template-columns:1fr;gap:20px}.level-grid{grid-template-columns:1fr}.directory{grid-template-columns:1fr}.directory-row{flex-wrap:wrap}}
@media(max-width:600px){.wrap{width:min(100% - 28px,1120px)}.nav-inner{height:64px}.brand{font-size:19px}.nav-cta{padding:0 13px;min-height:40px}.hero{min-height:640px}.hero:before{background:linear-gradient(180deg,rgba(10,38,27,.72),rgba(10,38,27,.94)),url('https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1000&q=80') 62% center/cover}.hero-content{padding-top:112px}.hero-copy{font-size:17px}.proof{margin-top:0}.proof-item{padding:20px}section{padding:72px 0}.section-head{display:block;margin-bottom:30px}.section-head h2{margin-bottom:14px}.steps,.grade-grid{grid-template-columns:1fr}.step{border-bottom:1px solid var(--line)}.grade{min-height:auto}.region-grid{grid-template-columns:1fr 1fr}.region-link{min-height:68px}.region-picker{padding:12px}.region-picker-panel{max-height:calc(100vh - 24px);padding:22px 14px 16px;border-radius:18px}.region-picker-head{padding-bottom:14px}.region-picker-head p:last-of-type{font-size:13px}.region-picker-list{grid-template-columns:1fr;gap:8px}.region-card{min-height:auto;padding:14px 10px}.split-image{min-height:300px}.topic-grid{grid-template-columns:1fr}.topic,.level-card{padding:22px}.split-copy{padding:60px 24px}.contact{padding:58px 0 100px}.contact-inner{display:block}.contact .button{margin-top:24px;width:100%}.footer-inner{display:block}.footer-brand{margin-bottom:14px}.mobile-cta{display:flex;position:fixed;z-index:20;bottom:0;left:0;width:100%;height:62px}.mobile-cta a{flex:1;display:grid;place-items:center;background:var(--ink);color:#fff;font-weight:800}.mobile-cta a:last-child{background:var(--lime);color:var(--ink)}}`;

const nav = `<nav class="nav"><div class="wrap nav-inner"><a class="brand" href="/">경남 수학과외</a><div class="nav-links"><a href="/#program">수업 안내</a><a href="/#grade">학년별 준비</a><a href="/#region">지역 찾기</a><a class="nav-cta" href="#contact">상담 신청</a></div></div></nav>`;
const regionLinks = regions.map(region => `<a class="region-link" href="/regions/${region.slug}/">${region.name}${region.type}<span>↗</span></a>`).join("");
const regionPickerCards = regions.map(region => `<a class="region-card" href="/regions/${region.slug}/"><strong>${region.name}${region.type}</strong><span class="region-areas">${region.areas.split(", ").map(area => `<span>${area}</span>`).join("")}</span></a>`).join("");
const regionPicker = `<div class="region-picker" id="region-picker" role="dialog" aria-modal="true" aria-labelledby="region-picker-title"><div class="region-picker-panel"><header class="region-picker-head"><p class="region-picker-label">REGION SELECT</p><h2 id="region-picker-title">어느 지역의 수학과외를 찾으시나요?</h2><p>시·군을 선택하면 해당 지역 안내로 바로 이동합니다.</p><button class="region-picker-close" type="button" aria-label="지역 선택 창 닫기">×</button></header><div class="region-picker-list">${regionPickerCards}</div></div></div><script>(()=>{const picker=document.getElementById("region-picker");const closeButton=picker.querySelector(".region-picker-close");const closePicker=()=>{picker.hidden=true;document.body.classList.remove("region-picker-open")};try{if(sessionStorage.getItem("regionPickerSeen")){picker.hidden=true;return}sessionStorage.setItem("regionPickerSeen","1")}catch(error){}document.body.classList.add("region-picker-open");closeButton.focus();closeButton.addEventListener("click",closePicker);picker.addEventListener("click",event=>{if(event.target===picker)closePicker()});document.addEventListener("keydown",event=>{if(event.key==="Escape"&&!picker.hidden)closePicker()})})();</script>`;
const gradeCards = grades.map(([name, text]) => `<article class="grade"><small>PREPARATION</small><h3>${name} 수학과외</h3><p>${text}</p></article>`).join("");

const ogImage = "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=80";
const organization = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "@id": `${siteUrl}/#organization`,
  name: "경남 수학과외",
  url: siteUrl,
  telephone: phoneNumber,
  description: "경상남도 18개 시군 초등·중등·고등 1:1 맞춤 수학과외",
  areaServed: regions.map(region => ({ "@type": "City", name: `${region.name}${region.type}` })),
  knowsAbout: ["초등 수학", "중등 수학", "고등 수학", "기초수학", "수학내신", "수능수학"]
};

const fill = (text, region) => region ? text.replaceAll("{r}", region.name).replaceAll("{full}", `${region.name}${region.type}`).replaceAll("{areas}", region.areas) : text;
const breadcrumbSchema = crumbs => ({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: crumbs.map(([name, url], index) => ({ "@type": "ListItem", position: index + 1, name, item: url })) });
const faqSchema = items => ({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: items.map(([question, answer]) => ({ "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer } })) });

function layout({ title, description, body, canonical = siteUrl, schemas = [] }) {
  return `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="naver-site-verification" content="b65e2f636f995b45905c525eee2b59df00fabf69"><meta name="google-site-verification" content="1xHv61CUskoFiGwoPleDj8RuE1WdeBROPwwcVGEEELc"><title>${title}</title><meta name="description" content="${description}"><meta name="robots" content="index,follow"><link rel="canonical" href="${canonical}"><link rel="alternate" type="application/rss+xml" title="경남 수학과외" href="${siteUrl}/rss.xml"><meta property="og:type" content="website"><meta property="og:site_name" content="경남 수학과외"><meta property="og:locale" content="ko_KR"><meta property="og:title" content="${title}"><meta property="og:description" content="${description}"><meta property="og:url" content="${canonical}"><meta property="og:image" content="${ogImage}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${title}"><meta name="twitter:description" content="${description}"><meta name="twitter:image" content="${ogImage}"><link rel="stylesheet" href="/assets/style.css">${[organization, ...schemas].map(schema => `<script type="application/ld+json">${JSON.stringify(schema)}</script>`).join("")}</head><body>${nav}${body}<div class="mobile-cta"><a href="tel:${phoneNumber}">전화 상담</a><a href="#contact">상담 신청</a></div></body></html>`;
}

function hero(title, copy, eyebrow = "Gyeongnam Private Math Coaching", breadcrumb = "") {
  return `<header class="hero"><div class="wrap hero-content">${breadcrumb ? `<div class="breadcrumb"><a href="/">홈</a> · ${breadcrumb}</div>` : ""}<p class="eyebrow">${eyebrow}</p><h1>${title}</h1><p class="hero-copy">${copy}</p><div class="hero-actions"><a class="button" href="#contact">무료 학습 상담</a><a class="button outline" href="#grade">학년별 수업 보기</a><a class="button outline" href="tel:${phoneNumber}">${phoneNumber}</a></div></div></header>`;
}

const proof = `<div class="proof"><div class="wrap proof-grid"><div class="proof-item"><strong>1:1 맞춤 설계</strong><span>현재 실력부터 목표까지 개인별 진도</span></div><div class="proof-item"><strong>18개 시군 수업</strong><span>경남 전 지역 대면·온라인 상담</span></div><div class="proof-item"><strong>초등·중등·고등</strong><span>기초수학, 내신, 수능을 한 흐름으로 관리</span></div></div></div>`;
const process = `<section class="process" id="program"><div class="wrap"><div class="section-head"><h2>점수가 달라지는<br>수업의 순서</h2><p>문제를 더 많이 푸는 것보다 먼저 해야 할 일이 있습니다. 학생의 현재 위치를 정확히 확인하고, 이해와 반복이 필요한 지점을 찾아 수업을 설계합니다.</p></div><div class="steps"><article class="step"><span class="step-num">01 · 진단</span><h3>학습 상태 확인</h3><p>최근 시험지와 학습 이력을 바탕으로 개념, 연산, 문제 해석의 약점을 구분합니다.</p></article><article class="step"><span class="step-num">02 · 설계</span><h3>개인 커리큘럼</h3><p>학교 진도와 목표 성적, 가능한 학습 시간을 반영해 현실적인 계획을 세웁니다.</p></article><article class="step"><span class="step-num">03 · 수업</span><h3>개념과 적용 연결</h3><p>학생이 풀이 이유를 직접 설명하고 유사 문제에 적용할 수 있을 때까지 확인합니다.</p></article><article class="step"><span class="step-num">04 · 피드백</span><h3>학습 과정 관리</h3><p>오답과 과제 결과를 기록해 다음 수업에 반영하고 학부모님께 변화를 공유합니다.</p></article></div></div></section>`;
const gradeSection = `<section class="grades" id="grade"><div class="wrap"><div class="section-head"><h2>학년이 바뀌기 전,<br>준비는 달라야 합니다</h2><p>예비 학년은 무조건 빠른 선행보다 이전 학년의 구멍을 찾아 다음 과정과 자연스럽게 연결하는 시기입니다.</p></div><div class="grade-grid">${gradeCards}</div></div></section>`;
const split = `<section class="split"><div class="split-image" role="img" aria-label="학생의 학습을 지도하는 수업 공간"></div><div class="split-copy"><p class="eyebrow">Study with direction</p><h2>혼자 공부하는 힘까지<br>함께 기릅니다</h2><p>과외 시간에만 풀 수 있는 문제는 오래 남지 않습니다. 문제를 읽고, 조건을 표시하고, 풀이를 검토하는 과정을 반복해 스스로 공부할 수 있는 기준을 만듭니다.</p><ul class="check-list"><li>학교별 시험 범위와 일정 반영</li><li>매 수업 오답 원인 기록</li><li>학생·학부모 정기 학습 피드백</li></ul></div></section>`;

const levelUrl = (region, level) => `/regions/${region.slug}/${level.slug}/`;

// 지역 페이지·학교급 페이지에서 쓰는 초등/중등/고등 바로가기 카드
function levelCards(region, current) {
  return levels.map(level => {
    const name = region ? `${region.name} ${level.name} 수학과외` : `${level.name} 수학과외`;
    const href = region ? levelUrl(region, level) : `#directory`;
    return `<a class="level-card${current === level ? " current" : ""}" href="${href}"><small>${level.range}</small><h3>${name}</h3><p>${level.summary}</p><span class="chips">${level.topics.map(([keyword]) => `<span>${level.name} ${keyword}</span>`).join("")}</span><span class="more">${current === level ? "현재 페이지" : "자세히 보기 →"}</span></a>`;
  }).join("");
}

function levelsSection(region, current) {
  const place = region ? region.name : "경남";
  return `<section class="levels" id="level"><div class="wrap"><div class="section-head"><h2>${place} 초등·중등·고등<br>수학과외 안내</h2><p>학교급마다 필요한 공부가 다릅니다. 기초수학과 연산부터 수학내신, 수능수학까지 학생의 단계에 맞는 수업을 확인하세요.</p></div><div class="level-grid">${levelCards(region, current)}</div></div></section>`;
}

function programsSection(region, current) {
  const place = region ? region.name : "경남";
  const cards = programs.map(program => {
    const href = region ? levelUrl(region, program) : "#directory";
    return `<a class="level-card${current === program ? " current" : ""}" href="${href}"><small>${program.label}</small><h3>${region ? `${region.name} ` : ""}${program.name} 수학과외</h3><p>${program.summary}</p><span class="chips">${program.topics.map(([keyword]) => `<span>${keyword}</span>`).join("")}</span><span class="more">${current === program ? "현재 페이지" : "자세히 보기 →"}</span></a>`;
  }).join("");
  return `<section class="levels programs" id="programs"><div class="wrap"><div class="section-head"><h2>${place} 집중 프로그램<br>예비중1·예비고1·온라인</h2><p>학년이 바뀌는 전환기와 거리·일정 때문에 대면 수업이 어려운 경우를 위한 맞춤 프로그램입니다.</p></div><div class="level-grid">${cards}</div></div></section>`;
}

function faqSection(items, place) {
  return `<section class="faq" id="faq"><div class="wrap"><div class="section-head"><h2>${place} 수학과외<br>자주 묻는 질문</h2><p>상담 전에 많이 물어보시는 내용을 정리했습니다. 더 궁금한 점은 전화로 편하게 문의해 주세요.</p></div><div class="faq-list">${items.map(([question, answer]) => `<details><summary>${question}</summary><p>${answer}</p></details>`).join("")}</div></div></section>`;
}

// 홈 화면: 지역 버튼 + 지역×학교급 전체 바로가기
const directory = `<div class="directory" id="directory">${regions.map(region => `<div class="directory-row"><a href="/regions/${region.slug}/"><strong>${region.name} 수학과외</strong></a><span>${[...levels, ...programs].map(item => `<a href="${levelUrl(region, item)}" title="${region.name} ${item.name} 수학과외">${item.name}</a>`).join("")}</span></div>`).join("")}</div>`;

function regionsSection(level) {
  if (level) {
    return `<section class="regions" id="region"><div class="wrap"><div class="section-head"><h2>다른 지역<br>${level.name} 수학과외</h2><p>경상남도 18개 시군의 ${level.name} 수학 수업 안내입니다. 거주지와 일정에 따라 대면 또는 온라인 수업을 상담합니다.</p></div><div class="region-grid">${regions.map(region => `<a class="region-link" href="${levelUrl(region, level)}">${region.name} ${level.name}<span>↗</span></a>`).join("")}</div></div></section>`;
  }
  return `<section class="regions" id="region"><div class="wrap"><div class="section-head"><h2>우리 지역<br>수학과외 찾기</h2><p>경상남도 18개 시군의 지역별·학교급별 수업 안내를 확인하세요. 거주지와 일정에 따라 대면 또는 온라인 수업을 상담합니다.</p></div><div class="region-grid">${regionLinks}</div>${directory}</div></section>`;
}

const contact = (region = "경남") => `<section class="contact" id="contact"><div class="wrap contact-inner"><div><h2>${region} 수학과외,<br>현재 고민부터 들려주세요</h2><p>학년, 지역, 원하는 수업 목표를 남겨주시면 상담을 도와드립니다.</p></div><a class="button" href="tel:${phoneNumber}">전화 상담하기</a></div></section><footer><div class="wrap footer-inner"><div><div class="footer-brand">경남 수학과외</div><span>경상남도 초·중·고 맞춤 수학 지도 · ${phoneNumber}</span></div><div>상호 및 연락처는 운영 정보 확정 후 표시됩니다.<br>© 2026 경남 수학과외. All rights reserved.</div></div></footer>`;

const pages = [];

function homePage() {
  const title = "경남 수학과외 | 초등·중등·고등 1:1 맞춤 수학 수업";
  const description = `경상남도 18개 시군 초등·중등·고등 1:1 수학과외. 기초수학, 수학내신, 수능수학 대비까지 학생 맞춤 수업. 창원·김해·진주·양산 등 무료 학습 상담 ${phoneNumber}`;
  pages.push({ url: `${siteUrl}/`, title, description, priority: "1.0" });
  const faq = [
    ["경남 어느 지역에서 수학과외가 가능한가요?", "창원, 진주, 통영, 사천, 김해, 밀양, 거제, 양산 8개 시와 의령, 함안, 창녕, 고성, 남해, 하동, 산청, 함양, 거창, 합천 10개 군에서 상담합니다. 거리에 따라 방문 또는 온라인 수업을 안내합니다."],
    ["초등학생도 수업이 가능한가요?", "초등 1학년부터 고등 3학년까지 수업합니다. 초등은 기초수학과 연산, 중등은 수학내신과 선행, 고등은 내신과 수능수학을 중심으로 진행합니다."],
    ["수업은 어떤 순서로 진행되나요?", "학습 상태 진단, 개인 커리큘럼 설계, 개념과 적용을 연결하는 수업, 오답과 과제 피드백 순서로 진행하며 학부모님께 학습 변화를 정기적으로 공유합니다."]
  ];
  return layout({ title, description, schemas: [faqSchema(faq)], body: `${regionPicker}${hero("경남 수학과외", "창원부터 합천까지, 학생의 현재 실력과 학교 진도에 맞춘 초등·중등·고등 1:1 수학 수업. 기초수학부터 수학내신, 수능수학까지 공부의 기준을 함께 만듭니다.")}${proof}${levelsSection()}${programsSection()}${process}${gradeSection}${regionsSection()}${split}${faqSection(faq, "경남")}${contact()}` });
}

function regionPage(region) {
  const fullName = `${region.name}${region.type}`;
  const canonical = `${siteUrl}/regions/${region.slug}/`;
  const title = `${region.name} 수학과외 | 초등·중등·고등 1:1 수학, 내신·수능대비`;
  const description = `${fullName} 수학과외. ${region.areas} 초등·중등·고등 1:1 맞춤 수업. 기초수학, 수학내신, 수능수학 대비와 예비중·예비고 선행까지. 무료 학습 상담 ${phoneNumber}`;
  pages.push({ url: canonical, title, description, priority: "0.8" });
  const faq = [...commonFaq, ...levels.map(level => level.faq[0])].map(([question, answer]) => [fill(question, region), fill(answer, region)]);
  const local = `<section class="local-intro"><div class="wrap local-copy"><div><p class="eyebrow">${fullName} LOCAL CLASS</p><h2>${region.name} 학생에게 맞는<br>현실적인 학습 계획</h2></div><div><p>${fullName} ${region.areas} 인근 초등학생, 중학생, 고등학생을 대상으로 상담합니다. 지역과 학교에 따라 시험 일정과 학습 환경이 다른 만큼, 정해진 교재를 일률적으로 따라가기보다 최근 시험 결과와 목표를 먼저 확인합니다.</p><p>${region.focus}을 중심으로 수업하며, 대면 수업이 어려운 거리나 일정에는 온라인 수업을 함께 안내합니다. 초등 기초수학과 수학공부 습관, 중등 수학내신과 선행, 고등 내신과 수능수학 대비를 개인 진도에 맞춰 연결합니다.</p></div></div></section>`;
  const body = `${hero(`${region.name}<br>수학과외`, `${fullName} ${region.areas}에서 만나는 초등·중등·고등 1:1 맞춤 수업. ${region.focus}으로 공부의 방향을 분명하게 잡습니다.`, "GYEONGNAM LOCAL MATH TUTORING", `${region.name} 수학과외`)}${proof}${local}${levelsSection(region)}${programsSection(region)}${process}${gradeSection}${faqSection(faq, region.name)}${regionsSection()}${contact(region.name)}`;
  return layout({ title, description, body, canonical, schemas: [breadcrumbSchema([["홈", `${siteUrl}/`], [`${region.name} 수학과외`, canonical]]), faqSchema(faq)] });
}

function levelPage(region, level) {
  const fullName = `${region.name}${region.type}`;
  const place = `${region.name} ${level.name}`;
  const canonical = `${siteUrl}${levelUrl(region, level)}`;
  const keywords = level.topics.map(([keyword]) => keyword);
  const title = `${place} 수학과외 | ${level.title}`;
  const description = `${fullName} ${level.name} 수학과외. ${region.areas} ${level.range} ${level.title}. ${level.summary}. 무료 학습 상담 ${phoneNumber}`;
  pages.push({ url: canonical, title, description, priority: "0.7" });
  const faq = [...level.faq, ...commonFaq].map(([question, answer]) => [fill(question, region), fill(answer, region)]);
  const topics = `<section class="topics" id="program"><div class="wrap"><div class="section-head"><h2>${place} 수학,<br>이렇게 수업합니다</h2><p>${level.intro}</p></div><div class="topic-grid">${level.topics.map(([keyword, text]) => `<article class="topic"><small>${level.name.toUpperCase()} MATH</small><h3>${place} ${keyword}</h3><p>${fill(text, region)}</p></article>`).join("")}</div></div></section>`;
  const gradeList = `<section class="grades" id="grade"><div class="wrap"><div class="section-head"><h2>${region.name} 학년별<br>${level.name} 수학과외</h2><p>같은 ${level.student}이라도 학년마다 다음 단계로 넘어가기 위해 꼭 잡아야 할 단원이 다릅니다. ${level.range} 학년별 핵심을 기준으로 수업을 설계합니다.</p></div><div class="grade-grid">${level.grades.map(([grade, text]) => `<article class="grade"><small>${level.range}</small><h3>${region.name} ${grade} 수학과외</h3><p>${text}</p></article>`).join("")}</div></div></section>`;
  const local = `<section class="local-intro"><div class="wrap local-copy"><div><p class="eyebrow">${fullName} ${level.name.toUpperCase()} CLASS</p><h2>${fullName} ${level.student}을 위한<br>1:1 수학 수업</h2></div><div><p>${fullName} ${region.areas} 인근 ${level.student}을 대상으로 상담합니다. 첫 상담에서 최근 시험지나 문제집 풀이를 함께 보고, ${keywords.join(", ")} 중 지금 가장 먼저 필요한 것이 무엇인지 정리합니다.</p><p>${region.focus}을 중심으로 수업하며, 대면 수업이 어려운 거리나 일정에는 온라인 수업을 함께 안내합니다. 수업 후에는 오답과 과제 결과를 기록해 학부모님께 학습 변화를 공유합니다.</p></div></div></section>`;
  const body = `${hero(`${place}<br>수학과외`, `${fullName} ${level.range} 1:1 수학 수업. ${level.summary}.`, `${region.name.toUpperCase()} ${level.name} MATH TUTORING`, `<a href="/regions/${region.slug}/">${region.name} 수학과외</a> · ${level.name} 수학`)}${proof}${topics}${gradeList}${local}${process}${levelsSection(region, level)}${programsSection(region)}${faqSection(faq, place)}${regionsSection(level)}${contact(place)}`;
  return layout({ title, description, body, canonical, schemas: [breadcrumbSchema([["홈", `${siteUrl}/`], [`${region.name} 수학과외`, `${siteUrl}/regions/${region.slug}/`], [`${place} 수학과외`, canonical]]), faqSchema(faq)] });
}

function programPage(region, program) {
  const fullName = `${region.name}${region.type}`;
  const place = `${region.name} ${program.name}`;
  const canonical = `${siteUrl}${levelUrl(region, program)}`;
  const title = `${place} 수학과외 | ${program.title}`;
  const description = `${fullName} ${program.name} 수학과외. ${region.areas} ${program.title}. ${program.summary}. 무료 학습 상담 ${phoneNumber}`;
  pages.push({ url: canonical, title, description, priority: "0.7" });
  const faq = [...program.faq, ...commonFaq].map(([question, answer]) => [fill(question, region), fill(answer, region)]);
  const topics = `<section class="topics" id="grade"><div class="wrap"><div class="section-head"><h2>${place} 수학,<br>이렇게 준비합니다</h2><p>${fill(program.intro, region)}</p></div><div class="topic-grid">${program.topics.map(([keyword, text]) => `<article class="topic"><small>${program.label}</small><h3>${region.name} ${keyword}</h3><p>${fill(text, region)}</p></article>`).join("")}</div></div></section>`;
  const fit = `<section class="local-intro"><div class="wrap local-copy"><div><p class="eyebrow">${fullName} ${program.label}</p><h2>이런 ${region.name} 학생에게<br>필요합니다</h2></div><div><p>${fullName} ${region.areas} 인근 학생을 대상으로 상담합니다. ${region.focus}을 중심으로, 첫 상담에서 최근 시험지와 문제집 풀이를 함께 보고 학생에게 맞는 시작 지점을 정합니다.</p><ul class="check-list">${program.checklist.map(item => `<li>${item}</li>`).join("")}</ul></div></div></section>`;
  const body = `${hero(`${place}<br>수학과외`, `${fullName} ${program.title} 수업. ${program.summary}.`, `${program.label} MATH PROGRAM`, `<a href="/regions/${region.slug}/">${region.name} 수학과외</a> · ${program.name} 수학`)}${proof}${topics}${fit}${process}${programsSection(region, program)}${levelsSection(region)}${faqSection(faq, place)}${regionsSection(program)}${contact(place)}`;
  return layout({ title, description, body, canonical, schemas: [breadcrumbSchema([["홈", `${siteUrl}/`], [`${region.name} 수학과외`, `${siteUrl}/regions/${region.slug}/`], [`${place} 수학과외`, canonical]]), faqSchema(faq)] });
}

await rm(dist, { recursive: true, force: true });
await mkdir(path.join(dist, "assets"), { recursive: true });
await writeFile(path.join(dist, "assets", "style.css"), css);
await writeFile(path.join(dist, "index.html"), homePage());
for (const region of regions) {
  const directory = path.join(dist, "regions", region.slug);
  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, "index.html"), regionPage(region));
  for (const level of levels) {
    await mkdir(path.join(directory, level.slug), { recursive: true });
    await writeFile(path.join(directory, level.slug, "index.html"), levelPage(region, level));
  }
  for (const program of programs) {
    await mkdir(path.join(directory, program.slug), { recursive: true });
    await writeFile(path.join(directory, program.slug, "index.html"), programPage(region, program));
  }
}
const today = new Date().toISOString().slice(0, 10);
const escapeXml = text => text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
await writeFile(path.join(dist, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${pages.map(page => `\n  <url><loc>${page.url}</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>${page.priority}</priority></url>`).join("")}\n</urlset>\n`);
await writeFile(path.join(dist, "rss.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0"><channel><title>경남 수학과외</title><link>${siteUrl}/</link><description>경상남도 18개 시군 초등·중등·고등 1:1 수학과외 안내</description><language>ko</language><lastBuildDate>${new Date().toUTCString()}</lastBuildDate>${pages.map(page => `\n<item><title>${escapeXml(page.title)}</title><link>${page.url}</link><guid>${page.url}</guid><description>${escapeXml(page.description)}</description></item>`).join("")}\n</channel></rss>\n`);
await writeFile(path.join(dist, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`);
await writeFile(path.join(dist, "CNAME"), "tutorgo.kr\n");
await writeFile(path.join(dist, ".nojekyll"), "");
await writeFile(path.join(dist, "404.html"), layout({ title: "페이지를 찾을 수 없습니다 | 경남 수학과외", description: "요청하신 페이지를 찾을 수 없습니다.", body: `<main class="not-found"><div><p class="eyebrow">404 ERROR</p><h1>페이지를 찾을 수 없습니다</h1><p>주소가 변경되었거나 존재하지 않는 페이지입니다.</p><a class="button" href="/">홈으로 돌아가기</a></div></main>` }));
console.log(`Built ${pages.length} pages in ${dist}`);
