import React, { useState, useEffect, useRef } from 'react';

// ==========================================
// MOCK DATA: Menu, Games, Recommendations, and Pricing
// ==========================================

const MENU_ITEMS = [
  { id: 'm1', name: '아메리카노', category: 'coffee', price: 4000, desc: '엄선된 원두로 내린 깊고 진한 기본 커피', isPopular: true, options: ['HOT', 'ICE'], imageText: '아메리카노 이미지' },
  { id: 'm2', name: '바닐라 라떼', category: 'coffee', price: 4800, desc: '달콤한 천연 바닐라 빈 시럽과 부드러운 우유의 만남', isPopular: false, options: ['HOT', 'ICE'], imageText: '바닐라 라떼 이미지' },
  { id: 'm3', name: '리얼 딸기 라떼', category: 'beverage', price: 5500, desc: '생딸기 과육이 듬뿍 들어가 상큼 달콤한 라떼', isPopular: true, options: ['ONLY ICE'], imageText: '딸기 라떼 이미지' },
  { id: 'm4', name: '청포도 에이드', category: 'beverage', price: 5200, desc: '톡 쏘는 탄산과 청량한 청포도의 시원한 조화', isPopular: false, options: ['ONLY ICE'], imageText: '청포도 에이드 이미지' },
  { id: 'm5', name: '갈릭 버터 감자튀김', category: 'snack', price: 6500, desc: '바삭한 감자튀김 위에 수제 갈릭 버터 소스가 아낌없이!', isPopular: true, options: ['기본', '시즈닝 추가 (+500원)'], imageText: '감자튀김 이미지' },
  { id: 'm6', name: '스위트 카라멜 팝콘', category: 'snack', price: 5000, desc: '영화관보다 맛있는 끝없이 들어가는 시그니처 단짠 팝콘', isPopular: false, options: ['기본', '라지 사이즈 (+1500원)'], imageText: '팝콘 이미지' },
  { id: 'm7', name: '마라 떡볶이 세트', category: 'snack', price: 8500, desc: '매콤 얼얼한 마라 소스 떡볶이와 바삭한 튀김만두의 찰떡 궁합', isPopular: true, options: ['보통맛', '매운맛'], imageText: '떡볶이 세트 이미지' },
  { id: 'm8', name: '2인 시그니처 세트', category: 'set', price: 14500, desc: '아메리카노 2잔 + 갈릭 감자튀김 + 미니 팝콘 세트 할인!', isPopular: true, options: ['음료 변경 가능'], imageText: '시그니처 세트 이미지' }
];

const BOARD_GAMES = [
  { id: 'g1', name: '루미큐브 (Rummikub)', players: [2, 3, 4], time: 'medium', type: 'strategy', difficulty: '쉬움', desc: '숫자 조합을 맞추며 머리를 쓰는 전 세계 베스트셀러 타일 게임.', tips: '처음 등록할 때는 숫자 합이 반드시 30 이상이어야 해요!', imageText: '루미큐브 이미지 공간' },
  { id: 'g2', name: '꼬치의 달인', players: [2, 3, 4], time: 'short', type: 'party', difficulty: '매우 쉬움', desc: '주문서 카드에 적힌 꼬치를 누구보다 빠르게 꽂아 완성하는 초스피드 파티 게임.', tips: '치즈나 베이컨은 말아서 끼워야 하니 손가락 순발력이 필수!', imageText: '꼬치의 달인 이미지 공간' },
  { id: 'g3', name: '스플렌더 (Splendor)', players: [2, 3, 4], time: 'medium', type: 'strategy', difficulty: '보통', desc: '보석 토큰을 모아 광산과 카드를 구매해 15점을 먼저 달성하는 셋 컬렉션 게임.', tips: '귀족 카드의 조건을 미리 파악하고 효율적인 테크를 타는 게 이기는 지름길!', imageText: '스플렌더 이미지 공간' },
  { id: 'g4', name: '할리갈리 (Halli Galli)', players: [2, 3, 4, 5, 6], time: 'short', type: 'party', difficulty: '매우 쉬움', desc: '과일 개수의 합이 정확히 5개가 되는 순간, 가장 빠르게 종을 치는 국민 게임.', tips: '카드를 뒤집을 때는 나보다 상대방이 먼저 보이게 바깥쪽으로 뒤집으세요!', imageText: '할리갈리 이미지 공간' },
  { id: 'g5', name: '코드네임 (Codenames)', players: [2, 3, 4, 5, 6, 7, 8], time: 'medium', type: 'bluffing', difficulty: '보통', desc: '팀장의 단 한 단어 힌트를 듣고 아군의 스파이 단어들을 찾아내는 기발한 단어 연상 게임.', tips: '상대방 스파이나 암살자 단어를 연상시키지 않도록 주의 깊은 힌트가 중요합니다.', imageText: '코드네임 이미지 공간' },
  { id: 'g6', name: '뱅! (BANG!)', players: [4, 5, 6, 7], time: 'long', type: 'bluffing', difficulty: '보통', desc: '서부 무법지대에서 보안관, 부관, 무법자, 배신자가 서로 정체를 숨기며 벌이는 총격전.', tips: '자신의 직업에 맞는 연기가 필수! 무법자는 초반에 보안관을 공격해야 승산이 있어요.', imageText: '뱅! 이미지 공간' }
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
    imageText: '히트 이미지 공간'
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
    imageText: '아크 노바 이미지 공간'
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
    imageText: '도르프 로만틱 이미지 공간'
  }
];

const PRICING_PLANS = [
  { id: 'p1', title: '기본 1시간 이용권', price: '3,000원', details: '1인 기준 (10분당 500원 추가)', note: '초등생 이하 평일 2,400원', tag: '표준 요금', imageText: '1시간 이용권 이미지' },
  { id: 'p2', title: '평일 무제한 정액권', price: '10,000원', details: '평일 온종일 무제한 플레이', note: '공휴일 및 주말 사용 불가', tag: '가성비 최고', imageText: '무제한 정액권 이미지' },
  { id: 'p3', title: '3시간 + 음료 패키지', price: '11,000원', details: '3시간 이용권 + 4,000원 음료 택1', note: '음료 차액 지불 시 변경 가능', tag: '추천 세트', imageText: '3시간 패키지 이미지' },
  { id: 'p4', title: '심야 할인 프리패스', price: '7,000원', details: '오후 9시 이후 ~ 마감 시까지', note: '밤샘 게이머를 위한 특별가', tag: '야간 전용', imageText: '심야 프리패스 이미지' }
];

// ==========================================
// MAIN COMPONENT
// ==========================================

export default function App() {
  const [activeTab, setActiveTab] = useState('welcome'); // Starts exactly on 'welcome'
  const [cart, setCart] = useState([]);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  // Recommender States
  const [recPlayers, setRecPlayers] = useState(4);
  const [recTime, setRecTime] = useState('all'); // 'all' | 'short' | 'medium' | 'long'
  const [recType, setRecType] = useState('all'); // 'all' | 'party' | 'strategy' | 'bluffing' | 'cooperative'
  const [recommendedGames, setRecommendedGames] = useState([]);

  // Toast State
  const [toastMessage, setToastMessage] = useState('');

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Run live recommendation filtration
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

  // Add to cart helper
  const addToCart = (item, option) => {
    const cartItemId = `${item.id}-${option}`;
    const existing = cart.find(i => i.cartItemId === cartItemId);
    if (existing) {
      setCart(cart.map(i => i.cartItemId === cartItemId ? { ...i, qty: i.qty + 1 } : i));
    } else {
      setCart([...cart, { ...item, cartItemId, selectedOption: option, qty: 1 }]);
    }
    triggerToast(`🛒 ${item.name} (${option})을 장바구니에 담았습니다.`);
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

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setOrderSuccess(true);
    setTimeout(() => {
      setOrderSuccess(false);
      setShowOrderModal(false);
      clearCart();
    }, 3000);
  };

  const totalCartPrice = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  return (
    <div className="min-h-screen bg-black text-stone-100 font-sans flex flex-col selection:bg-amber-500 selection:text-black pb-20 md:pb-0">
      
      {/* Global CSS Style for Fade In Animation */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-extrabold px-6 py-3 rounded-full shadow-2xl flex items-center space-x-2 border-2 border-amber-300 animate-bounce">
          <span>✨</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header: Visible ONLY inside inner tabs, Hidden on welcome screen */}
      {activeTab !== 'welcome' && (
        <header className="sticky top-0 z-40 bg-black/95 backdrop-blur-md border-b border-amber-500/30 px-4 py-4 md:px-8 flex justify-between items-center animate-fade-in">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setActiveTab('welcome')}
              className="bg-neutral-900 hover:bg-neutral-800 text-amber-400 font-bold px-3.5 py-2 rounded-xl text-xs border border-amber-500/30 flex items-center space-x-1.5 transition-all active:scale-95"
            >
              <span>◀</span>
              <span>홈으로</span>
            </button>
            <div className="hidden sm:block h-6 w-px bg-stone-800" />
            <div className="hidden sm:block">
              <h1 className="text-md font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-550">
                {activeTab === 'pricing' && '요금 안내'}
                {activeTab === 'menu' && '음료 & 간식 메뉴판'}
                {activeTab === 'recommender' && '보드게임 맞춤 추천'}
                {activeTab === 'newArrivals' && '매장 신작게임 소개'}
                {activeTab === 'helper' && '게임 만능 헬퍼'}
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-xs font-bold text-amber-500/70 uppercase tracking-widest bg-neutral-950 px-3 py-1.5 rounded-lg border border-amber-500/10">Table 6</span>
            
            {/* Cart Trigger */}
            <button
              onClick={() => setShowOrderModal(true)}
              className="relative bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 active:scale-95 transition text-black font-extrabold px-4 py-2 rounded-xl flex items-center space-x-2 shadow-lg shadow-amber-500/20 text-xs"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>주문내역</span>
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white font-extrabold text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-black animate-pulse">
                  {cart.reduce((sum, item) => sum + item.qty, 0)}
                </span>
              )}
            </button>
          </div>
        </header>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 flex flex-col justify-center">
        
        {/* TAB 0: 첫 환영 화면 (Only button matrix) */}
        {activeTab === 'welcome' && (
          <WelcomeLanding setTab={setActiveTab} />
        )}

        {/* TAB 1: 요금 안내 코너 */}
        {activeTab === 'pricing' && (
          <PricingSection />
        )}
        
        {/* TAB 2: 메뉴판 코너 */}
        {activeTab === 'menu' && (
          <MenuSection addToCart={addToCart} />
        )}

        {/* TAB 3: 맞춤 게임 추천 코너 (Simplified 3 options only) */}
        {activeTab === 'recommender' && (
          <RecommenderSection
            recPlayers={recPlayers}
            setRecPlayers={setRecPlayers}
            recTime={recTime}
            setRecTime={setRecTime}
            recType={recType}
            setRecType={setRecType}
            recommendedGames={recommendedGames}
          />
        )}

        {/* TAB 4: 신규 입고 게임 소개코너 */}
        {activeTab === 'newArrivals' && (
          <NewArrivalsSection />
        )}

        {/* TAB 5: 게임 헬퍼 코너 */}
        {activeTab === 'helper' && (
          <HelperSection />
        )}

      </main>

      {/* Bottom Mobile Navigation: Active only when NOT on welcome screen */}
      {activeTab !== 'welcome' && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-neutral-950/95 border-t border-amber-500/20 backdrop-blur-lg flex justify-around py-2 px-1">
          <MobileTabButton active={activeTab === 'welcome'} onClick={() => setActiveTab('welcome')} label="첫화면" icon="🏠" />
          <MobileTabButton active={activeTab === 'pricing'} onClick={() => setActiveTab('pricing')} label="요금안내" icon="💰" />
          <MobileTabButton active={activeTab === 'menu'} onClick={() => setActiveTab('menu')} label="메뉴" icon="☕" />
          <MobileTabButton active={activeTab === 'recommender'} onClick={() => setActiveTab('recommender')} label="게임추천" icon="🎯" />
          <MobileTabButton active={activeTab === 'helper'} onClick={() => setActiveTab('helper')} label="게임헬퍼" icon="🛠️" />
        </div>
      )}

      {/* Cart & Checkout Modal */}
      {showOrderModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border-2 border-amber-500/50 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-amber-500/20 flex justify-between items-center bg-black">
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <span className="text-amber-400">🛒 장바구니 및 주문내역</span>
                <span className="text-[10px] bg-neutral-850 text-amber-500 border border-amber-500/30 px-2 py-0.5 rounded">테이블 6</span>
              </h3>
              <button
                onClick={() => setShowOrderModal(false)}
                className="text-stone-400 hover:text-white p-1 rounded-lg hover:bg-neutral-800"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              {orderSuccess ? (
                <div className="py-8 text-center flex flex-col items-center justify-center space-y-4">
                  <div className="w-16 h-16 bg-amber-500/20 text-emerald-400 border border-emerald-500 rounded-full flex items-center justify-center text-4xl animate-bounce">
                    ✓
                  </div>
                  <h4 className="text-xl font-bold text-white">주문이 성공적으로 전송되었습니다!</h4>
                  <p className="text-stone-400 text-sm">준비되는 대로 테이블로 바로 가져다 드리겠습니다.</p>
                </div>
              ) : cart.length === 0 ? (
                <div className="py-12 text-center text-stone-500">
                  <span className="text-5xl block mb-4">🛒</span>
                  장바구니가 비어 있습니다.<br />메뉴판에서 맛있는 간식을 골라보세요!
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div key={item.cartItemId} className="flex items-center justify-between p-3 bg-black/60 rounded-xl border border-stone-800">
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
                          className="w-6 h-6 flex items-center justify-center rounded bg-stone-800 text-stone-300 hover:bg-stone-700 active:scale-90 font-bold"
                        >
                          -
                        </button>
                        <span className="text-sm font-semibold w-4 text-center text-amber-400">{item.qty}</span>
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
                      <span>총 주문 수량</span>
                      <span>{cart.reduce((sum, item) => sum + item.qty, 0)}개</span>
                    </div>
                    <div className="flex justify-between text-base font-bold text-white pt-1">
                      <span>결제 및 주문 총액</span>
                      <span className="text-amber-400 text-lg">{totalCartPrice.toLocaleString()}원</span>
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
                  className="px-4 py-3 bg-neutral-900 hover:bg-stone-800 text-stone-400 hover:text-white rounded-xl transition text-sm font-semibold border border-stone-800"
                >
                  비우기
                </button>
                <button
                  onClick={handleCheckout}
                  className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black font-extrabold rounded-xl transition text-sm shadow-lg shadow-amber-500/20 active:scale-[0.98]"
                >
                  카운터로 주문 보내기
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

// ==========================================
// MOBILE TABS INNER COMPONENT
// ==========================================
function MobileTabButton({ active, onClick, label, icon }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
        active ? 'text-amber-400 scale-105' : 'text-stone-500'
      }`}
    >
      <span className="text-lg mb-0.5">{icon}</span>
      <span className="text-[9px] font-bold tracking-tight">{label}</span>
    </button>
  );
}

// ==========================================
// LANDING WELCOME COMPONENT
// ==========================================
function WelcomeLanding({ setTab }) {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 flex flex-col items-center justify-center space-y-12 text-center animate-fade-in my-auto">
      
      {/* Welcome Slogan */}
      <div className="space-y-4">
        <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs font-black tracking-widest uppercase animate-pulse">
          <span>✨</span>
          <span>Premium Board Game Cafe Solution</span>
          <span>✨</span>
        </div>
        <h2 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tight">
          저희 매장을 찾아주셔서 감사합니다
        </h2>
        <p className="text-stone-400 text-sm md:text-lg max-w-xl mx-auto leading-relaxed">
          스마트 테이블 오더 및 룰 도우미 <strong className="text-amber-400 font-extrabold">"테이블 마스터"</strong>에 오신 것을 환영합니다. 원하시는 아이콘을 눌러 최상의 서비스를 시작해보세요!
        </p>
      </div>

      {/* 5 Navigation Buttons with Grid */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-5 pt-4">
        <LandingMenuButton
          onClick={() => setTab('pricing')}
          icon="💰"
          title="요금 안내"
          desc="시간 및 알뜰 패키지"
        />
        <LandingMenuButton
          onClick={() => setTab('menu')}
          icon="☕"
          title="음료 & 간식"
          desc="맛있는 오더 서비스"
        />
        <LandingMenuButton
          onClick={() => setTab('recommender')}
          icon="🎯"
          title="보드게임 추천"
          desc="취향 저격 탐색 엔진"
        />
        <LandingMenuButton
          onClick={() => setTab('newArrivals')}
          icon="🔥"
          title="매장 신작게임"
          desc="이번 주 입고 라인업"
        />
        <LandingMenuButton
          onClick={() => setTab('helper')}
          icon="🛠️"
          title="게임 만능 헬퍼"
          desc="Chwazi 픽커 & 타이머"
        />
      </div>

      {/* Decorative Brand Accent */}
      <div className="pt-10 border-t border-neutral-900/60 w-full flex justify-between items-center text-xs text-stone-600">
        <span>Table Master v4.0 • Table 6</span>
        <span>스마트 멀티터치 감지 시스템 연동</span>
      </div>
    </div>
  );
}

function LandingMenuButton({ onClick, icon, title, desc }) {
  return (
    <button
      onClick={onClick}
      className="group relative flex flex-col items-center justify-center p-6 bg-gradient-to-b from-neutral-950 to-neutral-900 hover:from-neutral-900 border border-amber-500/25 hover:border-amber-400 rounded-3xl text-center transition-all duration-350 hover:shadow-2xl hover:shadow-amber-500/10 hover:-translate-y-1 active:scale-95"
    >
      <div className="text-4xl mb-3 group-hover:scale-115 transition-transform duration-300">{icon}</div>
      <h3 className="text-sm font-black text-white group-hover:text-amber-400 transition-colors">{title}</h3>
      <p className="text-[11px] text-stone-500 mt-1.5">{desc}</p>
      
      {/* Hover Light Stripe */}
      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-amber-500 to-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity rounded-b-3xl" />
    </button>
  );
}

// ==========================================
// SUB-SECTIONS COMPONENTS
// ==========================================

// ------------------------------------------
// 1. PRICING SECTION
// ------------------------------------------
function PricingSection() {
  return (
    <div className="space-y-8 animate-fade-in py-4">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-500">💰 매장 이용 요금 안내</h2>
        <p className="text-xs text-stone-400">합리적인 가격으로 온전한 즐거움을 누릴 수 있는 스탠다드 요금제입니다.</p>
      </div>

      {/* Plan Grid with Image Slots */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {PRICING_PLANS.map((plan) => (
          <div key={plan.id} className="relative bg-neutral-950 border-2 border-amber-500/20 rounded-2xl overflow-hidden flex flex-col justify-between group hover:border-amber-400 transition-all duration-300 shadow-xl">
            
            {/* Image Placeholder */}
            <div className="h-32 bg-neutral-900 border-b border-amber-500/25 relative flex items-center justify-center text-stone-500 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-950/20 to-black opacity-60" />
              <div className="z-10 text-center px-4">
                <span className="text-2xl block mb-1">📋</span>
                <span className="text-[10px] font-bold text-amber-500/70 uppercase tracking-widest">{plan.imageText}</span>
              </div>
            </div>

            {/* Content info */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <span className="inline-block text-[9px] font-extrabold bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full mb-2">
                  {plan.tag}
                </span>
                <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors">
                  {plan.title}
                </h3>
                <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                  {plan.details}
                </p>
              </div>

              <div className="pt-3 border-t border-stone-900 flex justify-between items-baseline">
                <span className="text-[10px] text-stone-500">{plan.note}</span>
                <span className="text-lg font-black text-amber-400">{plan.price}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ------------------------------------------
// 2. MENU SECTION
// ------------------------------------------
function MenuSection({ addToCart }) {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: '전체메뉴', icon: '🍽️' },
    { id: 'coffee', name: '커피', icon: '☕' },
    { id: 'beverage', name: '음료 & 에이드', icon: '🍹' },
    { id: 'snack', name: '스낵 & 디저트', icon: '🍟' },
    { id: 'set', name: '알뜰 세트', icon: '🏷️' }
  ];

  const filteredMenu = selectedCategory === 'all'
    ? MENU_ITEMS
    : MENU_ITEMS.filter(item => item.category === selectedCategory);

  return (
    <div className="space-y-6 animate-fade-in py-4">
      
      {/* Category Slider */}
      <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-full text-xs md:text-sm font-bold transition-all whitespace-nowrap border ${
              selectedCategory === cat.id
                ? 'bg-gradient-to-r from-amber-500 to-yellow-500 border-amber-400 text-black shadow-lg shadow-amber-500/10'
                : 'bg-neutral-950 border-stone-850 text-stone-400 hover:text-stone-200'
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.name}</span>
          </button>
        ))}
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredMenu.map(item => (
          <MenuItemCard key={item.id} item={item} onAdd={addToCart} />
        ))}
      </div>

      {/* Helpful banner */}
      <div className="bg-gradient-to-r from-neutral-950 to-black border border-amber-500/20 rounded-2xl p-6 mt-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-4 text-center md:text-left">
          <span className="text-4xl">🍿</span>
          <div>
            <h4 className="text-base font-bold text-white">보드게임하면서 입이 심심할 틈이 없게!</h4>
            <p className="text-xs text-stone-400 mt-1">우리 매장은 주문 즉시 가열하고 조리하는 수제 스낵 맛집이랍니다. 음료 리필(아메리카노 등)은 카운터에 문의해 주세요.</p>
          </div>
        </div>
        <div className="bg-amber-400/10 border border-amber-400/20 text-amber-400 font-extrabold text-xs px-3 py-1.5 rounded-lg">
          ※ 외부 음식도 환영입니다. 마음껏 즐기세요!
        </div>
      </div>

    </div>
  );
}

function MenuItemCard({ item, onAdd }) {
  const [selectedOpt, setSelectedOpt] = useState(item.options[0]);

  return (
    <div className="bg-neutral-950/60 hover:bg-black border-2 border-amber-500/15 hover:border-amber-400 rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-300 group shadow-md hover:shadow-xl">
      
      {/* Menu Image Space */}
      <div className="h-36 bg-neutral-900 border-b border-amber-500/15 relative flex items-center justify-center text-stone-500 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 to-transparent" />
        <div className="z-10 text-center px-4">
          <span className="text-2xl block mb-1">🍽️</span>
          <span className="text-[10px] font-bold text-amber-500/70 uppercase tracking-widest">{item.imageText}</span>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex justify-between items-start gap-2 mb-2">
            {item.isPopular ? (
              <span className="bg-gradient-to-r from-red-500 to-amber-500 text-black font-extrabold text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                Popular
              </span>
            ) : (
              <span />
            )}
            <span className="text-xs text-amber-400 font-bold">강추 ★</span>
          </div>
          
          <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors duration-200">
            {item.name}
          </h3>
          <p className="text-xs text-stone-400 mt-1.5 leading-relaxed line-clamp-2">
            {item.desc}
          </p>
        </div>

        <div className="mt-2 space-y-3">
          {/* Price */}
          <div className="flex justify-between items-baseline">
            <span className="text-[10px] text-stone-500">가격</span>
            <span className="text-lg font-black text-amber-400">{item.price.toLocaleString()}원</span>
          </div>

          {/* Options Selector */}
          {item.options.length > 0 && (
            <div className="flex flex-wrap gap-1 bg-neutral-900 p-1 rounded-lg border border-stone-800">
              {item.options.map(opt => (
                <button
                  key={opt}
                  onClick={() => setSelectedOpt(opt)}
                  className={`flex-1 text-[10px] font-bold py-1 px-2 rounded-md transition-all ${
                    selectedOpt === opt
                      ? 'bg-amber-500 text-black shadow-sm'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}

          {/* Action Button */}
          <button
            onClick={() => onAdd(item, selectedOpt)}
            className="w-full bg-neutral-900 group-hover:bg-gradient-to-r group-hover:from-amber-500 group-hover:to-yellow-500 text-stone-300 group-hover:text-black transition-all font-black py-2.5 px-3 rounded-xl text-xs flex items-center justify-center space-x-2 border border-stone-800 group-hover:border-amber-400"
          >
            <span>담기</span>
            <span className="text-[10px] opacity-75">({selectedOpt})</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ------------------------------------------
// 3. RECOMMENDER SECTION (SIMPLIFIED ONLY 3 FILTERS)
// ------------------------------------------
function RecommenderSection({
  recPlayers,
  setRecPlayers,
  recTime,
  setRecTime,
  recType,
  setRecType,
  recommendedGames
}) {

  const gameTypes = [
    { id: 'all', name: '모든 장르' },
    { id: 'party', name: '빵 터지는 파티 게임' },
    { id: 'strategy', name: '머리 싸움 전략/두뇌' },
    { id: 'bluffing', name: '정체 숨기기 마피아/블러핑' },
    { id: 'cooperative', name: '다 함께 협력/팀워크' }
  ];

  return (
    <div className="space-y-6 animate-fade-in py-4">
      
      {/* Recommender Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-500">🎯 맞춤형 보드게임 탐색기</h2>
        <p className="text-xs text-stone-400">인원과 선호 스타일에 맞는 최고의 게임을 즉각적으로 추천해 드릴게요!</p>
      </div>

      {/* Selection Panel (Exactly 3 control options only) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 bg-neutral-950 border border-amber-500/25 p-6 rounded-3xl shadow-lg">
        
        {/* 1. Player Count Selector */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-amber-400 block">👥 1. 인원수 선택</label>
          <div className="flex items-center space-x-2 bg-neutral-900 p-2 rounded-xl border border-stone-800">
            <button
              onClick={() => setRecPlayers(Math.max(2, recPlayers - 1))}
              className="w-10 h-10 flex items-center justify-center bg-stone-800 hover:bg-stone-700 active:scale-95 rounded-lg text-lg font-bold"
            >
              -
            </button>
            <span className="flex-1 text-center font-bold text-lg text-white">{recPlayers} 명</span>
            <button
              onClick={() => setRecPlayers(Math.min(10, recPlayers + 1))}
              className="w-10 h-10 flex items-center justify-center bg-stone-800 hover:bg-stone-700 active:scale-95 rounded-lg text-lg font-bold"
            >
              +
            </button>
          </div>
        </div>

        {/* 2. Play Time Selection Buttons */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-amber-400 block">⏱️ 2. 플레이 타임 선호도</label>
          <div className="grid grid-cols-4 gap-1 bg-neutral-900 p-1 rounded-xl border border-stone-800 h-[56px] items-center">
            {['all', 'short', 'medium', 'long'].map((time) => {
              const labelMap = { all: '무관', short: '짧게', medium: '적당히', long: '길게' };
              return (
                <button
                  key={time}
                  onClick={() => setRecTime(time)}
                  className={`text-xs font-bold h-10 rounded-lg transition-all ${
                    recTime === time
                      ? 'bg-amber-500 text-black shadow-md'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  {labelMap[time]}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Game Type Selector */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-amber-400 block">🎨 3. 선호하는 게임 유형</label>
          <select
            value={recType}
            onChange={(e) => setRecType(e.target.value)}
            className="w-full h-[56px] bg-neutral-900 text-stone-200 text-xs md:text-sm font-bold px-4 py-2 rounded-xl border border-stone-800 outline-none focus:border-amber-500"
          >
            {gameTypes.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>

      </div>

      {/* Live filtered Recommendation Results */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-bold text-stone-400">
            실시간 필터링 결과: 총 <span className="text-amber-400 font-extrabold">{recommendedGames.length}개</span> 탐색 완료
          </h3>
        </div>

        {recommendedGames.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {recommendedGames.map(game => (
              <div key={game.id} className="bg-neutral-950 border-2 border-amber-500/15 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-amber-400 transition-all duration-300">
                
                {/* Visual Image Area */}
                <div className="h-32 bg-stone-900 border-b border-amber-500/15 relative flex items-center justify-center text-stone-500 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-black/85 to-transparent" />
                  <div className="z-10 text-center px-4">
                    <span className="text-2xl block mb-1">📦</span>
                    <span className="text-[10px] font-bold text-amber-500/60 uppercase tracking-widest">{game.imageText}</span>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="bg-neutral-900 text-amber-400 text-[9px] font-bold px-2 py-1 rounded-md border border-amber-500/20">
                        ⏱️ {game.time === 'short' ? '30분 미만' : game.time === 'medium' ? '30~60분' : '60분 이상'}
                      </span>
                      <span className={`text-[9px] font-bold px-2 py-1 rounded-md ${
                        game.difficulty === '매우 쉬움' || game.difficulty === '쉬움'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : game.difficulty === '보통'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}>
                        난이도: {game.difficulty}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-white mt-1">{game.name}</h4>
                    <p className="text-xs text-stone-400 mt-2 leading-relaxed">{game.desc}</p>
                  </div>

                  <div className="pt-3 border-t border-stone-900 bg-black/40 p-3 rounded-xl space-y-1">
                    <span className="text-[10px] font-black text-amber-400 block uppercase tracking-wider">💡 매니아 추천팁</span>
                    <p className="text-xs text-stone-300 leading-relaxed">{game.tips}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-neutral-950 border border-stone-800 rounded-3xl">
            <span className="text-5xl block mb-3">🔍</span>
            <p className="text-sm text-stone-400">조건에 딱 맞는 게임이 존재하지 않네요!</p>
            <p className="text-xs text-stone-500 mt-1">간단히 조건(인원수/장르)을 변경하여 실시간으로 확인해 보세요.</p>
          </div>
        )}
      </div>

    </div>
  );
}

// ------------------------------------------
// 4. NEW ARRIVALS SECTION
// ------------------------------------------
function NewArrivalsSection() {
  return (
    <div className="space-y-6 animate-fade-in py-4">
      <div className="text-center max-w-xl mx-auto space-y-2 mb-8">
        <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-500">🔥 매장 신작 소식 (NEW ARRIVALS)</h2>
        <p className="text-xs text-stone-400">이번 주 보드게임 카페에 새로 입고된 최정상급 인기 타이틀을 소개합니다!</p>
      </div>

      <div className="space-y-8">
        {NEW_GAMES.map((game) => (
          <div key={game.id} className="bg-gradient-to-br from-neutral-950 to-black border-2 border-amber-500/20 rounded-3xl p-6 md:p-8 flex flex-col lg:flex-row gap-6 items-center relative overflow-hidden shadow-2xl">
            
            {/* Embedded Image Space for each game on the left */}
            <div className="w-full lg:w-[260px] h-[190px] bg-stone-900 border border-amber-500/20 rounded-2xl flex-shrink-0 relative flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 to-transparent" />
              <div className="z-10 text-center px-4">
                <span className="text-3xl block mb-2">🎁</span>
                <span className="text-[10px] font-extrabold text-amber-500/70 tracking-widest uppercase">{game.imageText}</span>
              </div>
            </div>

            {/* Middle Badges & Title Block */}
            <div className="flex-1 space-y-4">
              <div className="flex items-center space-x-2 flex-wrap gap-y-2">
                <span className="bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-black text-[10px] md:text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                  {game.badge}
                </span>
                <span className="bg-stone-900 text-stone-400 text-xs px-2.5 py-1 rounded-full border border-stone-800">
                  👥 {game.players}
                </span>
                <span className="bg-stone-900 text-stone-400 text-xs px-2.5 py-1 rounded-full border border-stone-800">
                  ⏱️ {game.time}
                </span>
                <span className="bg-stone-900 text-stone-400 text-xs px-2.5 py-1 rounded-full border border-stone-800">
                  🎲 난이도: {game.difficulty}
                </span>
              </div>

              <h3 className="text-xl md:text-2xl font-black text-white">{game.name}</h3>
              <p className="text-xs md:text-sm text-stone-300 leading-relaxed max-w-2xl">{game.desc}</p>
              
              <div className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-2xl">
                <h5 className="text-xs font-bold text-amber-400 flex items-center space-x-1">
                  <span>⭐️</span>
                  <span>사장님 추천 코멘트</span>
                </h5>
                <p className="text-xs text-stone-300 mt-1 leading-relaxed">{game.reason}</p>
              </div>
            </div>

            {/* Right Quick Rules Block */}
            <div className="w-full lg:w-[320px] bg-neutral-900 border border-stone-800 rounded-2xl p-5 space-y-3">
              <h4 className="text-xs font-bold text-white tracking-wide uppercase border-b border-stone-800 pb-2">
                🎮 핵심 플레이 퀵 룰
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
// 5. HELPER SECTION (TOOLSET)
// ------------------------------------------
function HelperSection() {
  const [activeTool, setActiveTool] = useState('chwazi'); // 'chwazi' | 'timer' | 'roulette'

  return (
    <div className="space-y-6 animate-fade-in py-4">
      
      {/* Sub-Header */}
      <div className="text-center max-w-xl mx-auto space-y-2 mb-4">
        <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-500">🛠️ 보드게임 만능 헬퍼 세트</h2>
        <p className="text-xs text-stone-400">Chwazi 터치 픽커, 디지털 타이머, 룰렛 등을 활용해 보세요.</p>
      </div>

      {/* Selector Grid */}
      <div className="grid grid-cols-3 gap-2 bg-neutral-950 p-1.5 rounded-2xl border border-stone-800">
        <ToolTabButton active={activeTool === 'chwazi'} onClick={() => setActiveTool('chwazi')} label="츄아지 (Chwazi) 터치 픽커" icon="🖐️" />
        <ToolTabButton active={activeTool === 'timer'} onClick={() => setActiveTool('timer')} label="모래시계 타이머" icon="⏳" />
        <ToolTabButton active={activeTool === 'roulette'} onClick={() => setActiveTool('roulette')} label="벌칙 돌림판" icon="🎡" />
      </div>

      {/* Tool Content Area */}
      <div className="bg-neutral-950 border border-stone-800 rounded-3xl p-6 min-h-[450px] flex flex-col justify-center">
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
      className={`py-3 px-2 rounded-xl text-xs md:text-sm font-bold flex flex-col items-center justify-center space-y-1 transition-all ${
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

// -------------------------------------
// CHWAZI TOOL COMPONENT (Chwazi mechanism with multi-touch support & Desktop mock)
// -------------------------------------
function ChwaziTool() {
  const [chwaziMode, setChwaziMode] = useState('solo'); // 'solo' (선 정하기) | 'group' (팀 메이커)
  const [groupCount, setGroupCount] = useState(2); // Splitting into how many groups
  
  // Custom tracking of active points (to support both multi-touch screens and mock desktop clicks)
  const [fingers, setFingers] = useState([]); // { id, x, y, color, teamIndex }
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionResult, setSelectionResult] = useState(null); // 'solo' -> single finger object, 'group' -> fingers with team tags
  const [chwaziStatusText, setChwaziStatusText] = useState('여기에 손가락을 올려놓거나 마우스로 임의 지점들을 터치/클릭하세요.');

  const padRef = useRef(null);

  const colors = [
    'rgba(239, 68, 68, 0.85)',   // Red
    'rgba(59, 130, 246, 0.85)',  // Blue
    'rgba(16, 185, 129, 0.85)',  // Green
    'rgba(245, 158, 11, 0.85)',  // Amber
    'rgba(139, 92, 246, 0.85)',  // Purple
    'rgba(236, 72, 153, 0.85)',  // Pink
    'rgba(20, 184, 166, 0.85)',  // Teal
    'rgba(234, 179, 8, 0.85)',   // Yellow
  ];

  // Map team index to distinct team colors
  const teamColors = [
    { name: '1팀 (블루)', bg: 'rgba(59, 130, 246, 0.95)', border: '#3b82f6' },
    { name: '2팀 (오렌지)', bg: 'rgba(249, 115, 22, 0.95)', border: '#f97316' },
    { name: '3팀 (그린)', bg: 'rgba(34, 197, 94, 0.95)', border: '#22c55e' },
    { name: '4팀 (퍼플)', bg: 'rgba(168, 85, 247, 0.95)', border: '#a855f7' }
  ];

  // Helper: Find touch position relative to the pad container
  const getCoordinates = (clientX, clientY) => {
    if (!padRef.current) return { x: 0, y: 0 };
    const rect = padRef.current.getBoundingClientRect();
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  // MULTI-TOUCH HANDLERS (for iPad, Tablet, Phones)
  const handleTouchStart = (e) => {
    if (isSelecting) return;
    e.preventDefault();
    const updatedFingers = [...fingers];

    // Read all active touches
    for (let i = 0; i < e.targetTouches.length; i++) {
      const touch = e.targetTouches[i];
      const { x, y } = getCoordinates(touch.clientX, touch.clientY);
      
      // If pointer is not already added
      if (!updatedFingers.some(f => f.id === touch.identifier)) {
        updatedFingers.push({
          id: touch.identifier,
          x,
          y,
          color: colors[updatedFingers.length % colors.length],
          teamIndex: null
        });
      }
    }
    setFingers(updatedFingers);
    setSelectionResult(null);
    setChwaziStatusText(`${updatedFingers.length}개의 손가락이 인식되었습니다. 준비되면 아래 '매칭 시작'을 누르세요!`);
  };

  const handleTouchMove = (e) => {
    if (isSelecting) return;
    e.preventDefault();
    const updatedFingers = fingers.map(finger => {
      // Find corresponding active touch point
      const activeTouch = Array.from(e.targetTouches).find(t => t.identifier === finger.id);
      if (activeTouch) {
        const { x, y } = getCoordinates(activeTouch.clientX, activeTouch.clientY);
        return { ...finger, x, y };
      }
      return finger;
    });
    setFingers(updatedFingers);
  };

  const handleTouchEnd = (e) => {
    if (isSelecting) return;
    e.preventDefault();
    // Filter and keep only fingers that are still touching
    const activeIds = Array.from(e.targetTouches).map(t => t.identifier);
    const updatedFingers = fingers.filter(f => activeIds.includes(f.id));
    setFingers(updatedFingers);
    if (updatedFingers.length === 0) {
      setChwaziStatusText('여기에 손가락을 올려놓거나 마우스로 임의 지점들을 터치/클릭하세요.');
    } else {
      setChwaziStatusText(`${updatedFingers.length}개의 손가락이 인식되었습니다.`);
    }
  };

  // MOUSE CLICK SIMULATION (Allows easy desktop PC usage/testing)
  const handlePadClick = (e) => {
    if (isSelecting) return;
    const { x, y } = getCoordinates(e.clientX, e.clientY);
    
    // Check if clicked close to an existing circle to delete it
    const clickRadius = 25;
    const existingIndex = fingers.findIndex(f => {
      const dist = Math.sqrt(Math.pow(f.x - x, 2) + Math.pow(f.y - y, 2));
      return dist < clickRadius;
    });

    if (existingIndex !== -1) {
      // Remove it
      const updated = fingers.filter((_, idx) => idx !== existingIndex);
      setFingers(updated);
      setSelectionResult(null);
      if (updated.length === 0) {
        setChwaziStatusText('여기에 손가락을 올려놓거나 마우스로 임의 지점들을 터치/클릭하세요.');
      } else {
        setChwaziStatusText(`가상 손가락: ${updated.length}개 배치됨.`);
      }
    } else {
      // Add new virtual finger
      if (fingers.length >= 8) {
        return;
      }
      const newId = Date.now() + Math.random();
      const updated = [
        ...fingers,
        {
          id: newId,
          x,
          y,
          color: colors[fingers.length % colors.length],
          teamIndex: null
        }
      ];
      setFingers(updated);
      setSelectionResult(null);
      setChwaziStatusText(`가상 손가락: ${updated.length}개 배치됨. 준비가 끝나면 매칭버튼을 누르세요.`);
    }
  };

  // Trigger Chwazi Matching Mechanics
  const triggerChwaziMatch = () => {
    if (fingers.length < 2) {
      return;
    }

    setIsSelecting(true);
    setChwaziStatusText('두구두구... 손가락 스캔 및 분석 중...');
    setSelectionResult(null);

    // Chwazi dramatic countdown animation timing (1.8 seconds)
    setTimeout(() => {
      if (chwaziMode === 'solo') {
        // Solo Selector Mode: Choose 1 random finger
        const luckyIdx = Math.floor(Math.random() * fingers.length);
        const selectedFinger = fingers[luckyIdx];
        setSelectionResult({ type: 'solo', winnerId: selectedFinger.id });
        setChwaziStatusText(`🎉 당첨자 선정 완료!`);
      } else {
        // Group Mode / Team Maker
        const shuffled = [...fingers].sort(() => Math.random() - 0.5);
        const assignedFingers = fingers.map(f => {
          const shuffleIdx = shuffled.findIndex(sh => sh.id === f.id);
          const assignedTeam = shuffleIdx % groupCount;
          return { ...f, teamIndex: assignedTeam };
        });
        setFingers(assignedFingers);
        setSelectionResult({ type: 'group' });
        setChwaziStatusText(`👥 밸런스 그룹 매치 완료!`);
      }
      setIsSelecting(false);
    }, 1800);
  };

  const resetChwazi = () => {
    setFingers([]);
    setSelectionResult(null);
    setIsSelecting(false);
    setChwaziStatusText('여기에 손가락을 올려놓거나 마우스로 임의 지점들을 터치/클릭하세요.');
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-6 py-2 w-full max-w-2xl mx-auto">
      
      {/* Selector Options */}
      <div className="flex justify-between items-center w-full bg-neutral-900 p-2.5 rounded-2xl border border-stone-850">
        <div className="flex space-x-1.5 flex-1">
          <button
            onClick={() => { setChwaziMode('solo'); resetChwazi(); }}
            className={`flex-1 py-2 text-xs font-black rounded-xl transition ${
              chwaziMode === 'solo' ? 'bg-amber-500 text-black' : 'text-stone-400 hover:text-white'
            }`}
          >
            ☝️ 츄아지 선 플레이어 (1인)
          </button>
          <button
            onClick={() => { setChwaziMode('group'); resetChwazi(); }}
            className={`flex-1 py-2 text-xs font-black rounded-xl transition ${
              chwaziMode === 'group' ? 'bg-amber-500 text-black' : 'text-stone-400 hover:text-white'
            }`}
          >
            👥 츄아지 팀 메이커 (그룹)
          </button>
        </div>

        {/* Group size selector if team mode is selected */}
        {chwaziMode === 'group' && (
          <div className="flex items-center space-x-1 ml-4 border-l border-stone-800 pl-4">
            <span className="text-[10px] font-bold text-stone-500">팀수</span>
            <select
              value={groupCount}
              onChange={(e) => { setGroupCount(Number(e.target.value)); setSelectionResult(null); }}
              className="bg-stone-900 border border-stone-800 rounded px-2 py-1 text-xs text-amber-400 font-bold outline-none"
            >
              <option value={2}>2개팀</option>
              <option value={3}>3개팀</option>
              <option value={4}>4개팀</option>
            </select>
          </div>
        )}
      </div>

      {/* Guide Box */}
      <div className="text-center bg-amber-500/10 border border-amber-500/20 px-4 py-3 rounded-2xl w-full">
        <p className="text-xs text-amber-400 leading-relaxed font-semibold">
          {chwaziStatusText}
        </p>
      </div>

      {/* CHWAZI INTERACTIVE PAD */}
      <div
        ref={padRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={handlePadClick}
        className="touch-none bg-neutral-950 relative w-full h-[320px] md:h-[400px] border-2 border-dashed border-amber-500/30 hover:border-amber-500/60 rounded-3xl overflow-hidden cursor-crosshair select-none flex items-center justify-center transition-all shadow-inner"
      >
        {fingers.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center text-stone-600 pointer-events-none">
            <span className="text-4xl md:text-5xl mb-4 opacity-50">🖐️</span>
            <p className="text-sm font-bold">CHWAZI TOUCH PAD</p>
            <p className="text-xs mt-1 max-w-sm">
              태블릿/모바일은 여러 손가락을 동시에 길게 대주세요.<br />
              데스크탑은 화면 곳곳을 클릭해 손가락들을 배치해 보세요! (클릭 시 토글 생성/제거)
            </p>
          </div>
        )}

        {/* Active Finger Circles rendering */}
        {fingers.map((finger) => {
          const isWinner = selectionResult?.type === 'solo' && selectionResult?.winnerId === finger.id;
          const isLoser = selectionResult?.type === 'solo' && selectionResult?.winnerId !== finger.id;
          
          let circleStyle = {
            left: `${finger.x}px`,
            top: `${finger.y}px`,
            transform: 'translate(-50%, -50%)',
          };

          // Render proper color circles depending on status
          let borderClass = 'border-4 border-white';
          let bgStyle = { backgroundColor: finger.color };
          let ringPulse = 'animate-ping opacity-75';

          if (isSelecting) {
            bgStyle = { backgroundColor: finger.color };
            ringPulse = 'animate-pulse scale-125 border-amber-400';
          } else if (isWinner) {
            // Flash Winner with glowing golden aura
            bgStyle = { backgroundColor: '#f59e0b' };
            borderClass = 'border-4 border-white shadow-[0_0_30px_#f59e0b] scale-150 transition-all';
            ringPulse = 'animate-ping duration-300 opacity-90';
          } else if (isLoser) {
            // Fade out unselected fingers
            bgStyle = { backgroundColor: 'rgba(64,64,64,0.2)' };
            borderClass = 'border-2 border-stone-800 opacity-20';
            ringPulse = 'hidden';
          } else if (selectionResult?.type === 'group' && finger.teamIndex !== null) {
            // Group Mode Colors
            const team = teamColors[finger.teamIndex];
            bgStyle = { backgroundColor: team.bg };
            borderClass = 'border-4 border-white shadow-xl scale-110';
            ringPulse = 'animate-pulse opacity-50';
          }

          return (
            <div
              key={finger.id}
              className={`absolute w-16 h-16 md:w-20 md:h-20 rounded-full flex flex-col items-center justify-center transition-all duration-300 pointer-events-none ${borderClass}`}
              style={circleStyle}
            >
              {/* Outer Pulse Ring */}
              <div
                className={`absolute inset-[-6px] rounded-full border-2 border-dashed ${ringPulse}`}
                style={{ borderColor: isWinner ? '#f59e0b' : finger.color }}
              />

              {/* Inner Circle Fill */}
              <div className="absolute inset-1 rounded-full transition-all duration-300" style={bgStyle} />

              {/* Text label inside circle */}
              <div className="z-10 text-[9px] md:text-xs font-black text-white text-center drop-shadow-md">
                {isWinner ? '당첨 👑' : (selectionResult?.type === 'group' && finger.teamIndex !== null) ? `${finger.teamIndex + 1}팀` : 'WAIT'}
              </div>
            </div>
          );
        })}
      </div>

      {/* Control Buttons */}
      <div className="flex space-x-3 w-full">
        <button
          onClick={resetChwazi}
          className="px-6 py-3 bg-stone-900 hover:bg-stone-800 border border-stone-800 hover:border-stone-700 text-stone-300 font-black rounded-2xl text-xs transition active:scale-95 flex-1"
        >
          초기화 (새 게임)
        </button>
        <button
          onClick={triggerChwaziMatch}
          disabled={isSelecting || fingers.length < 2}
          className="px-8 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 disabled:opacity-40 text-black font-black rounded-2xl text-xs shadow-lg shadow-amber-500/10 active:scale-95 transition-all flex-[2]"
        >
          {isSelecting ? '손가락 정밀 스캔 중...' : '매칭 및 결과 도출!'}
        </button>
      </div>
      
    </div>
  );
}

// -------------------------------------
// TIMER TOOL COMPONENT
// -------------------------------------
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
    <div className="flex flex-col items-center justify-center space-y-6 py-6 max-w-sm mx-auto animate-fade-in">
      <h3 className="text-base font-bold text-stone-300">⏳ 모래시계 타이머</h3>

      {/* Progress Circle */}
      <div className="relative w-44 h-44 flex items-center justify-center bg-black rounded-full border border-stone-800 shadow-xl">
        <div
          className="absolute inset-2 rounded-full transition-all duration-1000"
          style={{
            background: `conic-gradient(from 0deg, #f59e0b ${percent}%, #1e293b ${percent}%)`
          }}
        />
        <div className="absolute inset-4 bg-black rounded-full flex flex-col items-center justify-center space-y-1">
          <span className="text-3xl font-black font-mono text-white">{formatTime(seconds)}</span>
          <span className="text-[10px] text-stone-500">{totalTime}초 제한</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex space-x-2 w-full">
        <button
          onClick={handleStartStop}
          className={`flex-1 py-3 font-bold rounded-xl text-xs transition-all ${
            isActive
              ? 'bg-red-600 text-white'
              : 'bg-amber-500 text-black'
          }`}
        >
          {isActive ? '일시 정지' : '시작'}
        </button>
        <button
          onClick={() => handleReset()}
          className="px-4 py-3 bg-stone-800 hover:bg-stone-700 font-bold rounded-xl text-xs text-stone-300"
        >
          리셋
        </button>
      </div>

      {/* Presets */}
      <div className="grid grid-cols-4 gap-2 w-full">
        {[30, 60, 180, 300].map((t) => (
          <button
            key={t}
            onClick={() => handleReset(t)}
            className={`py-2 text-xs font-bold rounded-lg transition-all ${
              totalTime === t
                ? 'bg-stone-800 text-amber-400 border border-amber-500/30'
                : 'bg-neutral-900 hover:bg-stone-800 text-stone-400'
            }`}
          >
            {t >= 60 ? `${t / 60}분` : `${t}초`}
          </button>
        ))}
      </div>
    </div>
  );
}

// -------------------------------------
// ROULETTE TOOL COMPONENT
// -------------------------------------
function RouletteTool() {
  const [options, setOptions] = useState([
    '인디언밥 5대 억울하게 맞기',
    '다음 판 음료수 직접 픽업',
    '노래 한 구절 부르기',
    '아무 말 없이 5분 동안 게임하기',
    '★ 벌칙 면제권 획득 ★',
    '테이블 정돈 마스터 (정리 독차지)'
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
      ctx.fillStyle = i % 2 === 0 ? '#ffffff' : '#000000';
      
      if (colors[i % colors.length] === '#1e293b' || colors[i % colors.length] === '#78350f' || colors[i % colors.length] === '#b45309') {
        ctx.fillStyle = '#ffffff';
      } else {
        ctx.fillStyle = '#000000';
      }
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'right';
      const text = opt.length > 15 ? opt.substring(0, 13) + '..' : opt;
      ctx.fillText(text, radius - 15, 4);
      ctx.restore();
    });

    ctx.beginPath();
    ctx.arc(radius, radius, 12, 0, 2 * Math.PI);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3;
    ctx.stroke();
  };

  const spin = () => {
    if (isSpinning || options.length === 0) return;
    setIsSpinning(true);
    setWinner('');

    const startRot = angleRef.current;
    const addedRot = 5 * 2 * Math.PI + Math.random() * 2 * Math.PI;
    const duration = 4000;
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
    <div className="space-y-6 max-w-lg mx-auto w-full animate-fade-in">
      <div className="text-center">
        <h3 className="text-sm font-bold text-stone-300">🎡 손에 땀을 쥐는 벌칙 룰렛</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Left: Interactive Canvas Wheel */}
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="relative">
            <div className="absolute top-[-10px] left-1/2 transform -translate-x-1/2 z-10">
              <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[18px] border-t-amber-400" />
            </div>
            <canvas
              ref={canvasRef}
              width={240}
              height={240}
              className="rounded-full shadow-2xl border-4 border-stone-800 bg-black"
            />
          </div>

          <button
            onClick={spin}
            disabled={isSpinning || options.length === 0}
            className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-black font-black rounded-xl text-xs shadow-lg transition active:scale-95"
          >
            {isSpinning ? '돌아가는 중...' : '룰렛 돌리기!'}
          </button>

          {winner && (
            <div className="text-center p-3 bg-red-500/10 border border-red-500/20 rounded-xl max-w-[240px]">
              <span className="text-[10px] text-red-400 font-extrabold uppercase tracking-widest block">당첨 벌칙</span>
              <p className="text-xs font-bold text-white mt-1">{winner}</p>
            </div>
          )}
        </div>

        {/* Right: Custom Options Editor */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-400">룰렛 항목 관리</label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={newOption}
                onChange={(e) => setNewOption(e.target.value)}
                placeholder="새 벌칙 항목 입력"
                onKeyDown={(e) => e.key === 'Enter' && addOption()}
                className="flex-1 bg-neutral-900 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-200 focus:border-amber-500 outline-none"
              />
              <button
                onClick={addOption}
                className="px-4 py-2 bg-stone-800 hover:bg-stone-750 text-amber-400 font-bold text-xs rounded-xl transition"
              >
                등록
              </button>
            </div>
          </div>

          <div className="max-h-[160px] overflow-y-auto bg-black p-3 rounded-xl border border-stone-800 space-y-1.5 scrollbar-thin">
            {options.map((opt, idx) => (
              <div key={idx} className="flex justify-between items-center bg-neutral-900 p-2 rounded-lg border border-stone-800/40">
                <span className="text-xs text-stone-300 truncate pr-2" style={{ color: colors[idx % colors.length] }}>
                  ■ {opt}
                </span>
                <button
                  onClick={() => removeOption(idx)}
                  className="text-stone-500 hover:text-stone-300 text-xs px-1.5 font-extrabold"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}