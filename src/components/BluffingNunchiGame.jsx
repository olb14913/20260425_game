'use client';

import React, { useState, useEffect, useRef } from 'react';

const PERSONALITIES = [
  {
    id: 'honest',
    systemPrompt: (aiNum, name, round, myScore, aiScore, history) => `너는 한국어로 블러핑 눈치게임을 하는 AI야. 성격은 "솔직이" — 대체로 진짜 힌트를 줘.
지금 네가 고른 숫자: ${aiNum} (이 숫자는 절대 직접 말하면 안 돼! 절대 비밀!)
상대 이름: ${name}
현재 라운드: ${round}/5
현재 점수: ${name} ${myScore}점 vs 나 ${aiScore}점
${history.length > 0 ? `\n지난 라운드 기록:\n${history.map(h => `- 라운드 ${h.round}: ${name} ${h.my} vs 나 ${h.ai} → ${h.result === 'win' ? `${name} 승` : h.result === 'lose' ? '내 승' : '무승부'}`).join('\n')}` : '(첫 라운드)'}

게임 규칙: 1~10 중 서로 다른 숫자를 골라, 더 큰 쪽이 라운드 승리.

대화 스타일:
- 친근하고 솔직한 구어체 (반말)
- 1~2문장으로 짧게
- 네 숫자가 7 이상이면 "높게 갈 거야" 같은 뉘앙스 진짜 힌트
- 네 숫자가 4 이하면 "낮게 가" 같은 뉘앙스 진짜 힌트
- 네 숫자가 5~6이면 "중간 정도" 같은 뉘앙스 힌트
- 상대가 "너 뭐 낼 거야?" "몇 골랐어?" 같이 물으면, 직접 숫자는 말하지 말고 뉘앙스 힌트로 답해
- 가끔 살짝 도발도 해
- 절대 숫자(1~10)를 직접 말하지 마
- "AI"라고 자칭하지 말고 자연스럽게

엄격한 제한:
- 오직 이 게임(숫자 선택, 심리전, 힌트, 도발)에 관한 말만 해
- 날씨, 음식, 일상, 공부, 뉴스 등 게임과 무관한 주제는 절대 꺼내지 마
- 상대가 게임 외 주제로 말을 돌리면 "게임에 집중해" 같은 말로 짧게 끊고 게임 얘기로 돌아와`
  },
  {
    id: 'liar',
    systemPrompt: (aiNum, name, round, myScore, aiScore, history) => `너는 한국어로 블러핑 눈치게임을 하는 AI야. 성격은 "거짓말쟁이" — 힌트를 거의 항상 반대로 말해.
지금 네가 고른 숫자: ${aiNum} (이 숫자는 절대 직접 말하면 안 돼! 절대 비밀!)
상대 이름: ${name}
현재 라운드: ${round}/5
현재 점수: ${name} ${myScore}점 vs 나 ${aiScore}점
${history.length > 0 ? `\n지난 라운드 기록:\n${history.map(h => `- 라운드 ${h.round}: ${name} ${h.my} vs 나 ${h.ai} → ${h.result === 'win' ? `${name} 승` : h.result === 'lose' ? '내 승' : '무승부'}`).join('\n')}` : '(첫 라운드)'}

게임 규칙: 1~10 중 서로 다른 숫자를 골라, 더 큰 쪽이 라운드 승리.

대화 스타일:
- 능글맞고 자신감 있는 구어체 (반말)
- 1~2문장으로 짧게
- 네 숫자가 7 이상이면 "낮게 갈 거야"라고 거짓 힌트
- 네 숫자가 4 이하면 "엄청 높게 간다"라고 거짓 힌트
- 네 숫자가 5~6이면 극단적인 거짓 힌트
- 상대가 "너 뭐 낼 거야?" 물으면 진실의 정반대 뉘앙스로 능글맞게 답해
- 상대가 의심하면 더 강하게 우겨
- 절대 숫자(1~10)를 직접 말하지 마
- "AI"라고 자칭하지 마

엄격한 제한:
- 오직 이 게임(숫자 선택, 심리전, 블러핑, 도발)에 관한 말만 해
- 날씨, 음식, 일상, 공부, 뉴스 등 게임과 무관한 주제는 절대 꺼내지 마
- 상대가 게임 외 주제로 말을 돌리면 능글맞게 "그런 거 몰라, 숫자나 골라" 식으로 끊고 게임으로 돌아와`
  },
  {
    id: 'random',
    systemPrompt: (aiNum, name, round, myScore, aiScore, history) => `너는 한국어로 블러핑 눈치게임을 하는 AI야. 성격은 "예측불가" — 종잡을 수 없어.
지금 네가 고른 숫자: ${aiNum} (이 숫자는 절대 직접 말하면 안 돼! 절대 비밀!)
상대 이름: ${name}
현재 라운드: ${round}/5
현재 점수: ${name} ${myScore}점 vs 나 ${aiScore}점
${history.length > 0 ? `\n지난 라운드 기록:\n${history.map(h => `- 라운드 ${h.round}: ${name} ${h.my} vs 나 ${h.ai} → ${h.result === 'win' ? `${name} 승` : h.result === 'lose' ? '내 승' : '무승부'}`).join('\n')}` : '(첫 라운드)'}

게임 규칙: 1~10 중 서로 다른 숫자를 골라, 더 큰 쪽이 라운드 승리.

대화 스타일:
- 짧고 종잡을 수 없는 구어체 (반말)
- 1문장, 매우 짧게
- 힌트가 진짜일 수도 거짓일 수도 — 50/50
- 가끔 뜬금없어 보이는 말을 해도, 반드시 게임·숫자·심리전과 연결되게 해 (예: "왜 떨려", "이상하게 자신 있네")
- 상대가 뭐 낼지 물어도 종잡을 수 없게 답해
- 절대 숫자(1~10)를 직접 말하지 마
- "AI"라고 자칭하지 마

엄격한 제한:
- 오직 이 게임(숫자 선택, 심리전, 블러핑)에 관한 말만 해
- 날씨, 음식, 일상, 공부, 뉴스 등 완전히 게임과 무관한 주제는 절대 꺼내지 마`
  }
];

const STORAGE_KEY = 'bluff_game_records_v3';

export default function BluffingNunchiGame() {
  const [phase, setPhase] = useState('start');
  const [name, setName] = useState('');
  const [round, setRound] = useState(1);
  const [myScore, setMyScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  const [personality, setPersonality] = useState(null);
  const [aiChoice, setAiChoice] = useState(null);
  const [tentativeChoice, setTentativeChoice] = useState(null);
  const [myUsedNums, setMyUsedNums] = useState([]);
  const [aiUsedNums, setAiUsedNums] = useState([]);
  const [history, setHistory] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [timeLeft, setTimeLeft] = useState(30);
  const [records, setRecords] = useState([]);
  const [lastTs, setLastTs] = useState(0);

  const timerRef = useRef(null);
  const provokeRef = useRef(null);
  const chatBoxRef = useRef(null);
  const stateRef = useRef({});
  const tentativeChoiceRef = useRef(null);
  const myUsedNumsRef = useRef([]);

  useEffect(() => {
    stateRef.current = { aiChoice, personality, round, name, chatHistory, history, myScore, aiScore };
  }, [aiChoice, personality, round, name, chatHistory, history, myScore, aiScore]);

  useEffect(() => { tentativeChoiceRef.current = tentativeChoice; }, [tentativeChoice]);
  useEffect(() => { myUsedNumsRef.current = myUsedNums; }, [myUsedNums]);
  useEffect(() => { loadRecords(); }, []);
  useEffect(() => {
    if (chatBoxRef.current) chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
  }, [chatMessages]);

  function loadRecords() {
    try {
      const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      setRecords(data);
    } catch (e) { setRecords([]); }
  }

  function saveRecord(name, score) {
    const now = new Date();
    const date = `${now.getMonth() + 1}/${now.getDate()}`;
    const ts = Date.now();
    const updated = [...records, { name, score, date, ts }]
      .sort((a, b) => b.score - a.score || a.ts - b.ts)
      .slice(0, 50);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); } catch (e) {}
    setRecords(updated);
    setLastTs(ts);
  }

  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  function getAvail(used) {
    const a = [];
    for (let i = 1; i <= 10; i++) if (!used.includes(i)) a.push(i);
    return a;
  }

  function pickAiNum(used) {
    const avail = getAvail(used);
    if (!avail.length) return null;
    const sorted = [...avail].sort((a, b) => b - a);
    const r = Math.random();
    if (r < 0.5) return sorted[0];
    if (r < 0.75 && sorted[1]) return sorted[1];
    return pick(avail);
  }

  function startGame() {
    const nm = name.trim() || '플레이어';
    const p = pick(PERSONALITIES);
    const aiN = pickAiNum([]);
    setName(nm);
    setPersonality(p);
    setRound(1);
    setMyScore(0);
    setAiScore(0);
    setMyUsedNums([]);
    setAiUsedNums([]);
    setHistory([]);
    setAiChoice(aiN);
    setTentativeChoice(null);
    setChatMessages([]);
    setChatHistory([]);
    setTimeLeft(30);
    setPhase('play');
    setTimeout(() => {
      streamAi(aiN, p, 1, nm, [], 'open', [], 0, 0);
      startTimer();
    }, 100);
  }

  function setupNextRound() {
    const aiN = pickAiNum(aiUsedNums);
    setAiChoice(aiN);
    setTentativeChoice(null);
    setChatMessages([]);
    setChatHistory([]);
    setTimeLeft(30);
    setTimeout(() => {
      const cur = stateRef.current;
      streamAi(aiN, cur.personality, cur.round, cur.name, [], 'open', cur.history, cur.myScore, cur.aiScore);
      startTimer();
    }, 100);
  }

  function startTimer() {
    clearInterval(timerRef.current);
    clearTimeout(provokeRef.current);
    setTimeLeft(30);

    provokeRef.current = setTimeout(() => {
      const cur = stateRef.current;
      if (!isStreaming) {
        streamAi(cur.aiChoice, cur.personality, cur.round, cur.name, cur.chatHistory, 'provoke', cur.history, cur.myScore, cur.aiScore);
      }
    }, 13000);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          clearTimeout(provokeRef.current);
          const tc = tentativeChoiceRef.current;
          const used = myUsedNumsRef.current;
          if (tc !== null) {
            confirmPick(tc, false);
          } else {
            const avail = getAvail(used);
            if (avail.length) confirmPick(Math.max(...avail), true);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  async function streamAi(aiN, p, rnd, nm, prevHistory, kind, gameHistory = [], mySc = 0, aiSc = 0) {
    if (!p || aiN === null) return;
    setIsStreaming(true);

    const systemPrompt = p.systemPrompt(aiN, nm, rnd, mySc, aiSc, gameHistory);
    const messages = [];

    if (kind === 'open') {
      messages.push({
        role: 'user',
        content: `라운드 ${rnd} 시작이야. 짧게 도발하거나 힌트를 던져봐. 1~2문장 이내로.`
      });
    } else if (kind === 'provoke') {
      prevHistory.forEach(m => messages.push(m));
      messages.push({
        role: 'user',
        content: `(시간이 얼마 안 남았어. 짧게 한 번 더 흔들어봐. 1문장.)`
      });
    } else {
      prevHistory.forEach(m => messages.push(m));
      messages.push({ role: 'user', content: kind });
    }

    const msgId = Date.now() + Math.random();
    setChatMessages(prev => [...prev, { id: msgId, role: 'ai', text: '', streaming: true }]);

    let fullText = '';
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemPrompt,
          messages,
        }),
      });

      if (!response.ok || !response.body) throw new Error(`HTTP ${response.status}`);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop();

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith('data:')) continue;
          const data = trimmed.slice(5).trim();
          if (!data || data === '[DONE]') continue;
          try {
            const parsed = JSON.parse(data);
            if (parsed.choices?.[0]?.delta?.content) {
              fullText += parsed.choices[0].delta.content;
              setChatMessages(prev => prev.map(m =>
                m.id === msgId ? { ...m, text: fullText } : m
              ));
            }
          } catch (e) {}
        }
      }
    } catch (e) { fullText = '...'; }

    if (!fullText.trim()) fullText = '...';

    setChatMessages(prev => prev.map(m =>
      m.id === msgId ? { ...m, text: fullText, streaming: false } : m
    ));

    setChatHistory(prev => {
      const updated = [...prev];
      if (kind !== 'open' && kind !== 'provoke') {
        updated.push({ role: 'user', content: kind });
      }
      updated.push({ role: 'assistant', content: fullText });
      return updated;
    });

    setIsStreaming(false);
  }

  function sendChat() {
    const txt = chatInput.trim();
    if (!txt || isStreaming) return;
    setChatInput('');
    setChatMessages(prev => [...prev, { id: Date.now(), role: 'user', text: txt }]);
    const cur = stateRef.current;
    streamAi(cur.aiChoice, cur.personality, cur.round, cur.name, cur.chatHistory, txt, cur.history, cur.myScore, cur.aiScore);
  }

  function selectTentative(num) { setTentativeChoice(num); }

  function confirmPick(num, isAutoFlag) {
    clearInterval(timerRef.current);
    clearTimeout(provokeRef.current);

    const my = num;
    const ai = aiChoice;
    let result, newMyScore = myScore, newAiScore = aiScore;

    if (my === ai) result = 'draw';
    else if (my > ai) { result = 'win'; newMyScore++; }
    else { result = 'lose'; newAiScore++; }

    setMyScore(newMyScore);
    setAiScore(newAiScore);
    setHistory(prev => [...prev, { round, my, ai, result, auto: isAutoFlag }]);
    setMyUsedNums(prev => [...prev, my]);
    setAiUsedNums(prev => [...prev, ai]);
    setPhase('reveal');
  }

  function nextRound() {
    if (round >= 5) {
      saveRecord(name, myScore);
      setPhase('end');
      return;
    }
    setRound(r => r + 1);
    setPhase('play');
    setTimeout(setupNextRound, 50);
  }

  function goStart() {
    setPhase('start');
    setName('');
    loadRecords();
  }

  const timerColor = timeLeft <= 5 ? '#E24B4A' : timeLeft <= 10 ? '#BA7517' : '#1D9E75';
  const timerPct = Math.max(0, (timeLeft / 30) * 100);
  const medals = ['🥇', '🥈', '🥉'];
  const lastH = history[history.length - 1];

  return (
    <div style={{
      fontFamily: '"Pretendard", -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
      maxWidth: 520,
      margin: '0 auto',
      padding: '0 20px 48px',
      background: '#F5F2EC',
      minHeight: '100vh',
      color: '#1A1816'
    }}>
      <div style={{
        position: 'sticky', top: 0, zIndex: 10,
        background: '#F5F2EC',
        borderBottom: '1px solid #E8E3D9',
        padding: '14px 0 12px',
        marginBottom: 20,
      }}>
        <span style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.03em' }}>
          Bluffing Game
        </span>
      </div>

      {phase === 'start' && (
        <div>

          <p style={{ fontSize: 14, lineHeight: 1.8, color: '#4A4540', marginBottom: 24 }}>
            1~10 중 숫자를 하나 골라 AI와 대결해요.<br />
            서로 다른 숫자를 고르면, 더 큰 숫자를 고른 쪽이 라운드 승리.<br />
            AI가 힌트를 주는데 — <em>다 믿으면 안 돼요.</em>
          </p>

          <div style={{
            background: '#EBE5D9', border: '1px solid #1A1816',
            padding: '14px 18px', marginBottom: 28,
            fontSize: 13, color: '#4A4540', lineHeight: 1.8
          }}>
            총 5라운드 · 라운드당 30초 고정<br />
            제한시간 동안 선택을 자유롭게 변경할 수 있어요<br />
            <strong>AI가 낸 숫자는 5라운드 종료 후 한꺼번에 공개</strong>돼요
          </div>

          <label style={{ fontSize: 12, color: '#8B8278', display: 'block', marginBottom: 6, letterSpacing: 1, textTransform: 'uppercase' }}>
            이름
          </label>
          <input
            type="text" value={name} onChange={(e) => setName(e.target.value)}
            placeholder="예: 미나" maxLength={10}
            style={{
              width: '100%', padding: '12px 16px', border: '1px solid #1A1816',
              background: 'transparent', fontSize: 16, color: '#1A1816',
              marginBottom: 16, boxSizing: 'border-box', borderRadius: 0
            }}
          />

          <button
            className="primary-btn" onClick={startGame}
            style={{
              width: '100%', padding: '14px', background: '#1A1816', color: '#F5F2EC',
              border: 'none', fontSize: 14, fontWeight: 700, letterSpacing: 1,
              cursor: 'pointer', borderRadius: 8
            }}
          >
            게임 시작
          </button>

          <div style={{ height: 1, background: '#D4CCBE', margin: '32px 0 20px' }}></div>

          <div style={{ fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', color: '#8B8278', marginBottom: 12 }}>
            역대 기록
          </div>
          {records.length === 0 ? (
            <div style={{ fontSize: 13, color: '#8B8278', textAlign: 'center', padding: '24px 0' }}>
              아직 기록이 없어요
            </div>
          ) : (
            <div>
              {records.slice(0, 10).map((r, i) => (
                <div key={r.ts} style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0',
                  borderBottom: '1px solid #D4CCBE', fontSize: 13
                }}>
                  <div style={{ width: 28, textAlign: 'center', fontWeight: 600 }}>
                    {i < 3 ? medals[i] : i + 1}
                  </div>
                  <div style={{ flex: 1, fontWeight: 500 }}>{r.name}</div>
                  <div style={{ fontWeight: 600 }}>{r.score}점</div>
                  <div style={{ minWidth: 50, textAlign: 'right', color: '#8B8278', fontSize: 12 }}>{r.date}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {phase === 'play' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <span style={{ fontSize: 11, letterSpacing: 2, color: '#8B8278', textTransform: 'uppercase' }}>
              Round {round} / 5
            </span>
            <span style={{ fontSize: 13, fontWeight: 600 }}>{name}</span>
          </div>

          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            <div style={{ flex: 1, padding: '12px 14px', background: '#EBE5D9', border: '1px solid #1A1816', borderRadius: 6 }}>
              <div style={{ fontSize: 10, letterSpacing: 1.5, color: '#8B8278', marginBottom: 2, textTransform: 'uppercase', fontWeight: 600 }}>{name}</div>
              <div style={{ fontSize: 30, fontWeight: 800, lineHeight: 1.1 }}>{myScore}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', color: '#8B8278', fontSize: 12, fontWeight: 600 }}>:</div>
            <div style={{ flex: 1, padding: '12px 14px', background: '#1A1816', color: '#F5F2EC', borderRadius: 6 }}>
              <div style={{ fontSize: 10, letterSpacing: 1.5, color: '#8B8278', marginBottom: 2, textTransform: 'uppercase', fontWeight: 600 }}>AI</div>
              <div style={{ fontSize: 30, fontWeight: 800, lineHeight: 1.1 }}>{aiScore}</div>
            </div>
          </div>

          <div className={timeLeft <= 5 ? 'timer-pulse' : ''} style={{ marginBottom: 20 }}>
            <div style={{ height: 4, background: '#EBE5D9', overflow: 'hidden' }}>
              <div style={{
                height: '100%', background: timerColor, width: `${timerPct}%`,
                transition: 'width 0.9s linear, background 0.3s'
              }}></div>
            </div>
            <div style={{ fontSize: 11, color: '#8B8278', textAlign: 'right', marginTop: 4, letterSpacing: 1 }}>
              {timeLeft}초
            </div>
          </div>

          <div style={{ background: '#FFFFFF', border: '1px solid #E0D9CE', borderRadius: 10, padding: '14px 14px 10px', marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, paddingBottom: 10, borderBottom: '1px solid #F0EBE2' }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: '#1A1816', color: '#F5F2EC',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 700, letterSpacing: 0.5, flexShrink: 0
              }}>
                AI
              </div>
              <span style={{ fontSize: 12, color: '#8B8278', fontWeight: 600, letterSpacing: 0.5 }}>
                상대방
              </span>
            </div>

            <div ref={chatBoxRef} style={{
              height: 180, overflowY: 'auto', padding: '2px 0',
              display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 10
            }}>
              {chatMessages.map(m => (
                <div key={m.id} className="msg-bubble" style={{
                  maxWidth: '82%', padding: '8px 11px', fontSize: 13.5, lineHeight: 1.55,
                  alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                  background: m.role === 'user' ? '#1A1816' : '#F0EBE2',
                  color: m.role === 'user' ? '#F5F2EC' : '#1A1816',
                  borderRadius: m.role === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                  wordBreak: 'break-word', fontWeight: 400
                }}>
                  {m.text}
                  {m.streaming && (
                    <span style={{
                      display: 'inline-block', width: 2, height: 12,
                      background: '#8B8278', marginLeft: 3, verticalAlign: 'middle',
                      animation: 'blink 0.7s infinite'
                    }}></span>
                  )}
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 6 }}>
              <input
                type="text" value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendChat()}
                placeholder="말 걸어봐요..." maxLength={60} disabled={isStreaming}
                style={{
                  flex: 1, padding: '9px 12px', border: '1px solid #D4CCBE',
                  background: '#FAFAF8', fontSize: 13, color: '#1A1816',
                  borderRadius: 8, opacity: isStreaming ? 0.5 : 1
                }}
              />
              <button
                onClick={sendChat} disabled={isStreaming} className="ghost-btn"
                style={{
                  padding: '9px 14px', border: '1px solid #D4CCBE',
                  background: '#FAFAF8', fontSize: 13,
                  cursor: isStreaming ? 'default' : 'pointer',
                  fontWeight: 600, color: '#4A4540',
                  opacity: isStreaming ? 0.4 : 1, borderRadius: 8
                }}
              >
                전송
              </button>
            </div>
          </div>

          <div style={{ marginBottom: 8 }}>
            <div style={{ fontSize: 11, color: '#8B8278', marginBottom: 8, fontWeight: 500 }}>
              {tentativeChoice !== null
                ? <span>선택 중: <strong style={{ color: '#1A1816', fontSize: 13 }}>{tentativeChoice}</strong> <span style={{ color: '#B5ADA3' }}>(변경 가능)</span></span>
                : '숫자를 골라요 (변경 가능)'}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 7, marginBottom: 10 }}>
              {[1,2,3,4,5,6,7,8,9,10].map(i => {
                const isUsed = myUsedNums.includes(i);
                const isSelected = tentativeChoice === i;
                return (
                  <button
                    key={i} className={`num-btn ${isSelected ? 'selected' : ''}`}
                    disabled={isUsed} onClick={() => selectTentative(i)}
                    style={{
                      padding: '15px 0', border: isSelected ? '2px solid #1A1816' : '1px solid #D4CCBE',
                      background: isUsed ? '#F0EBE2' : (isSelected ? '#1A1816' : '#FFFFFF'),
                      color: isUsed ? '#C4BAB0' : (isSelected ? '#F5F2EC' : '#1A1816'),
                      fontSize: 17, fontWeight: 700,
                      cursor: isUsed ? 'default' : 'pointer',
                      transition: 'all 0.12s', borderRadius: 8
                    }}
                  >
                    {i}
                  </button>
                );
              })}
            </div>
          </div>

          <p style={{ fontSize: 11, color: '#B5ADA3', textAlign: 'center', lineHeight: 1.6, margin: 0 }}>
            시간 종료 시 마지막 선택 확정 · 미선택 시 남은 숫자 중 최댓값 자동 선택
          </p>
        </div>
      )}

      {phase === 'reveal' && lastH && (
        <div>
          <div style={{ fontSize: 11, color: '#8B8278', marginBottom: 14, fontWeight: 600, letterSpacing: 1 }}>
            ROUND {round} / 5
          </div>

          <div style={{
            padding: '28px 0 20px',
            background: lastH.result === 'win' ? '#EDF2E6' : lastH.result === 'lose' ? '#FAF0EE' : '#F5F0E6',
            borderRadius: 10, marginBottom: 14, textAlign: 'center'
          }}>
            <div style={{ display: 'flex', gap: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ textAlign: 'center' }}>
                <div className="reveal-num" style={{ fontSize: 58, fontWeight: 800, lineHeight: 1 }}>
                  {lastH.my}
                </div>
                <div style={{ fontSize: 11, color: '#8B8278', marginTop: 6, fontWeight: 600 }}>
                  {name}{lastH.auto && ' · AUTO'}
                </div>
              </div>
              <div style={{ fontSize: 13, color: '#B5ADA3', fontWeight: 600 }}>vs</div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 58, fontWeight: 800, lineHeight: 1, color: '#C4BAB0' }}>?</div>
                <div style={{ fontSize: 11, color: '#8B8278', marginTop: 6, fontWeight: 600 }}>AI</div>
              </div>
            </div>
            <div style={{
              display: 'inline-block', padding: '6px 18px', borderRadius: 20,
              background: lastH.result === 'win' ? '#3B6D11' : lastH.result === 'lose' ? '#A32D2D' : '#854F0B',
              color: '#fff', fontSize: 13, fontWeight: 700
            }}>
              {lastH.result === 'win' ? '라운드 승리 🎉' : lastH.result === 'lose' ? '라운드 패배' : '무승부'}
            </div>
            <div style={{ fontSize: 11, color: '#B5ADA3', marginTop: 12, fontWeight: 500 }}>
              AI 숫자는 게임 종료 후 공개돼요
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
            <div style={{ flex: 1, padding: '12px 14px', background: '#EBE5D9', borderRadius: 8, textAlign: 'center' }}>
              <div style={{ fontSize: 10, color: '#8B8278', marginBottom: 2, fontWeight: 600 }}>{name}</div>
              <div style={{ fontSize: 30, fontWeight: 800 }}>{myScore}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', color: '#8B8278', fontSize: 12, fontWeight: 600 }}>:</div>
            <div style={{ flex: 1, padding: '12px 14px', background: '#1A1816', color: '#F5F2EC', borderRadius: 8, textAlign: 'center' }}>
              <div style={{ fontSize: 10, color: '#8B8278', marginBottom: 2, fontWeight: 600 }}>AI</div>
              <div style={{ fontSize: 30, fontWeight: 800 }}>{aiScore}</div>
            </div>
          </div>

          <button
            className="primary-btn" onClick={nextRound}
            style={{
              width: '100%', padding: '14px', background: '#1A1816', color: '#F5F2EC',
              border: 'none', fontSize: 14, fontWeight: 700, letterSpacing: 0.5,
              cursor: 'pointer', borderRadius: 8
            }}
          >
            {round >= 5 ? '최종 결과 보기 →' : `다음 라운드 (${round + 1}/5) →`}
          </button>
        </div>
      )}

      {phase === 'end' && (
        <div>
          <div style={{
            padding: '28px 16px',
            background: myScore > aiScore ? '#EDF2E6' : myScore < aiScore ? '#FAF0EE' : '#F5F0E6',
            borderRadius: 10, textAlign: 'center', marginBottom: 16
          }}>
            <div style={{ fontSize: 11, color: '#8B8278', marginBottom: 6, fontWeight: 600, letterSpacing: 1 }}>
              FINAL RESULT
            </div>
            <div style={{ fontSize: 32, fontWeight: 800, marginBottom: 6 }}>
              {myScore > aiScore ? `🎉 ${name} 승리!` : myScore < aiScore ? '패배' : '무승부'}
            </div>
            <div style={{ fontSize: 13, color: '#6A6260', fontWeight: 500 }}>
              {myScore > aiScore ? 'AI 블러핑을 꿰뚫었어요' : myScore < aiScore ? 'AI한테 당했네요. 다시 도전?' : '팽팽한 접전이었어요'}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            <div style={{ flex: 1, padding: '12px 14px', background: '#EBE5D9', borderRadius: 8, textAlign: 'center' }}>
              <div style={{ fontSize: 10, color: '#8B8278', marginBottom: 2, fontWeight: 600 }}>{name}</div>
              <div style={{ fontSize: 32, fontWeight: 800 }}>{myScore}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', color: '#8B8278', fontSize: 12, fontWeight: 600 }}>:</div>
            <div style={{ flex: 1, padding: '12px 14px', background: '#1A1816', color: '#F5F2EC', borderRadius: 8, textAlign: 'center' }}>
              <div style={{ fontSize: 10, color: '#8B8278', marginBottom: 2, fontWeight: 600 }}>AI</div>
              <div style={{ fontSize: 32, fontWeight: 800 }}>{aiScore}</div>
            </div>
          </div>

          <div style={{ background: '#FFFFFF', border: '1px solid #E8E3D9', borderRadius: 10, padding: '16px', marginBottom: 20 }}>
            <div style={{ fontSize: 12, color: '#8B8278', marginBottom: 12, fontWeight: 700, textAlign: 'center', letterSpacing: 0.5 }}>
              AI 숫자 대공개
            </div>
            {history.map((h, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '9px 0', borderBottom: i < history.length - 1 ? '1px solid #F0EBE2' : 'none'
              }}>
                <span style={{ fontSize: 12, color: '#B5ADA3', fontWeight: 700, minWidth: 32 }}>
                  R{h.round}
                </span>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <div style={{ textAlign: 'center', minWidth: 36 }}>
                    <div style={{ fontSize: 22, fontWeight: 800 }}>{h.my}</div>
                    <div style={{ fontSize: 10, color: '#B5ADA3', fontWeight: 600 }}>{name}</div>
                  </div>
                  <div style={{ fontSize: 11, color: '#C4BAB0', fontWeight: 600 }}>vs</div>
                  <div style={{ textAlign: 'center', minWidth: 36 }}>
                    <div style={{ fontSize: 22, fontWeight: 800 }}>{h.ai}</div>
                    <div style={{ fontSize: 10, color: '#B5ADA3', fontWeight: 600 }}>AI</div>
                  </div>
                </div>
                <span style={{
                  fontSize: 14, fontWeight: 800,
                  color: h.result === 'win' ? '#3B6D11' : h.result === 'lose' ? '#A32D2D' : '#854F0B',
                  minWidth: 32, textAlign: 'right'
                }}>
                  {h.result === 'win' ? '승' : h.result === 'lose' ? '패' : '무'}
                </span>
              </div>
            ))}
          </div>

          <div style={{ height: 1, background: '#E8E3D9', margin: '20px 0 16px' }}></div>

          <div style={{ fontSize: 12, color: '#8B8278', marginBottom: 10, fontWeight: 700 }}>
            역대 순위
          </div>
          <div style={{ marginBottom: 20 }}>
            {records.slice(0, 10).map((r, i) => {
              const isMe = r.ts === lastTs;
              return (
                <div key={r.ts} style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '9px 8px',
                  borderRadius: 6, marginBottom: 2, fontSize: 13,
                  background: isMe ? '#EBE5D9' : 'transparent',
                  fontWeight: isMe ? 700 : 400
                }}>
                  <div style={{ width: 24, textAlign: 'center', fontSize: 14 }}>
                    {i < 3 ? medals[i] : <span style={{ color: '#B5ADA3', fontWeight: 600 }}>{i + 1}</span>}
                  </div>
                  <div style={{ flex: 1 }}>
                    {r.name}{isMe && <span style={{ color: '#8B8278', fontSize: 11, marginLeft: 4 }}>· 나</span>}
                  </div>
                  <div style={{ fontWeight: 700 }}>{r.score}점</div>
                  <div style={{ color: '#B5ADA3', fontSize: 11 }}>{r.date}</div>
                </div>
              );
            })}
          </div>

          <button
            className="primary-btn" onClick={goStart}
            style={{
              width: '100%', padding: '14px', background: '#1A1816', color: '#F5F2EC',
              border: 'none', fontSize: 14, fontWeight: 700,
              cursor: 'pointer', borderRadius: 8
            }}
          >
            다시 플레이하기
          </button>
        </div>
      )}
    </div>
  );
}
