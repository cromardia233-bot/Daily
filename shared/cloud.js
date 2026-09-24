(() => {
  const SUPABASE_URL = 'https://fgrwdqdfafikmxvrhbmd.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_4-E4mPBMxXceDC-m5IOh8w_ZtZKLkgq';
  const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

  function injectStyles(){
    if(document.getElementById('journalCloudStyles')) return;
    const style=document.createElement('style');
    style.id='journalCloudStyles';
    style.textContent=`
      .cloud-auth{position:fixed;inset:0;z-index:10000;background:#efefed;display:grid;place-items:center;padding:20px;color:#171717;font-family:-apple-system,BlinkMacSystemFont,"Pretendard","Apple SD Gothic Neo",sans-serif}
      .cloud-auth[hidden]{display:none}.cloud-card{width:min(430px,100%);background:#fff;border:1px solid #ddd;border-radius:22px;padding:26px;box-shadow:0 18px 60px rgba(0,0,0,.1)}
      .cloud-card h1{font-size:27px;margin:0 0 8px}.cloud-card p{font-size:13px;line-height:1.65;color:#666;margin:0 0 18px}
      .cloud-card label{display:block;font-size:12px;color:#666;margin:12px 0 6px}.cloud-card input{width:100%;border:1px solid #d8d8d4;border-radius:12px;padding:12px;background:#fff;color:#171717}
      .cloud-actions{display:grid;gap:8px;margin-top:16px}.cloud-btn{border:0;border-radius:12px;padding:12px 14px;font-weight:700;cursor:pointer;background:#222;color:#fff}
      .cloud-btn.alt{background:#f4f3f0;color:#333;border:1px solid #ddd}.cloud-message{min-height:18px;margin-top:12px;font-size:12px;color:#666}
      .journal-switcher{display:flex;gap:7px;flex-wrap:wrap;align-items:center}.journal-switcher a{font-size:12px;text-decoration:none;color:inherit;border:1px solid currentColor;border-radius:999px;padding:7px 10px;opacity:.75}.journal-switcher a.current{opacity:1;font-weight:700}
    `;
    document.head.appendChild(style);
  }

  function mountAuth({appName='Journal',onSession}){
    injectStyles();
    const gate=document.createElement('div');
    gate.className='cloud-auth';
    gate.innerHTML=`<div class="cloud-card">
      <div style="font-size:11px;letter-spacing:.12em;color:#888;margin-bottom:8px">PRIVATE JOURNALS</div>
      <h1>${appName}</h1>
      <p>같은 계정으로 세 가지 일지를 모두 사용할 수 있습니다. 처음 한 번만 이메일 링크로 들어온 뒤 비밀번호를 설정하면 됩니다.</p>
      <label>이메일</label><input type="email" data-cloud-email autocomplete="email" placeholder="이메일 주소">
      <label>비밀번호</label><input type="password" data-cloud-password autocomplete="current-password" placeholder="비밀번호">
      <div class="cloud-actions"><button class="cloud-btn" data-cloud-login>로그인</button><button class="cloud-btn alt" data-cloud-link>처음 로그인 · 이메일 링크 받기</button></div>
      <div class="cloud-message" data-cloud-message></div>
    </div>`;
    document.body.appendChild(gate);
    const email=gate.querySelector('[data-cloud-email]'), password=gate.querySelector('[data-cloud-password]'), message=gate.querySelector('[data-cloud-message]');
    const setMessage=(text,bad=false)=>{message.textContent=text;message.style.color=bad?'#a33':'#666'};
    gate.querySelector('[data-cloud-login]').onclick=async()=>{
      if(!email.value.trim()||!password.value){setMessage('이메일과 비밀번호를 입력해주세요.',true);return;}
      setMessage('로그인하는 중…');
      const {error}=await client.auth.signInWithPassword({email:email.value.trim(),password:password.value});
      if(error)setMessage(error.message==='Invalid login credentials'?'이메일 또는 비밀번호를 확인해주세요.':error.message,true);
    };
    gate.querySelector('[data-cloud-link]').onclick=async()=>{
      if(!email.value.trim()){setMessage('이메일을 먼저 입력해주세요.',true);return;}
      setMessage('이메일을 보내는 중…');
      const {error}=await client.auth.signInWithOtp({email:email.value.trim(),options:{emailRedirectTo:location.href.split('#')[0],shouldCreateUser:true}});
      setMessage(error?error.message:'이메일로 로그인 링크를 보냈습니다.',!!error);
    };
    password.addEventListener('keydown',e=>{if(e.key==='Enter')gate.querySelector('[data-cloud-login]').click()});
    let activeId='';
    const handle=async(session)=>{
      if(session?.user){
        gate.hidden=true;
        if(activeId!==session.user.id){activeId=session.user.id;await onSession(session.user);}
      }else{
        activeId='';gate.hidden=false;
      }
    };
    client.auth.onAuthStateChange((_event,session)=>setTimeout(()=>handle(session),0));
    client.auth.getSession().then(({data})=>handle(data.session));
    return gate;
  }

  async function setPassword(){
    const password=prompt('새 비밀번호를 입력해주세요. (8자 이상)');
    if(password===null)return false;
    if(password.length<8){alert('비밀번호는 8자 이상으로 설정해주세요.');return false;}
    const confirmPassword=prompt('같은 비밀번호를 한 번 더 입력해주세요.');
    if(password!==confirmPassword){alert('비밀번호가 서로 다릅니다.');return false;}
    const {error}=await client.auth.updateUser({password});
    if(error){alert(error.message);return false;}
    alert('비밀번호가 설정되었습니다.');return true;
  }

  window.JournalCloud={client,mountAuth,setPassword,signOut:()=>client.auth.signOut()};
})();
