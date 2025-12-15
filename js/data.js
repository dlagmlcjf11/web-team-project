const users = [
    { 
        id: 'user1', 
        pw: 'pass1', 
        name: '김코딩', 
        expiresAt: '2025-01-20', 
        locker: null,
        checkIns: ['2025-12-02', '2025-12-03', '2025-12-04', '2025-12-05', '2025-12-06', '2025-12-07', '2025-12-08', '2025-12-09', '2025-12-10', '2025-12-11', '2025-12-12', '2025-12-13', '2025-12-14'],
        hasReceivedStreakCoupon: false
    },
    { 
        id: 'user2', 
        pw: 'pass2', 
        name: '박개발', 
        expiresAt: '2024-12-19', 
        locker: null,
        checkIns: [],
        hasReceivedStreakCoupon: false
    },
    {
        id: 'user3', 
        pw: 'pass3', 
        name: '임언어', 
        expiresAt: '2025-12-19', 
        locker: null,
        checkIns: [],
        hasReceivedStreakCoupon: false
    },
    { 
        id: 'admin', 
        pw: 'admin', 
        name: '관리자', 
        expiresAt: '2026-12-31', 
        locker: { number: 'B-04', password: '9999' },
        checkIns: ['2025-12-05', '2025-12-07', '2025-12-09', '2025-12-11', '2025-12-13', '2025-12-14'],
        hasReceivedStreakCoupon: false
    }
];

const faqData = [
    {
        question: '헬스장 어디가 좋아요?',
        answer: '무조건 가까운 곳이 제일 좋습니다. 저는 헬스장을 먼저 골라놓고 그 근처에있는 집을 구했어요. 여러분의 의지는 유한하다는 것을 꼭 기억하세요.'
    },
    {
        question: 'PT 어떻게 골라요?',
        answer: '체육학, 체육지도학 등 관련 학문의 학사 이상 학력을 가진 사람 중 같은 본인과 성별, 비슷한 체형인 사람을 고르세요. 체형이 비슷해야 노하우를 배우기 좋습니다. 그리고 자격증 중 볼만한 것은 국가공인 자격증인 "건강운동관리사"와 "(전문·생활) 스포츠지도사" 외에는 없다고 보시면 됩니다.'
    },
    {
        question: 'ㅁㅁ가 아픈데 보호대 사요?',
        answer: '보호대도 사고 자세도 바꾸세요. 좋지 않은 자세에서 오는 통증을 보호대로 억누르면 결국 부상당합니다. 자세가 좋은데 아프다면 병원가세요.'
    },
    {
        question: '스트랩 뭐사요? 베르사 그립 사요?',
        answer: 'A1. 악력 보조 장비는 그립, 후크, 줄 스트랩, 8자 스트랩 등 다양한 종류가 있습니다. 각각 보급형으로 사서 써보고 잘 맞는 종류의 고급품을 사서 쓰시는 것이 좋습니다.<br>A2. 스트랩을 쓸 때는 쓰더라도 악력 향상을 위한 운동을 병행하는게 좋습니다. 악력 훈련없이 성장하다가 스트랩의 악력 보조로 극복할 수 없는 구간에 도달하면 긴 정체기를 겪을수도 있거든요.'
    },
    {
        question: '벨트 뭐가 좋아요?',
        answer: 'A1. 복압 보조 장비도 벨크로, 프롱, 레버, 코르셋 등 다양한 장비가 있습니다. 주로 하는 운동의 종류에 맞게 보급품부터 시작해보세요. 초보자가 SBD 레버벨트 사봤자 당근마켓으로 갈 확률이 높습니다. 추천 브랜드 : VALEO<br>A2. 벨트 구매 전에 복압 잡는 법을 먼저 숙달하는 것을 추천합니다. 복압을 잡았을 때 복근 뿐만 아니라 기립근도 부풀릴 수 있는 수준(브레이싱)으로 키우시면 벨트 없이도 체중 2~3배의 무게를 쉽게 다룰 수 있게 됩니다. 추천 운동 : 데드버그'
    },
    {
        question: '유산소랑 무산소 중에 뭐가 좋아요?',
        answer: '균형잡힌 성장과 부상 방지 등 여러 긍정적인 효과를 위해서는 둘 다 하는 것이 제일 좋습니다.'
    },
    {
        question: '정체기 왔는데 어떻게 뚫어요?',
        answer: '횟수 위주로 했다면 중량을, 중량 위주로 했다면 횟수를 늘려보세요. 근육에는 크게 내구도를 담당하는 지근과 순발력을 담당하는 속근이 있는데 둘 다 고르게 발달시켜야 퍼포먼스가 좋아집니다.'
    },
    {
        question: '운동 루틴 어떻게 짜요?',
        answer: '아무 운동 앱이나 깔아서 아무 프로그램이나 해보세요. 전문가들이 만든 프로그램이고 효과가 입증된 것이 많이 있습니다. 한 바퀴씩 돌려보고 잘 맞는 프로그램으로 3달, 6달 돌려보면 달리진 몸을 만날 수 있을 겁니다.'
    },
    {
        question: '보충제 꼭 먹어야 해요?',
        answer: '안먹어도 됩니다. 보충제는 말 그대로 보충을 위한 것이기 때문에 먹는다고 근육이 자라거나 하는 마법같은 일은 없습니다. 고기와 채소 등 일반적인 식품을 통해서 영양소를 섭취하는 것이 가장 추천할 만한 방법입니다.'
    },
    {
        question: '닭가슴살 맛없는데 다른 건 없나요?',
        answer: '닭 외에도 돼지, 소 등 살코기가 많은 고기를 먹으면 됩니다. 생선을 좋아한다면 생선도 좋은 선택이고, 요즘에는 씨몬스터 같은 순살 생선 전문 브랜드도 많으니 식탁을 풍성하게 차려봅시다.'
    },
    {
        question: '마카? 아르기닌? 좋은 건가요?',
        answer: '현재까지 과학적으로 운동능력 향상 효과가 입증된 보충제는 카페인, 크레아틴, 베타알라닌 등 정도 입니다. 먹어도 되는지 정확하게 알고싶다면 의사·약사 등 전문가와 상담해보시는 것이 좋습니다'
    }
];

const announcements = [
    {
        id: 'recruitment-dec',
        title: '12월 회원 모집 안내',
        date: '2025-12-01',
        content: '새로운 운동 계획, K-GYM과 함께 시작하세요! 지금 등록하고 다양한 혜택을 누리세요. 선착순 마감!',
        type: 'recruitment'
    },
    {
        id: 'holiday-notice-xmas',
        title: '크리스마스 휴관 안내',
        date: '2025-12-20',
        content: '12월 25일(수)은 크리스마스 휴관입니다. 이용에 착오 없으시길 바랍니다.',
        type: 'notice'
    },
    {
        id: 'gym-renovation',
        title: '시설 보수 공사 안내',
        date: '2025-11-15',
        content: '11월 20일부터 22일까지 헬스장 일부 시설 보수 공사가 진행됩니다. 양해 부탁드립니다.',
        type: 'notice'
    }
];

const couponData = {
    "XMAS2025": 0.20,
    "STREAK14": 0.05
};

// --- Locker Data Persistence ---
const LOCKER_DATA_KEY = 'gymLockerData';
const CURRENT_LOCKER_DATA_VERSION = 2;

// We wrap the initial data in a function to avoid polluting the global scope
function getInitialLockerData() {
    return {
        version: CURRENT_LOCKER_DATA_VERSION,
        lockers: [
            { number: 'A-01', isAvailable: true },
            { number: 'A-02', isAvailable: false },
            { number: 'A-03', isAvailable: true },
            { number: 'A-04', isAvailable: true },
            { number: 'B-01', isAvailable: true },
            { number: 'B-02', isAvailable: true },
            { number: 'B-03', isAvailable: true },
            { number: 'B-04', isAvailable: false },
            { number: 'C-01', isAvailable: true },
            { number: 'C-02', isAvailable: true },
            { number: 'C-03', isAvailable: true },
            { number: 'C-04', isAvailable: false },
        ]
    };
}

// Immediately-invoked function to initialize or migrate locker data in localStorage
(function() {
    const storedDataString = localStorage.getItem(LOCKER_DATA_KEY);

    if (!storedDataString) {
        // If no data exists, initialize it
        localStorage.setItem(LOCKER_DATA_KEY, JSON.stringify(getInitialLockerData()));
    } else {
        try {
            const storedData = JSON.parse(storedDataString);
            // Check if the stored data has a version number and if it's outdated
            if (!storedData.version || storedData.version < CURRENT_LOCKER_DATA_VERSION) {
                // If outdated or versionless, overwrite with new data
                localStorage.setItem(LOCKER_DATA_KEY, JSON.stringify(getInitialLockerData()));
            }
        } catch (e) {
            // If parsing fails, overwrite with fresh data
            console.error("Failed to parse locker data, re-initializing.", e);
            localStorage.setItem(LOCKER_DATA_KEY, JSON.stringify(getInitialLockerData()));
        }
    }
})();