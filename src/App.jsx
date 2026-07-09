import React, { useState, useEffect, useRef } from 'react';

// --- Firebase Web SDK 모듈 임포트 ---
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, arrayUnion } from 'firebase/firestore';

// --- 사장님의 파이어베이스 테스트 계정 정보 직접 주입 ---
const firebaseConfig = {
  apiKey: "AIzaSyC6--lGUUZHjRS3C-V989qZdJKeYMCz3LA",
  authDomain: "our-azit-test.firebaseapp.com",
  projectId: "our-azit-test",
  storageBucket: "our-azit-test.firebasestorage.app",
  messagingSenderId: "482978474238",
  appId: "1:482978474238:web:bb9cf584bec8818f30ddaf"
};

// 파이어베이스 라이브러리 초기화
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ==========================================
// STATIC MOCK DATA: 메뉴판, 게임, 신작, 요금제 데이터
// ==========================================
const MENU_ITEMS = [
  { id: 'm1', name: '캔음료 (코카/펩시제로)', category: 'coffee', price: 2500, desc: '시원한 제로 탄산 캔음료 컬렉션', isPopular: true, options: ['기본', '얼음컵 추가'], imageText: '🥤' },
  { id: 'm2', name: '패트음료 (매실/매실제로/하늘보리)', category: 'beverage', price: 3000, desc: '넉넉한 용량의 패트 음료 라인업', isPopular: false, options: ['기본', '얼음컵 추가'], imageText: '🍵' },
  { id: 'm3', name: '커피 (핫/아이스/디카페인)', category: 'coffee', price: 2500, desc: '엄선된 원두로 내린 부드러운 원두 커피', isPopular: true, options: ['ICE', 'HOT', '디카페인 ICE'], imageText: '☕' },
  { id: 'm4', name: '티 (아이스티/오늘의티)', category: 'beverage', price: 2500, desc: '달콤상큼 시원하게 즐기는 차 한 잔', isPopular: false, options: ['아이스티', '오늘의 허브티'], imageText: '🍹' },
  { id: 'm5', name: '주스&라떼 (오렌지/초코/딸기)', category: 'beverage', price: 3000, desc: '달콤한 풍미 가득한 과일 주스 및 라떼', isPopular: false, options: ['초코라떼', '딸기라떼', '오렌지주스'], imageText: '🥛' },
  { id: 'm6', name: '과자 (프링글스, 홈런볼)', category: 'snack', price: 2500, desc: '보드게임과 찰떡궁합인 손가락 스낵 대표주자', isPopular: true, options: ['프링글스 오리지널', '홈런볼 초코'], imageText: '🍪' },
  { id: 'm7', name: '과자 (트러플하몽 비스킷)', category: 'snack', price: 1000, desc: '단돈 천원으로 즐기는 프리미엄 트러플향 하몽 비스킷', isPopular: true, options: ['기본'], imageText: '🥨' }
];

const BOARD_GAMES = [
  { id: 'g1', name: '루미큐브 (Rummikub)', players: [2, 3, 4], time: 'medium', type: 'strategy', difficulty: '쉬움', desc: '숫자 조합을 맞추며 머리를 쓰는 전 세계 베스트셀러 타일 게임.', tips: '처음 등록할 때는 등록 숫자 합이 반드시 30 이상이어야 해요!', imageText: '🧩' },
  { id: 'g2', name: '꼬치의 달인', players: [2, 3, 4], time: 'short', type: 'party', difficulty: '매우 쉬움', desc: '주문서 카드에 적힌 꼬치를 누구보다 빠르게 꽂아 완성하는 초스피드 파티 게임.', tips: '치즈나 베이컨은 말아서 끼워야 하니 손가락 순발력이 필수!', imageText: '🍡' },
  { id: 'g3', name: '스플렌더 (Splendor)', players: [2, 3, 4], time: 'medium', type: 'strategy', difficulty: '보통', desc: '보석 토큰을 모아 광산과 카드를 구매해 15점을 먼저 달성하는 셋 컬렉션 게임.', tips: '귀족 카드의 조건을 미리 파악하고 효율적인 테크를 타는 게 이기는 지름길!', imageText: '💎' },
  { id: 'g4', name: '할리갈리 (Halli Galli)', players: [2, 3, 4, 5, 6], time: 'short', type: 'party', difficulty: '매우 쉬움', desc: '과일 개수의 합이 정확히 5개가 되는 순간, 가장 빠르게 종을 치는 국민 게임.', tips: '카드를 뒤집을 때는 나보다 상대방이 먼저 보이게 바깥쪽으로 뒤집으세요!', imageText: '🔔' },
  { id: 'g5', name: '코드네임 (Codenames)', players: [2, 3, 4, 5, 6, 7, 8], time: 'medium', type: 'bluffing', difficulty: '보통', desc: '팀장의 단 한 단어 힌트를 듣고 아군의 스파이 단어들을 찾아내는 기발한 단어 연상 게임.', tips: '상대방 스파이나 암살자 단어를 연상시키지 않도록 주의 깊은 힌트가 중요합니다.', imageText: '🕵️' },
  { id: 'g6', name: '뱅! (BANG!)', players: [4, 5, 6, 7], time: 'long', type: 'bluffing', difficulty: '보통', desc: '서부 무법지대에서 보안관, 부관, 무법자, 배신자가 서로 정체를 숨기며 벌이는 총격전.', tips: '자신의 직업에 맞는 연기가 필수! 무법자는 초반에 보안관을 공격해야 승산이 있어요.', imageText: '🤠' }
];

const NEW_GAMES = [
  {
    id: 'n1',
    name: '히트: 페달 투 더 메탈 (HEAT)',
    badge: 'HOT 신작',
    players: '1~6인',
    time: '60분',
    difficulty: '보통',
    desc: '1960년대 치열한 레이싱 경기장의 드라이버가 되어 보세요. 엔진 과열(Heat) 카드를 절묘하게 관리하며 코너를 돌파하고 결승선을 1등으로 통과하는 짜릿한 레이싱 보드게임입니다.',
    reason: '쉬운 룰과 뛰어난 몰입감! 실제 속도 경쟁을 하는 듯한 엔진 관리 덱빌딩 시스템이 일품입니다.',
    rules: ['코너 진입 전 표기된 제한 속도를 꼭 확인하세요. 초과하면 엔진 과열 카드가 들어옵니다!', '슬립스트림(앞차 바로 뒤에 붙기)을 활용해 추가 전진 찬스를 노리세요!'],
    imageText: '🏎️'
  },
  {
    id: 'n2',
    name: '아크 노바 (Ark Nova)',
    badge: '매니아 강추',
    players: '1~4인',
    time: '90~150분',
    difficulty: '어려움',
    desc: '현대식 고품격 동물원을 기획하고 운영하세요. 울타리를 짓고 동물을 유치하고, 전 세계 생태계 보존 프로젝트에 참여하여 최고의 동물원을 완성해 나가는 최고 평점의 전략 보드게임입니다.',
    reason: '보드게임 매니아라면 무조건 빠져들 수밖에 없는 정교한 액션 카드 메커니즘과 방대한 카드 조합의 재미!',
    rules: ['5가지 행동 카드가 오른쪽 슬롯으로 갈수록 파워가 강해집니다. 타이밍 배치가 핵심!', '매력 점수와 보호 점수가 서로 엇갈려 지나갈 때 게임이 종료되니 균형을 잘 잡으세요.'],
    imageText: '🦁'
  },
  {
    id: 'n3',
    name: '도르프 로만틱 (Dorfromantik)',
    badge: '힐링 협력',
    players: '1~6인',
    time: '30~40분',
    difficulty: '쉬움',
    desc: '아름다운 육각형 타일을 이어 붙이며 철로, 강, 숲, 마을을 만들고 주민들의 퀘스트를 해결하세요. 전 세계를 평정한 힐링 스팀 게임이 보드게임으로 재탄생하여 올해의 게임상을 수상했습니다.',
    reason: '경쟁에 지친 연인, 친구들과 평화롭게 타일을 맞추며 최고 점수를 갱신해나가는 최고의 캠페인 협력형 게임입니다.',
    rules: ['마을이나 숲의 퀘스트 조건(예: 정확히 타일 4개로 숲 완성)을 미리 계획하며 타일을 놓으세요.', '달성한 점수에 따라 점차 새로운 타일과 숨겨진 미션 봉투를 개봉하는 재미가 쏠쏠합니다.'],
    imageText: '🏡'
  }
];

const PRICING_PLANS = [
  { id: 'p1', title: '기본 요금제', price: '3,000원', details: '1시간 기준 (1분 초과당 50원 추가)', note: '포스기 실시간 연동 요금제', tag: '표준 요금', imageText: '⏰' },
  { id: 'p2', title: '평일 무제한 정액권', price: '10,000원', details: '평일 온종일 무제한 플레이', note: '공휴일 및 주말 사용 불가', tag: '가성비 최고', imageText: '🎟️' },
  { id: 'p3', title: '음료 요금제', price: '2,500원', details: '기본 1시간 기준 (1분 초과당 41.6원 추가)', note: '입장 음료 포함 알뜰 구성', tag: '추천 세트', imageText: '☕' },
  { id: 'p4', title: '주말 무제한 정액권', price: '12,000원', details: '주말 및 공휴일 온종일 무제한', note: '대기 인원 발생 시 이용 조율', tag: '주말 전용', imageText: '👑' }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('welcome');
  const [cart, setCart] = useState([]);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showCallModal, setShowCallModal] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [isSending, setIsProcessing] = useState(false);

  // --- 통합 데이터베이스 테이블 연동 상태 ---
  const [currentTableId, setCurrentTableId] = useState('3'); // 기본 기기값을 '3번 테이블'로 지정
  const [dbActive, setDbActive] = useState(false);
  const [user, setUser] = useState(null);

  // Toast State
  const [toastMessage, setToastMessage] = useState('');

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // --- 파이어베이스 안전 비동기 인증 연동 ---
  useEffect(() => {
    let unsubscribe = null;
    const initAuth = async () => {
      try {
        await signInAnonymously(auth);
      } catch (authErr) {
        // configuration-not-found 에러 대응 예외 처리 가드
        console.warn(
          "⚠️ 파이어베이스 콘솔에서 '익명 로그인(Anonymous Auth)' 활성화가 감지되지 않았습니다.\n" +
          "안전한 로컬/클라우드 통신을 위해 인증 단계를 스킵하고 진행합니다."
        );
      }
    };

    initAuth().then(() => {
      setDbActive(true);
      unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
      });
    }).catch(err => {
      console.warn("인증 모듈 로드 예외 우회 완료:", err);
      setDbActive(true); // 에러 발생 시에도 메인 시스템 가동 유지
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Recommender States
  const [recPlayers, setRecPlayers] = useState(4);
  const [recTime, setRecTime] = useState('all'); 
  const [recType, setRecType] = useState('all'); 
  const [recommendedGames, setRecommendedGames] = useState([]);

  useEffect(() => {
    handleRecommend();
  }, [recPlayers, recTime, recType]);

  const handleRecommend = () => {
    const filtered = BOARD_GAMES.filter(game => {
      const playerMatch = game.players.includes(Number(recPlayers));
      const timeMatch = recTime === 'all' || game.time === recTime;
      const typeMatch = recType === 'all' || game.type === recType;
      return playerMatch && timeMatch && typeMatch;
    });
    setRecommendedGames(filtered);
  };

  // Add to cart helper (포스기 연동을 위해 메뉴판 원본 객체 규격 유지)
  const addToCart = (item, option) => {
    const cartItemId = `${item.id}-${option}`;
    const existing = cart.find(i => i.cartItemId === cartItemId);
    
    // 포스기와 명칭을 동기화하기 위해 옵션 선택 사항을 메뉴 이름 뒤에 이쁘게 붙여줍니다.
    const displayName = option === '기본' ? item.name : `${item.name} (${option})`;

    if (existing) {
      setCart(cart.map(i => i.cartItemId === cartItemId ? { ...i, qty: i.qty + 1 } : i));
    } else {
      setCart([...cart, { 
        ...item, 
        cartItemId, 
        name: displayName, // 포스기에서 주문 식별 가능하도록 전송용 이름 가공
        originalName: item.name,
        selectedOption: option, 
        qty: 1 
      }]);
    }
    triggerToast(`🛒 ${displayName}이(가) 주문표에 담겼습니다.`);
  };

  const updateCartQty = (cartItemId, delta) => {
    setCart(cart.map(i => {
      if (i.cartItemId === cartItemId) {
        const newQty = i.qty + delta;
        return newQty > 0 ? { ...i, qty: newQty } : i;
      }
      return i;
    }).filter(i => i.qty > 0));
  };

  const clearCart = () => {
    setCart([]);
  };

  // --- [실시간 전송 개편] 카운터 포스기 파이어베이스 DB로 주문 전송 ---
  const handleCheckout = async () => {
    if (cart.length === 0) return;
    if (isSending) return;

    setIsProcessing(true);
    try {
      // 포스기(App.jsx)가 바라보는 경로와 완전히 동일하게 매핑
      const tableRef = doc(db, 'artifacts', 'our-azit-test', 'public', 'data', 'tables', currentTableId);

      // 장바구니 데이터를 포스기 영수증 엔진 규격으로 포맷팅
      const formattedSnacks = cart.map(item => ({
        name: item.name,
        price: item.price,
        qty: item.qty
      }));

      // 파이어베이스 데이터베이스의 해당 테이블 문서 내 snacks 배열에 주문 추가 및 테이블 자동 활성화
      await setDoc(tableRef, {
        id: Number(currentTableId),
        name: currentTableId === '8' ? 'VIP 룸 👑' : `${currentTableId}번 테이블`,
        active: true, // 주문 접수 시 포스기에서 즉시 해당 테이블 가동 감지
        snacks: arrayUnion(...formattedSnacks)
      }, { merge: true });

      // 완료 후 주문 성공 알림 및 리셋
      setOrderSuccess(true);
      setTimeout(() => {
        setOrderSuccess(false);
        setShowOrderModal(false);
        clearCart();
      }, 3000);

    } catch (error) {
      console.error("카운터 DB 전송 실패:", error);
      triggerToast("⚠️ 카운터 전송 실패! 화면 우측의 직원 [호출]을 이용해 주세요.");
    } finally {
      setIsProcessing(false);
    }
  };

  // --- 직원 호출 파이어베이스 연동 ---
  const handleStaffCall = async () => {
    setShowCallModal(true);
    try {
      const tableRef = doc(db, 'artifacts', 'our-azit-test', 'public', 'data', 'tables', currentTableId);
      // 테이블 정보에 직원을 즉시 호출했다는 알림 플래그 생성 전달
      await setDoc(tableRef, {
        staffCall: true,
        callTime: new Date().toISOString()
      }, { merge: true });
    } catch (e) {
      console.warn("직원 호출 원격지 기록 누락(네트워크 지연)", e);
    }
  };

  const totalCartPrice = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  return (
    <div className="min-h-screen bg-neutral-950 text-stone-100 font-sans flex flex-col selection:bg-amber-500 selection:text-black pb-20 md:pb-0">
      
      {/* Global CSS Style for Fade In Animation */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-extrabold px-6 py-3 rounded-full shadow-2xl flex items-center space-x-2 border-2 border-amber-300 animate-bounce">
          <span>✨</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-40 bg-neutral-900/95 backdrop-blur-md border-b border-amber-500/20 px-4 py-4 md:px-8 flex justify-between items-center shadow-lg">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('welcome')}>
          <div className="p-2.5 bg-gradient-to-tr from-amber-600 to-yellow-400 rounded-xl shadow-lg shadow-amber-500/20">
            <span className="text-xl">🎮</span>
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 tracking-wider">
              테이블 마스터
            </h1>
            <div className="flex items-center space-x-1.5 mt-0.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="text-[10px] text-stone-400 font-bold">우리들의 아지트 실시간 연동 기기</span>
            </div>
          </div>
        </div>

        {/* Dynamic Table Configurator in Header for Seamless testing */}
        <div className="flex items-center space-x-2.5">
          <div className="flex items-center space-x-1 bg-black px-3 py-1.5 rounded-xl border border-stone-800">
            <span className="text-[10px] text-amber-500 font-black">기기 위치:</span>
            <select
              value={currentTableId}
              onChange={(e) => {
                setCurrentTableId(e.target.value);
                triggerToast(`기기 세팅이 ${e.target.value === '8' ? 'VIP 룸' : `${e.target.value}번 테이블`}로 성공적으로 변경되었습니다.`);
              }}
              className="bg-transparent text-xs text-white font-extrabold outline-none cursor-pointer border-none p-0 focus:ring-0"
            >
              {[1, 2, 3, 4, 5, 6, 7].map(num => (
                <option key={num} value={String(num)} className="bg-neutral-900 text-white">{num}번 테이블</option>
              ))}
              <option value="8" className="bg-neutral-900 text-white">VIP 룸 👑</option>
            </select>
          </div>

          {/* Cart Float Button in Header */}
          {cart.length > 0 && (
            <button
              onClick={() => setShowOrderModal(true)}
              className="relative px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black font-extrabold rounded-xl text-xs flex items-center gap-1 shadow-lg shadow-amber-500/20 active:scale-95 transition-all duration-300"
            >
              <span>🛒 주문서</span>
              <span className="bg-black text-amber-400 text-[10px] px-1.5 py-0.5 rounded-full font-black">
                {cart.reduce((sum, item) => sum + item.qty, 0)}
              </span>
            </button>
          )}

          {activeTab !== 'welcome' && (
            <button
              onClick={() => setActiveTab('welcome')}
              className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-amber-400 hover:text-amber-350 border border-amber-500/30 rounded-xl text-xs font-black transition-all duration-300 flex items-center space-x-1.5"
            >
              <span>◀ 홈으로</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8">
        
        {/* TAB 0: 첫 환영 화면 (사자 캐릭터 정중앙 + 버튼 좌우 배치) */}
        {activeTab === 'welcome' && (
          <WelcomeLanding setTab={setActiveTab} handleStaffCall={handleStaffCall} currentTableId={currentTableId} />
        )}

        {/* TAB 1: 이용 안내 코너 */}
        {activeTab === 'pricing' && (
          <PricingSection />
        )}
        
        {/* TAB 2: 메뉴판 코너 */}
        {activeTab === 'menu' && (
          <MenuSection addToCart={addToCart} />
        )}

        {/* TAB 3: 추천해줘 코너 */}
        {activeTab === 'recommender' && (
          <RecommenderSection
            recPlayers={recPlayers}
            setRecPlayers={setRecPlayers}
            recTime={recTime}
            setRecTime={setRecTime}
            recType={recType}
            setRecType={setRecType}
            recommendedGames={recommendedGames}
            handleRecommend={handleRecommend}
          />
        )}

        {/* TAB 4: 신작소식 코너 */}
        {activeTab === 'newArrivals' && (
          <NewArrivalsSection />
        )}

        {/* TAB 5: 잡동사니 코너 (게임 만능 헬퍼) */}
        {activeTab === 'helper' && (
          <HelperSection />
        )}

      </main>

      {/* Custom Staff Call Modal */}
      {showCallModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-neutral-900 border-2 border-amber-500 rounded-3xl max-w-sm w-full p-8 text-center shadow-2xl relative overflow-hidden animate-fade-in">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600" />
            <div className="w-20 h-20 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-full flex items-center justify-center text-4xl mx-auto mb-6 animate-bounce">
              🔔
            </div>
            <h3 className="text-xl font-black text-white mb-2">직원 호출 완료</h3>
            <p className="text-sm text-amber-500 font-bold mb-4">
              [{currentTableId === '8' ? 'VIP 룸' : `${currentTableId}번 테이블`}] 호출벨 접수
            </p>
            <p className="text-xs text-stone-400 leading-relaxed mb-6">
              요청하신 부름이 통합 클라우드를 거쳐 카운터 포스기에 실시간으로 전달되었습니다. 곧 직원이 이동할 테니 잠시만 대기해 주세요!
            </p>
            <button
              onClick={() => setShowCallModal(false)}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black font-black text-xs rounded-xl transition duration-300 active:scale-95 shadow-lg shadow-amber-500/10"
            >
              확인 / 닫기
            </button>
          </div>
        </div>
      )}

      {/* Cart & Checkout Modal */}
      {showOrderModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-neutral-900 border-2 border-amber-500/50 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-amber-500/20 flex justify-between items-center bg-black">
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <span className="text-amber-400">🛒 실시간 카운터 주문표</span>
                <span className="text-[10px] bg-neutral-800 text-amber-500 border border-amber-500/30 px-2.5 py-0.5 rounded-full font-black">
                  {currentTableId === '8' ? 'VIP 룸 👑' : `${currentTableId}번 테이블`}
                </span>
              </h3>
              <button
                onClick={() => setShowOrderModal(false)}
                className="text-stone-450 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              {orderSuccess ? (
                <div className="py-8 text-center flex flex-col items-center justify-center space-y-4">
                  <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 border border-emerald-500 rounded-full flex items-center justify-center text-4xl animate-bounce">
                    ✓
                  </div>
                  <h4 className="text-xl font-black text-white">주문이 카운터로 발송되었습니다!</h4>
                  <p className="text-stone-400 text-xs">포스기에 실시간 자동 등록되어 준비되는 즉시 가져다 드리겠습니다.</p>
                </div>
              ) : cart.length === 0 ? (
                <div className="py-12 text-center text-stone-500">
                  <span className="text-5xl block mb-4">🍽️</span>
                  장바구니가 비어 있습니다.<br />메뉴판에서 맛있는 간식을 골라보세요!
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div key={item.cartItemId} className="flex items-center justify-between p-3.5 bg-black/60 rounded-xl border border-stone-800">
                      <div className="flex-1 min-w-0 pr-3">
                        <h4 className="text-sm font-bold text-white truncate">{item.name}</h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-[11px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-1.5 py-0.5 rounded font-semibold">
                            {item.selectedOption}
                          </span>
                          <span className="text-xs text-stone-400">{(item.price * item.qty).toLocaleString()}원</span>
                        </div>
                      </div>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-2.5 bg-neutral-950 p-1.5 rounded-lg border border-stone-850">
                        <button
                          onClick={() => updateCartQty(item.cartItemId, -1)}
                          className="w-6 h-6 flex items-center justify-center rounded bg-stone-800 text-stone-300 hover:bg-stone-750 active:scale-90 font-bold"
                        >
                          -
                        </button>
                        <span className="text-sm font-semibold w-4 text-center text-amber-400 font-mono">{item.qty}</span>
                        <button
                          onClick={() => updateCartQty(item.cartItemId, 1)}
                          className="w-6 h-6 flex items-center justify-center rounded bg-stone-800 text-stone-300 hover:bg-stone-700 active:scale-90 font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  {/* Summary */}
                  <div className="pt-4 border-t border-stone-800 mt-6 space-y-2">
                    <div className="flex justify-between text-sm text-stone-400">
                      <span>총 주문 종류 / 수량</span>
                      <span className="font-bold text-white">{cart.length}종 / {cart.reduce((sum, item) => sum + item.qty, 0)}개</span>
                    </div>
                    <div className="flex justify-between text-base font-extrabold text-white pt-1 border-t border-neutral-900 mt-2">
                      <span>주문 예상 합계액</span>
                      <span className="text-yellow-400 text-xl font-black">{totalCartPrice.toLocaleString()}원</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            {!orderSuccess && cart.length > 0 && (
              <div className="p-6 bg-black border-t border-stone-850 flex space-x-3">
                <button
                  onClick={clearCart}
                  className="px-4 py-3 bg-neutral-900 hover:bg-stone-800 text-stone-400 hover:text-white rounded-xl transition text-sm font-semibold border border-stone-850"
                >
                  지우기
                </button>
                <button
                  onClick={handleCheckout}
                  disabled={isSending}
                  className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 disabled:opacity-40 text-black font-extrabold rounded-xl transition text-sm shadow-lg shadow-amber-500/20 active:scale-[0.98]"
                >
                  {isSending ? "주문 데이터 전송 중..." : "카운터로 실시간 주문 발송"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating Bottom Cart (Sticky for Mobile UX) */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 inset-x-0 z-30 md:hidden bg-neutral-900 border-t border-amber-500/30 p-4 flex items-center justify-between shadow-2xl">
          <div>
            <p className="text-[10px] text-stone-400">주문서 대기 목록</p>
            <p className="text-amber-400 font-black text-base">{totalCartPrice.toLocaleString()}원 ({cart.reduce((sum, item) => sum + item.qty, 0)}개)</p>
          </div>
          <button
            onClick={() => setShowOrderModal(true)}
            className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-black text-xs rounded-xl shadow-lg shadow-amber-500/10 active:scale-95 transition-all"
          >
            장바구니 확인 & 주문
          </button>
        </div>
      )}

    </div>
  );
}

// ==========================================
// LANDING WELCOME COMPONENT
// ==========================================
function WelcomeLanding({ setTab, handleStaffCall, currentTableId }) {
  return (
    <div className="max-w-6xl mx-auto py-8 px-4 flex flex-col items-center justify-center min-h-[70vh] animate-fade-in">
      
      {/* Symmetric Layout: Buttons (Left 3) + Image (Center) + Buttons (Right 3) */}
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 items-center">
        
        {/* Left Side: 3 Buttons */}
        <div className="flex flex-col space-y-4 md:space-y-6 order-2 md:order-1">
          <LandingMenuButton
            onClick={() => setTab('pricing')}
            icon="💰"
            title="이용 안내"
          />
          <LandingMenuButton
            onClick={() => setTab('menu')}
            icon="☕"
            title="메뉴판"
          />
          <LandingMenuButton
            onClick={() => setTab('recommender')}
            icon="🎯"
            title="추천해줘"
          />
        </div>

        {/* Center: Character Image */}
        <div className="flex flex-col items-center justify-center order-1 md:order-2 py-4">
          <div className="relative p-3 rounded-full border-4 border-amber-500/30 bg-gradient-to-b from-amber-500/10 to-transparent shadow-2xl shadow-amber-500/20 hover:border-amber-500/80 transition-all duration-300">
            <img 
              src="KakaoTalk_20220811_120355071_2.png" 
              alt="테이블 마스터 캐릭터" 
              className="w-48 h-48 sm:w-60 sm:h-60 md:w-72 md:h-72 object-contain hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=400";
              }}
            />
          </div>
          <div className="mt-4 text-center">
            <span className="text-[10px] text-amber-500 font-extrabold uppercase bg-amber-550/10 px-3 py-1 rounded-full border border-amber-500/20">
              {currentTableId === '8' ? '👑 VIP ROOM' : `📌 TABLE ${currentTableId}`}
            </span>
          </div>
        </div>

        {/* Right Side: 3 Buttons */}
        <div className="flex flex-col space-y-4 md:space-y-6 order-3">
          <LandingMenuButton
            onClick={() => setTab('newArrivals')}
            icon="🔥"
            title="신작소식"
          />
          <LandingMenuButton
            onClick={() => setTab('helper')}
            icon="🛠️"
            title="잡동사니"
          />
          {/* Call Bell Trigger */}
          <button
            onClick={handleStaffCall}
            className="group relative flex flex-col items-center justify-center py-6 px-4 bg-gradient-to-r from-red-950 to-neutral-950 hover:from-red-900 border-2 border-red-500/30 hover:border-red-500 rounded-3xl text-center transition-all duration-300 hover:shadow-2xl hover:shadow-red-500/15 active:scale-98"
          >
            <div className="text-3xl mb-1.5 group-hover:animate-bounce">🔔</div>
            <h3 className="text-base font-black text-white group-hover:text-red-405 transition-colors">호출</h3>
            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-red-500 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity rounded-b-3xl" />
          </button>
        </div>

      </div>

    </div>
  );
}

function LandingMenuButton({ onClick, icon, title }) {
  return (
    <button
      onClick={onClick}
      className="group relative flex flex-col items-center justify-center py-6 px-4 bg-gradient-to-b from-neutral-900 to-black hover:from-neutral-950 border-2 border-amber-500/20 hover:border-amber-400 rounded-3xl text-center transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/10 active:scale-98"
    >
      <div className="text-3xl mb-1.5 group-hover:scale-110 transition-transform duration-300">{icon}</div>
      <h3 className="text-base font-black text-white group-hover:text-amber-400 transition-colors">{title}</h3>
      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-amber-500 to-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity rounded-b-3xl" />
    </button>
  );
}

// ------------------------------------------
// 1. 이용 안내 (PRICING SECTION)
// ------------------------------------------
function PricingSection() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-500">💰 이용 안내 및 요금표</h2>
        <p className="text-xs text-stone-400">합리적인 가격으로 오랜 시간 완벽한 보드게임을 힐링하며 즐기세요.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {PRICING_PLANS.map((plan) => (
          <div key={plan.id} className="relative bg-neutral-950 border-2 border-amber-500/20 rounded-2xl overflow-hidden flex flex-col justify-between group hover:border-amber-400 transition-all duration-300">
            <div className="h-28 bg-neutral-900 border-b border-amber-500/25 relative flex items-center justify-center text-stone-500 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-950/20 to-black opacity-60" />
              <div className="z-10 text-center">
                <span className="text-4xl block mb-1">{plan.imageText}</span>
                <span className="bg-black/60 text-amber-400 text-[9px] px-2 py-0.5 rounded-full border border-amber-500/20 font-black">{plan.tag}</span>
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <h4 className="text-md font-extrabold text-white">{plan.title}</h4>
                <p className="text-xs text-stone-400 mt-1">{plan.details}</p>
              </div>
              <div className="pt-3 border-t border-stone-900 text-right">
                <p className="text-[10px] text-stone-500 font-semibold">{plan.note}</p>
                <p className="text-xl font-black text-yellow-400 font-mono mt-0.5">{plan.price}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ------------------------------------------
// 2. 메뉴판 코너 (MENU SECTION)
// ------------------------------------------
function MenuSection({ addToCart }) {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', label: '전체 메뉴' },
    { id: 'coffee', label: '커피 & 음료' },
    { id: 'beverage', label: '라떼 & 에이드' },
    { id: 'snack', label: '과자 & 스낵' }
  ];

  const filteredItems = selectedCategory === 'all' 
    ? MENU_ITEMS 
    : MENU_ITEMS.filter(item => item.category === selectedCategory);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-500">🍿 스낵 & 간식 메뉴판</h2>
        <p className="text-xs text-stone-400">보드게임 도중 원격으로 간식을 오더하시면 카운터 포스기로 실시간 접수됩니다.</p>
      </div>

      {/* 카테고리 필터 탭 */}
      <div className="flex justify-center space-x-1.5 bg-neutral-900 p-1 rounded-2xl max-w-md mx-auto border border-stone-800">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`flex-1 py-2 text-xs font-black rounded-xl transition-all ${selectedCategory === cat.id ? 'bg-amber-500 text-black shadow-md' : 'text-stone-400 hover:text-white'}`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* 메뉴 카드 목록 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredItems.map(item => (
          <div key={item.id} className="bg-neutral-900/60 border border-stone-800 rounded-2xl p-4 flex flex-col justify-between hover:border-amber-500/30 transition-all">
            <div className="flex items-start justify-between">
              <div className="bg-black text-2xl p-3 rounded-xl border border-stone-800 shadow-inner">
                {item.imageText}
              </div>
              {item.isPopular && (
                <span className="bg-red-500/10 text-red-400 border border-red-500/20 text-[9px] px-2 py-0.5 rounded-full font-black animate-pulse">
                  POPULAR
                </span>
              )}
            </div>

            <div className="mt-4 flex-1 space-y-1">
              <h4 className="text-sm font-bold text-white flex items-center gap-1.5">{item.name}</h4>
              <p className="text-[11px] text-stone-400 leading-normal">{item.desc}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-stone-900 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-stone-500">가격</span>
                <span className="text-md font-black text-amber-400 font-mono">{item.price.toLocaleString()} 원</span>
              </div>

              {/* 옵션 버튼 그룹 및 다이렉트 장바구니 담기 */}
              <div className="space-y-1.5">
                <span className="text-[10px] text-stone-500 block font-semibold">옵션 선택 후 주문서 추가</span>
                <div className="grid grid-cols-2 gap-1.5">
                  {item.options.map(opt => (
                    <button
                      key={opt}
                      onClick={() => addToCart(item, opt)}
                      className="bg-neutral-950 hover:bg-neutral-800 text-[10px] font-black py-2 rounded-lg text-amber-400 hover:text-white border border-stone-800 transition-all text-center flex items-center justify-center gap-1"
                    >
                      <span>➕ {opt}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ------------------------------------------
// 3. 보드게임 지능형 추천 (RECOMMENDER)
// ------------------------------------------
function RecommenderSection({ recPlayers, setRecPlayers, recTime, setRecTime, recType, setRecType, recommendedGames, handleRecommend }) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500">🎯 맞춤형 보드게임 큐레이터</h2>
        <p className="text-xs text-stone-400">인원수와 원하는 게임 장르를 선택하면 아지트 보유 보드게임 목록에서 즉시 매칭 추천합니다.</p>
      </div>

      {/* 필터 세팅 */}
      <div className="bg-neutral-900 border border-stone-850 p-5 rounded-3xl grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-extrabold text-amber-400 uppercase tracking-wider block">1. 함께 온 인원수</label>
          <select 
            value={recPlayers} 
            onChange={(e) => setRecPlayers(e.target.value)}
            className="w-full bg-black border border-stone-800 rounded-xl p-3 text-xs text-white focus:border-amber-500 focus:ring-0"
          >
            {[2, 3, 4, 5, 6, 7, 8].map(n => (
              <option key={n} value={n}>{n}인 플레이</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-extrabold text-amber-400 uppercase tracking-wider block">2. 플레이 타임</label>
          <select 
            value={recTime} 
            onChange={(e) => setRecTime(e.target.value)}
            className="w-full bg-black border border-stone-800 rounded-xl p-3 text-xs text-white focus:border-amber-500 focus:ring-0"
          >
            <option value="all">플레이 타임 상관 없음</option>
            <option value="short">30분 미만 (가볍고 캐주얼한 파티)</option>
            <option value="medium">30분 ~ 60분 (보통 난이도 및 보드게임 정석)</option>
            <option value="long">60분 이상 (본격적인 전략 전략가용)</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-extrabold text-amber-400 uppercase tracking-wider block">3. 선호 장르</label>
          <select 
            value={recType} 
            onChange={(e) => setRecType(e.target.value)}
            className="w-full bg-black border border-stone-800 rounded-xl p-3 text-xs text-white focus:border-amber-500 focus:ring-0"
          >
            <option value="all">모든 장르 전체 매칭</option>
            <option value="party">왁자지껄 빵 터지는 파티 게임</option>
            <option value="strategy">치열한 머리 싸움 두뇌 전략</option>
            <option value="bluffing">거짓말과 추리가 섞인 마피아/블러핑</option>
          </select>
        </div>
      </div>

      {/* 매칭 결과 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendedGames.map(game => (
          <div key={game.id} className="bg-neutral-950 border-2 border-stone-850 rounded-2xl overflow-hidden hover:border-amber-500/30 transition-all flex flex-col justify-between">
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-3xl">{game.imageText}</span>
                  <span className="bg-stone-900 border border-stone-800 text-stone-400 text-[10px] px-2 py-0.5 rounded-full">
                    난이도: {game.difficulty}
                  </span>
                </div>
                <h4 className="text-base font-extrabold text-white">{game.name}</h4>
                <p className="text-xs text-stone-400 leading-relaxed">{game.desc}</p>
              </div>

              <div className="pt-3 border-t border-stone-900 bg-neutral-900/60 p-3 rounded-xl space-y-1">
                <span className="text-[10px] font-black text-amber-400 uppercase tracking-wider">💡 꿀잼 추천팁</span>
                <p className="text-xs text-stone-350 leading-relaxed">{game.tips}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ------------------------------------------
// 4. 신작소식 (NEW ARRIVALS SECTION)
// ------------------------------------------
function NewArrivalsSection() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center max-w-xl mx-auto space-y-2 mb-8">
        <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-500">🔥 매장 신작 입고 현황</h2>
        <p className="text-xs text-stone-400">이번 주 보드게임 카페에 새로 입고되어 최고의 인기를 달리고 있는 대작들을 소개합니다!</p>
      </div>

      <div className="space-y-8">
        {NEW_GAMES.map((game) => (
          <div key={game.id} className="bg-gradient-to-br from-neutral-950 to-neutral-900 border-2 border-amber-500/20 rounded-3xl p-6 md:p-8 flex flex-col lg:flex-row gap-6 items-center shadow-2xl">
            <div className="w-full lg:w-[200px] h-[160px] bg-black border border-stone-800 rounded-2xl flex-shrink-0 flex items-center justify-center text-6xl shadow-inner">
              {game.imageText}
            </div>

            <div className="flex-1 space-y-4">
              <div className="flex items-center space-x-2 flex-wrap gap-y-2">
                <span className="bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-black text-[10px] md:text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                  {game.badge}
                </span>
                <span className="bg-stone-900 text-stone-400 text-xs px-2.5 py-1 rounded-full border border-stone-800">
                  👥 {game.players} 플레이
                </span>
                <span className="bg-stone-900 text-stone-400 text-xs px-2.5 py-1 rounded-full border border-stone-800">
                  ⏱️ {game.time}
                </span>
                <span className="bg-stone-900 text-stone-400 text-xs px-2.5 py-1 rounded-full border border-stone-800">
                  🎲 난이도: {game.difficulty}
                </span>
              </div>

              <h3 className="text-xl md:text-2xl font-black text-white">{game.name}</h3>
              <p className="text-xs md:text-sm text-stone-300 leading-relaxed">{game.desc}</p>
              
              <div className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-2xl">
                <h5 className="text-xs font-bold text-amber-400 flex items-center space-x-1">
                  <span>⭐️ 사장님 한줄평:</span>
                </h5>
                <p className="text-xs text-stone-300 mt-1 leading-relaxed">{game.reason}</p>
              </div>
            </div>

            <div className="w-full lg:w-[300px] bg-neutral-950 border border-stone-800 rounded-2xl p-5 space-y-3">
              <h4 className="text-xs font-bold text-white tracking-wide border-b border-stone-800 pb-2">
                🎮 초보자를 위한 퀵 가이드
              </h4>
              <ul className="space-y-3">
                {game.rules.map((rule, rIdx) => (
                  <li key={rIdx} className="flex items-start space-x-2 text-xs">
                    <span className="bg-amber-500/20 text-amber-400 w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                      {rIdx + 1}
                    </span>
                    <span className="text-stone-300 leading-relaxed">{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ------------------------------------------
// 5. 잡동사니 코너 (HELPER SECTION)
// ------------------------------------------
function HelperSection() {
  const [activeTool, setActiveTool] = useState('chwazi');

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center max-w-xl mx-auto space-y-2 mb-4">
        <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-500">🛠️ 아지트 만능 도구 상자</h2>
        <p className="text-xs text-stone-400">선 벌칙 및 순서 정하기, 벌칙 돌림판, 모래시계 타이머 등 보드게임 전용 스마트 헬퍼 도구 모음입니다.</p>
      </div>

      <div className="grid grid-cols-3 gap-2 bg-neutral-900 p-1.5 rounded-2xl border border-stone-850">
        <ToolTabButton active={activeTool === 'chwazi'} onClick={() => setActiveTool('chwazi')} label="순서 선정 (츄아지)" icon="🖐️" />
        <ToolTabButton active={activeTool === 'timer'} onClick={() => setActiveTool('timer')} label="모래시계 타이머" icon="⏳" />
        <ToolTabButton active={activeTool === 'roulette'} onClick={() => setActiveTool('roulette')} label="벌칙 돌림판" icon="🎡" />
      </div>

      <div className="bg-neutral-900/60 border border-stone-850 rounded-3xl p-6 min-h-[400px] flex flex-col justify-center">
        {activeTool === 'chwazi' && <ChwaziTool />}
        {activeTool === 'timer' && <TimerTool />}
        {activeTool === 'roulette' && <RouletteTool />}
      </div>
    </div>
  );
}

function ToolTabButton({ active, onClick, label, icon }) {
  return (
    <button
      onClick={onClick}
      className={`py-3 px-2 rounded-xl text-xs md:text-sm font-bold flex flex-col items-center justify-center space-y-1 transition-all duration-300 ${
        active
          ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black shadow-lg shadow-amber-500/10'
          : 'text-stone-400 hover:text-stone-200 hover:bg-neutral-900'
      }`}
    >
      <span className="text-xl">{icon}</span>
      <span>{label}</span>
    </button>
  );
}

// 츄아지 툴
function ChwaziTool() {
  const [fingers, setFingers] = useState([]);
  const [chwaziMode, setChwaziMode] = useState('one');
  const [teamCount, setTeamCount] = useState(2);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultMessage, setResultMessage] = useState('');
  const arenaRef = useRef(null);

  const fingerColors = ['#f59e0b', '#ef4444', '#3b82f6', '#10b981', '#8b5cf6', '#ec4899', '#14b8a6', '#eab308'];

  const handleArenaClick = (e) => {
    if (isProcessing) return;
    const rect = arenaRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const existingIndex = fingers.findIndex(f => Math.hypot(f.x - x, f.y - y) < 30);

    if (existingIndex !== -1) {
      setFingers(fingers.filter((_, idx) => idx !== existingIndex));
    } else {
      if (fingers.length >= 8) return;
      const id = Date.now() + Math.random();
      const color = fingerColors[fingers.length % fingerColors.length];
      setFingers([...fingers, { id, x, y, color, isPicked: false, teamId: null }]);
    }
    setResultMessage('');
  };

  const runChwazi = () => {
    if (fingers.length < 2 || isProcessing) return;
    setIsProcessing(true);
    setResultMessage('손가락 위치 분석 중... 2초 후 선정 완료!');

    setTimeout(() => {
      if (chwaziMode === 'one') {
        const winIdx = Math.floor(Math.random() * fingers.length);
        setFingers(prev => prev.map((f, idx) => ({ ...f, isPicked: idx === winIdx })));
        setResultMessage(`🎉 당첨 손가락 선정 완료! (선택된 손가락 확인)`);
      } else {
        const shuffled = [...fingers].sort(() => Math.random() - 0.5);
        const nextFingers = fingers.map(f => {
          const sIdx = shuffled.findIndex(sh => sh.id === f.id);
          return { ...f, teamId: (sIdx % teamCount) + 1 };
        });
        setFingers(nextFingers);
        setResultMessage(`👥 ${teamCount}개 팀으로 균등 매칭되었습니다!`);
      }
      setIsProcessing(false);
    }, 2000);
  };

  const resetChwazi = () => {
    setFingers([]);
    setResultMessage('');
    setIsProcessing(false);
  };

  return (
    <div className="space-y-4 max-w-lg mx-auto w-full">
      <div className="flex justify-between items-center bg-black/45 p-3 rounded-xl border border-stone-850">
        <div className="flex space-x-1.5">
          <button
            onClick={() => { setChwaziMode('one'); resetChwazi(); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${chwaziMode === 'one' ? 'bg-amber-500 text-black' : 'text-stone-400'}`}
          >
            선착순 한명 🎯
          </button>
          <button
            onClick={() => { setChwaziMode('team'); resetChwazi(); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${chwaziMode === 'team' ? 'bg-amber-500 text-black' : 'text-stone-400'}`}
          >
            팀 분배기 👥
          </button>
        </div>

        {chwaziMode === 'team' && (
          <div className="flex items-center space-x-1">
            <span className="text-[10px] text-stone-500 font-bold">팀 구성:</span>
            <select
              value={teamCount}
              onChange={(e) => { setTeamCount(Number(e.target.value)); resetChwazi(); }}
              className="bg-stone-900 border border-stone-800 rounded px-1.5 py-0.5 text-xs text-amber-450 outline-none"
            >
              <option value={2}>2팀</option>
              <option value={3}>3팀</option>
              <option value={4}>4팀</option>
            </select>
          </div>
        )}
      </div>

      <div
        ref={arenaRef}
        onClick={handleArenaClick}
        className="relative w-full h-[280px] bg-black border-2 border-dashed border-amber-500/20 rounded-2xl cursor-pointer overflow-hidden flex items-center justify-center text-center shadow-inner"
      >
        {fingers.length === 0 && (
          <div className="p-4 space-y-2 pointer-events-none">
            <span className="text-3xl block animate-pulse">🖐️</span>
            <h4 className="text-xs font-bold text-stone-450">화면 내부를 자유롭게 터치하여 손가락을 올려두세요!</h4>
            <p className="text-[10px] text-stone-550 leading-relaxed">(PC: 마우스로 화면의 여러 지점을 클릭하여 생성 가능)</p>
          </div>
        )}

        {fingers.map((f, i) => (
          <div
            key={f.id}
            className="absolute rounded-full flex items-center justify-center transition-all duration-150"
            style={{
              left: `${f.x - 24}px`,
              top: `${f.y - 24}px`,
              width: '48px',
              height: '48px',
              backgroundColor: f.color,
              boxShadow: f.isPicked 
                ? `0 0 30px 10px ${f.color}, inset 0 0 8px #fff` 
                : f.teamId 
                ? `0 0 12px 3px ${f.color}` 
                : '0 0 8px 1px rgba(255,255,255,0.2)',
              border: f.isPicked ? '3px solid #fff' : '2px solid rgba(255,255,255,0.7)',
              transform: f.isPicked ? 'scale(1.2)' : 'scale(1)',
              zIndex: f.isPicked ? 20 : 10
            }}
          >
            {f.isPicked && <span className="text-sm">🏆</span>}
            {f.teamId && <span className="text-[10px] font-black bg-black text-white px-1.5 py-0.5 rounded-full border border-white/30">{f.teamId}팀</span>}
            {!f.isPicked && !f.teamId && <span className="text-[10px] font-bold text-black">{i + 1}</span>}
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <div className="flex space-x-2">
          <button
            onClick={runChwazi}
            disabled={fingers.length < 2 || isProcessing}
            className="flex-1 py-3 bg-amber-500 hover:bg-amber-400 text-black font-extrabold rounded-xl text-xs transition duration-300 disabled:opacity-40"
          >
            {isProcessing ? '신호 판정 중...' : '복불복 선정 🚀'}
          </button>
          <button
            onClick={resetChwazi}
            className="px-4 py-3 bg-neutral-950 border border-stone-800 text-stone-300 font-bold rounded-xl text-xs transition"
          >
            지우기
          </button>
        </div>

        {resultMessage && (
          <div className="bg-amber-500/10 border border-amber-500/20 p-2.5 rounded-xl text-center">
            <p className="text-xs font-bold text-amber-450">{resultMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
}

// 타이머 툴
function TimerTool() {
  const [seconds, setSeconds] = useState(60);
  const [isActive, setIsActive] = useState(false);
  const [totalTime, setTotalTime] = useState(60);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isActive && seconds > 0) {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => prev - 1);
      }, 1000);
    } else if (seconds === 0) {
      setIsActive(false);
      clearInterval(intervalRef.current);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isActive, seconds]);

  const handleStartStop = () => {
    setIsActive(!isActive);
  };

  const handleReset = (newSecs = totalTime) => {
    setIsActive(false);
    setSeconds(newSecs);
    setTotalTime(newSecs);
  };

  const percent = totalTime > 0 ? (seconds / totalTime) * 100 : 0;

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-5 py-2 max-w-sm mx-auto w-full">
      <div className="relative w-40 h-40 flex items-center justify-center bg-black rounded-full border border-stone-800 shadow-xl">
        <div
          className="absolute inset-2 rounded-full transition-all duration-1000"
          style={{
            background: `conic-gradient(from 0deg, #f59e0b ${percent}%, #1a1a1a ${percent}%)`
          }}
        />
        <div className="absolute inset-3.5 bg-neutral-950 rounded-full flex flex-col items-center justify-center space-y-1">
          <span className="text-3xl font-black font-mono text-white">{formatTime(seconds)}</span>
          <span className="text-[9px] text-stone-500 font-bold">{totalTime}초 타이머</span>
        </div>
      </div>

      <div className="flex space-x-2 w-full">
        <button
          onClick={handleStartStop}
          className={`flex-1 py-2.5 font-bold rounded-xl text-xs transition-all ${
            isActive ? 'bg-red-600 text-white' : 'bg-amber-500 text-black'
          }`}
        >
          {isActive ? '일시 정지' : '기동 시작'}
        </button>
        <button
          onClick={() => handleReset()}
          className="px-4 py-2.5 bg-stone-850 hover:bg-stone-800 font-bold rounded-xl text-xs text-stone-300"
        >
          리셋
        </button>
      </div>

      <div className="grid grid-cols-4 gap-1.5 w-full">
        {[30, 60, 180, 300].map((t) => (
          <button
            key={t}
            onClick={() => handleReset(t)}
            className={`py-2 text-xs font-bold rounded-lg transition-all ${
              totalTime === t
                ? 'bg-stone-800 text-amber-450 border border-amber-500/20'
                : 'bg-neutral-950 hover:bg-stone-900 text-stone-400'
            }`}
          >
            {t >= 60 ? `${t / 60}분` : `${t}초`}
          </button>
        ))}
      </div>
    </div>
  );
}

// 룰렛 툴
function RouletteTool() {
  const [options, setOptions] = useState([
    '치킨/스낵 쏘기 🍗',
    '이번 판 음료수 대리 픽업 🥤',
    '한 판 동안 존댓말 금지 🤫',
    '보드게임 반납 & 테이블 청소 🧹',
    '★ 벌칙 면제 ★ ✨',
    '엉덩이로 이름 쓰기 🍑'
  ]);
  const [newOption, setNewOption] = useState('');
  const [winner, setWinner] = useState('');
  const [isSpinning, setIsSpinning] = useState(false);
  const canvasRef = useRef(null);
  const angleRef = useRef(0);

  const colors = [
    '#d97706', '#b45309', '#78350f', '#f59e0b', '#fbbf24', '#fef08a', '#1e293b', '#475569'
  ];

  useEffect(() => {
    drawRoulette();
  }, [options]);

  const drawRoulette = (angle = 0) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const radius = canvas.width / 2;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const arcSize = (2 * Math.PI) / options.length;

    options.forEach((opt, i) => {
      const startAngle = i * arcSize + angle;
      const endAngle = startAngle + arcSize;

      ctx.beginPath();
      ctx.moveTo(radius, radius);
      ctx.arc(radius, radius, radius - 4, startAngle, endAngle);
      ctx.fillStyle = colors[i % colors.length];
      ctx.fill();
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#000000';
      ctx.stroke();

      ctx.save();
      ctx.translate(radius, radius);
      ctx.rotate(startAngle + arcSize / 2);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 9px sans-serif';
      ctx.textAlign = 'right';
      const text = opt.length > 15 ? opt.substring(0, 13) + '..' : opt;
      ctx.fillText(text, radius - 15, 3);
      ctx.restore();
    });

    ctx.beginPath();
    ctx.arc(radius, radius, 10, 0, 2 * Math.PI);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  const spin = () => {
    if (isSpinning || options.length === 0) return;
    setIsSpinning(true);
    setWinner('');

    const startRot = angleRef.current;
    const addedRot = 5 * 2 * Math.PI + Math.random() * 2 * Math.PI;
    const duration = 3000;
    const startTime = performance.now();

    const animate = (time) => {
      const elapsed = time - startTime;
      const t = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      const currentAngle = startRot + addedRot * ease;
      angleRef.current = currentAngle;
      drawRoulette(currentAngle);

      if (t < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsSpinning(false);
        const totalAngle = currentAngle % (2 * Math.PI);
        const arcSize = (2 * Math.PI) / options.length;
        let winningIndex = Math.floor((2 * Math.PI - (totalAngle % (2 * Math.PI))) / arcSize);
        winningIndex = (winningIndex + options.length) % options.length;
        
        const pointerCorrection = Math.floor((3 * Math.PI / 2) / arcSize);
        let correctedIndex = (winningIndex + pointerCorrection) % options.length;
        setWinner(options[correctedIndex]);
      }
    };

    requestAnimationFrame(animate);
  };

  const addOption = () => {
    if (!newOption.trim()) return;
    setOptions([...options, newOption.trim()]);
    setNewOption('');
  };

  const removeOption = (idx) => {
    setOptions(options.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-4 max-w-lg mx-auto w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="relative">
            <div className="absolute top-[-10px] left-1/2 transform -translate-x-1/2 z-10">
              <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[16px] border-t-amber-400" />
            </div>
            <canvas
              ref={canvasRef}
              width={200}
              height={200}
              className="rounded-full shadow-2xl border-4 border-stone-850 bg-black"
            />
          </div>

          <button
            onClick={spin}
            disabled={isSpinning || options.length === 0}
            className="px-6 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-black font-black rounded-xl text-xs shadow-lg transition"
          >
            {isSpinning ? '돌아간다!' : '룰렛 가동'}
          </button>

          {winner && (
            <div className="text-center p-2.5 bg-red-500/10 border border-red-500/20 rounded-xl max-w-[200px] animate-bounce">
              <span className="text-[9px] text-red-400 font-extrabold block">지정 벌칙</span>
              <p className="text-xs font-bold text-white mt-0.5">{winner}</p>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-400">벌칙 리스트 편제</label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={newOption}
                onChange={(e) => setNewOption(e.target.value)}
                placeholder="벌칙 항목 적기"
                onKeyDown={(e) => e.key === 'Enter' && addOption()}
                className="flex-1 bg-neutral-900 border border-stone-800 rounded-xl px-3 py-1.5 text-xs text-stone-200 outline-none"
              />
              <button
                onClick={addOption}
                className="px-3 py-1.5 bg-stone-800 hover:bg-stone-750 text-amber-400 font-bold text-xs rounded-xl"
              >
                추가
              </button>
            </div>
          </div>

          <div className="max-h-[140px] overflow-y-auto bg-black p-2.5 rounded-xl border border-stone-800 space-y-1">
            {options.map((opt, idx) => (
              <div key={idx} className="flex justify-between items-center bg-neutral-900/60 p-1.5 rounded-lg text-[11px]">
                <span className="text-stone-300 truncate pr-2" style={{ color: colors[idx % colors.length] }}>
                  ■ {opt}
                </span>
                <button
                  onClick={() => removeOption(idx)}
                  className="text-stone-500 hover:text-red-400 font-black text-xs px-1"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}