/* Podcast Lookbook 共通コア: データ（パターン・スタジオ・見本文言）、設定の合成、プレビュー描画、依頼文、URL状態。
   index.html（見本帳）と hearing.html（ヒアリングシート）の両方から使う。UIはそれぞれのページ側。 */
(function(){
  "use strict";
  var LB = {};

  // ---------- 見本の文言 ----------
  LB.SHOT_CAP = {
    wide:  ["最初の1年は、とにかく人に会い続けました", "それが今の事業につながっているんですね"],
    close: ["正直、最初の半年は売上ゼロでした"],
    solo:  ["今日は、私が独立した理由をお話しします"]
  };
  LB.SHOT_EMPH = { wide:"人に会い続けた1年", close:"売上ゼロの半年", solo:"独立した理由" };
  LB.SHOT_SPK  = { wide:[0,1], close:[1], solo:[0] };   // 行ごとの話者（0=ホスト, 1=ゲスト）
  LB.PROFILES = {
    host:  { name:"山田 花子", title:"ホスト｜株式会社サンプル 代表", bio:"広告代理店を経て独立。\nマーケティング支援と番組の企画を担当。", timeline:"2010　広告代理店に入社\n2017　株式会社サンプル 創業\n2024　本番組を開始" },
    guest: { name:"佐藤 太郎", title:"ゲスト｜サンプル工業 取締役", bio:"大手メーカーを経て家業へ。\n製造業のDXと新規事業を担当。", timeline:"2012　大手メーカーに入社\n2018　家業のサンプル工業へ\n2023　取締役に就任" }
  };
  LB.FONTS = { mincho:"明朝", gothic:"ゴシック", maru:"丸ゴシック" };
  LB.FONT_CSS = { mincho:"var(--f-mincho)", gothic:"var(--f-gothic)", maru:"var(--f-maru)" };

  // ---------- スタジオ（背景の見本。pos は object-position、prof はプロフィールカードを置く側） ----------
  LB.STUDIOS = {
    a: { label:"スタジオA", shots:{
          wide:{src:"img/shot_wide.jpg", pos:"50% 50%", prof:"center"},
          close:{src:"img/shot_close.jpg", pos:"40% 50%", prof:"right"},
          solo:{src:"img/shot_solo.jpg", pos:"62% 50%", prof:"left"} },
         split:{ left:{shot:"close", pos:"42% 50%"}, right:{shot:"solo", pos:"60% 50%"} },
         pip:{ main:{shot:"close", pos:"40% 50%"}, small:{shot:"solo", pos:"62% 50%"} } }
  };
  LB.STUDIO_ORDER = ["a"];

  // ---------- 既定の設定 ----------
  LB.BASE = {
    cap:{on:true, font:"gothic", size:1.0, bottom:7, color:"#FFFFFF", spk:false, spkMode:"fill", c1:"#FFFFFF", c2:"#FFF0A8", stroke:"thick", shadow:"soft", plate:"none", lines:2},
    emph:{on:false, style:"big"},
    title:{on:false, style:"band", pos:"tl", text:"第1回｜起業のきっかけ"},
    logo:{on:true, pos:"tr", style:"plate", size:1.0},
    name:{on:false, pos:"bl", style:"white"},
    prof:{on:false, style:"white", pos:"auto", y:"auto"},
    digest:false, cam:"auto", bgm:"none"
  };

  // ---------- 10パターン（ref は参考動画。2026-10-13 時点で公開・埋め込み可。1対1の対話番組のみ） ----------
  LB.PATTERNS = [
    {id:1, name:"ミニマル", desc:"字幕なし。ロゴだけで映像を見せる", ask:false,
      ref:{id:"D8LFvXF2Q-c", start:300, program:"日経ビジネスLIVE 河合薫×清水哲太郎「経営と舞台の交差点」", channel:"日経ビジネス", seen:"1対1の固定2ショット。字幕・タイトル・名前ラベルは無く、右上に番組ロゴだけを常時表示。ライブ配信のアーカイブで720p。"},
      set:{cap:{on:false}, logo:{on:true,pos:"tr",style:"transparent"}}},
    {id:2, name:"白ゴシック", desc:"太いゴシックの白字幕。黒縁、座布団なし", ask:false,
      ref:{id:"NMpQ7ysG-xk", start:600, program:"渡部のサシ飲み 近藤太香巳「三木谷・熊谷」尊敬する経営者2人", channel:"渡部のサシ飲み", seen:"1対1（ホスト＋ゲスト）。ゴシック太字の白字幕に細い黒縁と薄い影、座布団なし、下部中央1行。左上に白文字＋下線の話題、右上に番組ロゴ。冒頭のダイジェストは赤と黄の大型明朝。"},
      set:{cap:{on:true,font:"gothic",stroke:"thick",shadow:"soft",plate:"none"}, logo:{on:true,pos:"tr",style:"plate"}}},
    {id:3, name:"白明朝", desc:"極太明朝に柔らかい影。左上に話題タイトル", ask:false,
      ref:{id:"hCYQprtIf6A", start:600, program:"崖っぷち#4【赤字1,000万超】亡き弟から会社を継いだ兄が明かす経営危機", channel:"青木康時〜100億達成までの全て〜", seen:"明朝体の白字幕に柔らかい黒い影、縁取りなし、座布団なし、下部中央1〜2行。左上に黒の半透明帯＋白明朝2行の話題タイトル、右上に章見出し。"},
      set:{cap:{on:true,font:"mincho",stroke:"thin",shadow:"soft",plate:"none"}, emph:{on:true,style:"big"}, title:{on:true,style:"band",pos:"tl"}, logo:{on:true,pos:"tr",style:"plate"}}},
    {id:4, name:"話者色分け", desc:"話す人ごとに字幕の色（文字か縁）を変える", ask:false,
      ref:{id:"0eWLOVrpbCs", start:900, program:"三崎優太×ひろゆき「ひろゆきに絶縁の真相を聞いたら…」", channel:"三崎優太 元青汁王子", seen:"車内の1対1。ゴシック太字の白字幕で、話す人によって縁の色が青とオレンジに切り替わる（文字色は両者とも白）。下部中央1行、座布団なし。左上に黒帯＋白文字の話題（キーワードは赤）。色と話者の対応は映像から推定。"},
      set:{cap:{on:true,font:"gothic",stroke:"thick",shadow:"soft",plate:"none",spk:true,spkMode:"stroke",c1:"#1E7BE0",c2:"#F2801E"}, title:{on:true,style:"band",pos:"tl"}, logo:{on:true,pos:"tr",style:"plate"}}},
    {id:5, name:"半透明黒帯", desc:"字幕の下に半透明の黒い帯。映画字幕のように", ask:false,
      ref:{id:"kz9VfPZWXGk", start:120, program:"ReHacQ【東出昌大vs高橋弘樹】ウソと真実…魂の告白", channel:"ReHacQ−リハック−【公式】", seen:"MCなしの1対1。白ゴシック太字の字幕の下に、文字幅に合わせた黒の半透明ボックス（2行のときは画面幅の8割まで広がる）。下部左寄り。右上にマゼンタの角丸座布団で話題、左上に番組ロゴ。途中に左右2分割の場面もある。"},
      set:{cap:{on:true,font:"gothic",stroke:"none",shadow:"none",plate:"band",size:0.9}, logo:{on:true,pos:"tr",style:"transparent"}}},
    {id:6, name:"白座布団タイトル", desc:"左上に白い座布団と黒の太字。字幕は白ゴシック", ask:false,
      ref:{id:"d8lu3GuuZK8", start:600, program:"新R25「病むくらいならコムドットを辞めてもいい。」やまと", channel:"新R25チャンネル", seen:"左上に白い座布団＋左端の赤い縦バー＋黒ゴシック太字の話題タイトルを常時表示（キーフレーズに黄色マーカー）。字幕は白ゴシック太字に黒縁、キーワードだけ黄色。右上に文字ロゴ。"},
      set:{cap:{on:true,font:"gothic",stroke:"thick",shadow:"soft",plate:"none"}, title:{on:true,style:"white",pos:"tl"}, logo:{on:false}}},
    {id:7, name:"キーワード強調＋冒頭ダイジェスト", desc:"キーワードを強調。冒頭にハイライト", ask:false,
      ref:{id:"t3zAPootMoU", start:30, program:"スタートアップ オフレコ対談 EP.192 YC最新バッチ総ざらい 福山太郎", channel:"スタートアップ オフレコ対談", seen:"1対1（ホスト＋ゲスト）。冒頭に「ダイジェスト」ラベル付きのハイライトがあり、黒ボックス＋白ゴシックの見出しの中でキーワードだけ水色＋下線で強調。本編は字幕なしで、映像の下の帯に2人分の名前と肩書を常時表示。720p。蛍光色の帯ではなく下線と色替えで強調する例。"},
      set:{cap:{on:true,font:"gothic",stroke:"thick",shadow:"soft",plate:"none"}, emph:{on:true,style:"marker"}, logo:{on:true,pos:"tl",style:"transparent"}, digest:true}},
    {id:8, name:"ネームプレート", desc:"名前と肩書のプレートを出す。登場時、または出し続ける", ask:false,
      ref:{id:"5N6_z3gaXks", start:90, program:"TBS CROSS DIG 1on1 Podcastプロデューサー・野村高文", channel:"TBS CROSS DIG with Bloomberg", seen:"ゲストの登場時に、黒＋金の大きなロワーサード（名前・肩書・経歴）を左下に表示。右上に黒帯の話題タイトル（キーワードは金色）、左上にチャンネルロゴ。発言字幕はなし。プレートは冒頭だけで、常時表示ではない。"},
      set:{cap:{on:true,font:"gothic",stroke:"thin",shadow:"soft",plate:"none",size:0.9}, name:{on:true,pos:"bl",style:"white"}, logo:{on:true,pos:"tr",style:"plate"}}},
    {id:9, name:"大型2色テロップ", desc:"太い色縁の大きい字幕。要所は色を変える", ask:false,
      ref:{id:"LJG3mbjhwfo", start:400, program:"【堀江の予言】2026年は”この職業”が終わります（年末トーク 桑田×堀江）", channel:"桑田龍征", seen:"大きめのゴシック極太・白文字に太い青縁と黒い影、下部中央1〜2行。1000秒付近は黄縁、1500秒付近は画面幅いっぱいの超大型と、縁の色と大きさで強弱を付ける。左上に多色の番組タイトル、右上に次の話題。"},
      set:{cap:{on:true,font:"gothic",stroke:"thick",shadow:"hard",plate:"none",size:1.3,spk:true,c1:"#FFFFFF",c2:"#FFE033",lines:2}, emph:{on:true,style:"big"}, title:{on:true,style:"white",pos:"tl"}, logo:{on:true,pos:"tr",style:"plate"}}},
    {id:10, name:"2分割／ワイプ", desc:"2人を同時に見せる画面レイアウト", ask:true,
      ref:{id:"IjqGWzLvkUY", start:90, program:"TBS CROSS DIG 1on1 Tech YouTube創業者スティーブ・チェン", channel:"TBS CROSS DIG with Bloomberg", seen:"スタジオのホストとリモートのゲストの1対1。左右2分割で2人を同時に見せる場面と、ゲストの1ショットを行き来する。字幕はゲストの英語を訳した白ゴシックを黒の半透明ボックス（2行・幅広）で下部左寄りに。右上に黒帯＋白文字の話題（キーワードは金色）、左上にロゴ。ワイプ（小窓）の実例は未収集。"},
      set:{cap:{on:true,font:"gothic",stroke:"thick",shadow:"soft",plate:"none"}, logo:{on:true,pos:"tr",style:"plate"}, cam:"split"}}
  ];

  // ---------- 小道具 ----------
  LB.clone = function(o){ return JSON.parse(JSON.stringify(o)); };
  LB.merge = function(base, over){
    var out = LB.clone(base);
    Object.keys(over||{}).forEach(function(k){
      if(over[k] && typeof over[k]==="object" && !Array.isArray(over[k])){ out[k] = Object.assign({}, out[k]||{}, over[k]); }
      else out[k] = over[k];
    });
    return out;
  };
  LB.patternById = function(pid){ return LB.PATTERNS.filter(function(x){return x.id===pid;})[0] || LB.PATTERNS[0]; };
  LB.presetSpec = function(pid){ return LB.merge(LB.BASE, LB.patternById(pid).set); };
  LB.esc = function(s){ return String(s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c];}); };
  LB.fmt = function(sec){ var m=Math.floor(sec/60), s=sec%60; return m+":"+(s<10?"0":"")+s; };
  LB.getPath = function(o,p){ return p.split(".").reduce(function(a,k){ return a==null?a:a[k]; }, o); };
  LB.setPath = function(o,p,v){ var ks=p.split("."), last=ks.pop(), t=ks.reduce(function(a,k){ if(!a[k]) a[k]={}; return a[k]; }, o); t[last]=v; };

  // ---------- URL状態（# の中身）。既定値と違う項目だけを書く ----------
  LB.FLAT = [
    ["co","cap.on","b"],["cf","cap.font","s"],["cs","cap.size","n"],["cb","cap.bottom","n"],["cc","cap.color","s"],["ck","cap.spk","b"],["ckm","cap.spkMode","s"],["c1","cap.c1","s"],["c2","cap.c2","s"],["cst","cap.stroke","s"],["csh","cap.shadow","s"],["cp","cap.plate","s"],["cl","cap.lines","n"],
    ["eo","emph.on","b"],["es","emph.style","s"],
    ["to","title.on","b"],["ts","title.style","s"],["tp","title.pos","s"],["tt","title.text","s"],
    ["lo","logo.on","b"],["lp","logo.pos","s"],["ls","logo.style","s"],["lz","logo.size","n"],
    ["no","name.on","b"],["np","name.pos","s"],["ns","name.style","s"],
    ["po","prof.on","b"],["ps","prof.style","s"],["pp","prof.pos","s"],["py","prof.y","s"],
    ["dg","digest","b"],["cam","cam","s"],["bgm","bgm","s"]
  ];
  LB.encodeHash = function(st){ // {pattern, shot, scene, studio, spec}
    var q = new URLSearchParams();
    q.set("p", String(st.pattern)); q.set("sh", st.shot||"wide"); q.set("sc", st.scene||"normal"); q.set("st", st.studio||"a");
    var base = LB.presetSpec(st.pattern);
    LB.FLAT.forEach(function(f){ var v=LB.getPath(st.spec,f[1]), b=LB.getPath(base,f[1]); if(v!==b){ q.set(f[0], f[2]==="b" ? (v?"1":"0") : String(v)); } });
    return "#"+q.toString();
  };
  LB.decodeHash = function(hash){
    var h = (hash||"").replace(/^#/,""); if(!h) return null;
    var q = new URLSearchParams(h), st = { pattern: parseInt(q.get("p"),10)||3, shot:"wide", scene:"normal", studio:"a" };
    if(LB.SHOT_CAP[q.get("sh")]) st.shot=q.get("sh");
    if(["normal","emph","profile"].indexOf(q.get("sc"))>=0) st.scene=q.get("sc");
    if(LB.STUDIOS[q.get("st")]) st.studio=q.get("st");
    st.spec = LB.presetSpec(st.pattern);
    LB.FLAT.forEach(function(f){ if(q.has(f[0])){ var raw=q.get(f[0]); var v = f[2]==="b" ? raw==="1" : f[2]==="n" ? parseFloat(raw) : raw; if(f[2]!=="n" || !isNaN(v)) LB.setPath(st.spec,f[1],v); } });
    return st;
  };

  // ---------- プレビュー描画（大小共通。文字や余白は枠の高さ比 cqh / 幅比 cqw） ----------
  var FRAME_HTML = '<img class="shot" alt=""><div class="ph"></div><div class="split"><img alt=""><img alt=""></div><div class="pip"><img alt=""></div>'
    + '<div class="ov ov-prof"></div><div class="ov ov-title"><span></span></div><div class="ov ov-logo">LOGO</div><div class="ov ov-name"></div><div class="ov ov-cap"></div>';
  function shotSrc(studio, sh, customImg){ return (customImg && customImg[studio+":"+sh]) || LB.STUDIOS[studio].shots[sh].src; }
  LB.capBlock = function(s, sh, sc){ // 字幕が占める高さ（cqh）
    var size=parseFloat(s.cap.size)||1, fs=5.8*size;
    if(sc==="emph" && s.emph.on) return (s.emph.style==="big" ? fs*2.1 : fs*1.5)*1.25 + 1.2;
    var n = Math.min(LB.SHOT_CAP[sh].length, (s.cap.lines===1||s.cap.lines==="1") ? 1 : 2);
    return n*(fs*1.25) + (n-1)*0.6 + 1.2;
  };
  LB.paintFrame = function(fr, s, sh, sc, studio, customImg){
    if(!fr.firstChild) fr.innerHTML = FRAME_HTML;
    var st = LB.STUDIOS[studio], q=function(c){ return fr.querySelector(c); }, esc=LB.esc;
    var img=q(".shot"), ph=q(".ph");
    img.onerror=function(){ img.style.display="none"; ph.style.display="block"; };
    img.onload=function(){ img.style.display="block"; ph.style.display="none"; };
    img.style.objectPosition = st.shots[sh].pos;
    var want = shotSrc(studio,sh,customImg);
    fr.classList.toggle("is-split", s.cam==="split");
    fr.classList.toggle("is-pip", s.cam==="pip");
    var sp=fr.querySelectorAll(".split img");
    sp[0].src=shotSrc(studio, st.split.left.shot, customImg); sp[0].style.objectPosition=st.split.left.pos;
    sp[1].src=shotSrc(studio, st.split.right.shot, customImg); sp[1].style.objectPosition=st.split.right.pos;
    if(s.cam==="pip"){ want=shotSrc(studio, st.pip.main.shot, customImg); img.style.objectPosition=st.pip.main.pos; var pi=q(".pip img"); pi.src=shotSrc(studio, st.pip.small.shot, customImg); pi.style.objectPosition=st.pip.small.pos; }
    if(img.getAttribute("src")!==want) img.src=want;
    // 字幕
    var cap=q(".ov-cap"); cap.className="ov ov-cap"; cap.innerHTML="";
    var showCap = s.cap.on && sc!=="profile";
    if(showCap){
      cap.classList.add("plate-"+s.cap.plate);
      var fs = 5.8*(parseFloat(s.cap.size)||1);
      cap.style.bottom = s.cap.bottom+"cqh";
      cap.style.fontFamily = LB.FONT_CSS[s.cap.font];
      var stroke = s.cap.stroke==="none"?0 : s.cap.stroke==="thin"?0.06 : 0.11;
      var shadow = s.cap.shadow==="none"?"none" : s.cap.shadow==="soft"?"0 0.25cqh 0.9cqh rgba(0,0,0,.75), 0 0 1.4cqh rgba(0,0,0,.45)" : "0.3cqw 0.5cqh 0 rgba(0,0,0,.9)";
      var lines;
      if(sc==="emph" && s.emph.on){ lines=[{t:LB.SHOT_EMPH[sh], spk:LB.SHOT_SPK[sh][0], emph:true}]; }
      else { var raw=LB.SHOT_CAP[sh].slice(0, (s.cap.lines===1||s.cap.lines==="1")?1:2); lines=raw.map(function(t,i){ return {t:t, spk:LB.SHOT_SPK[sh][i]||0}; }); }
      lines.forEach(function(l){
        var d=document.createElement("span"); d.className="ln";
        var size = l.emph ? (s.emph.style==="big" ? fs*2.1 : fs*1.5) : fs;
        d.style.fontSize = size+"cqh";
        var spkCol = s.cap.spk ? (l.spk===1 ? s.cap.c2 : s.cap.c1) : null;
        var strokeMode = s.cap.spk && s.cap.spkMode==="stroke";
        var col = strokeMode ? "#FFFFFF" : (spkCol || s.cap.color);
        var strokeCol = strokeMode ? spkCol : "#111";
        var strokeW = strokeMode ? Math.max(stroke, 0.06) : stroke;
        var sh2 = shadow;
        if(s.cap.plate==="white"){ strokeW=0; sh2="none"; }
        d.style.color = col;
        d.style.webkitTextStroke = strokeW ? (strokeW*size)+"cqh "+strokeCol : "0";
        d.style.paintOrder="stroke fill";
        d.style.textShadow = sh2;
        if(l.emph && s.emph.style==="marker"){ d.innerHTML='<span class="mk">'+esc(l.t)+'</span>'; d.style.webkitTextStroke="0"; d.style.textShadow="none"; }
        else d.textContent=l.t;
        cap.appendChild(d);
      });
    }
    // 話題タイトル
    var ti=q(".ov-title"); ti.className="ov ov-title";
    if(s.title.on && sc!=="profile"){ ti.classList.add(s.title.style, s.title.pos); ti.querySelector("span").textContent=s.title.text||""; ti.style.display="block"; } else ti.style.display="none";
    // ロゴ
    var lg=q(".ov-logo"); lg.className="ov ov-logo";
    if(s.logo.on){ lg.classList.add(s.logo.style, s.logo.pos); lg.style.fontSize=(2.6*(parseFloat(s.logo.size)||1))+"cqh"; lg.style.display="block"; } else lg.style.display="none";
    // 名前ラベル（字幕の上に載らない高さ）
    var nm=q(".ov-name"); nm.className="ov ov-name";
    if(s.name.on && sc!=="profile"){
      nm.classList.add(s.name.style, s.name.pos);
      var who = sh==="solo" ? LB.PROFILES.host : LB.PROFILES.guest;
      nm.innerHTML = esc(who.name)+'<small>'+esc(who.title)+'</small>';
      nm.style.bottom = (showCap ? (parseFloat(s.cap.bottom)+LB.capBlock(s,sh,sc)+1.5) : 7)+"cqh";
      nm.style.display="block";
    } else nm.style.display="none";
    // 冒頭のプロフィール（引き=2人分を下段に、寄り・1人=顔の横に1枚）
    var pf=q(".ov-prof"); pf.className="ov ov-prof";
    if(sc==="profile" && s.prof.on){
      var y = s.prof.y==="auto" ? (sh==="wide" ? "bottom" : "middle") : s.prof.y;
      var cards = sh==="wide" ? [LB.PROFILES.host, LB.PROFILES.guest] : sh==="solo" ? [LB.PROFILES.host] : [LB.PROFILES.guest];
      pf.classList.add(sh==="wide" ? "pair" : "single", "y-"+y);
      if(sh!=="wide"){ var side = s.prof.pos==="auto" ? st.shots[sh].prof : s.prof.pos; pf.classList.add(side); }
      pf.innerHTML = cards.map(function(c){
        var body = s.prof.style==="timeline" ? c.timeline : c.bio;
        return '<div class="pcard '+s.prof.style+'"><div class="pn">'+esc(c.name)+'<small>'+esc(c.title)+'</small></div><div class="pb">'+esc(body)+'</div></div>';
      }).join("");
      pf.style.display= sh==="wide" ? "flex" : "block";
    } else pf.style.display="none";
  };

  // ---------- 文言 ----------
  LB.camLabel = function(c){ return c==="auto"?"自動切替（話す人の寄り＋引き）" : c==="wide"?"引き固定" : c==="pip"?"ワイプ・小窓（要相談）" : "2分割（要相談）"; };
  LB.bgmLabel = function(b){ return b==="none"?"なし" : b==="light"?"控えめに入れる" : "相談して決める"; };
  LB.specLines = function(s){
    var L=[];
    if(s.cap.on){
      L.push("字幕テロップ: あり／"+LB.FONTS[s.cap.font]+"／大きさ "+Math.round(s.cap.size*100)+"%／下端から "+s.cap.bottom+"%／"
        + (s.cap.spk ? "話す人で"+(s.cap.spkMode==="stroke"?"縁の色":"文字の色")+"を変える（ホスト "+s.cap.c1+"・ゲスト "+s.cap.c2+"）" : "文字色 "+s.cap.color)
        + "／縁取り "+({none:"なし",thin:"細い",thick:"太い"})[s.cap.stroke]+"／影 "+({none:"なし",soft:"柔らかい",hard:"くっきり"})[s.cap.shadow]
        + "／座布団 "+({none:"なし",band:"半透明の黒帯",white:"白（黒文字）"})[s.cap.plate]+"／最大 "+s.cap.lines+"行");
    } else L.push("字幕テロップ: なし");
    L.push("強調テロップ: "+(s.emph.on ? "あり／"+(s.emph.style==="big"?"大きい文字":"蛍光マーカー") : "なし"));
    L.push("話題タイトル: "+(s.title.on ? "あり／"+({band:"半透明グレーの帯",white:"白座布団",dark:"黒座布団"})[s.title.style]+"／"+(s.title.pos==="tl"?"左上":"右上") : "なし"));
    L.push("ロゴ: "+(s.logo.on ? "あり／"+({tr:"右上",tl:"左上",br:"右下",bl:"左下"})[s.logo.pos]+"／"+(s.logo.style==="plate"?"白プレート":"透過")+"／大きさ "+Math.round(s.logo.size*100)+"%" : "なし"));
    L.push("名前ラベル: "+(s.name.on ? "あり／"+(s.name.pos==="bl"?"左下":"右下")+"／"+(s.name.style==="white"?"白":"黒") : "なし"));
    L.push("冒頭のプロフィール場面: "+(s.prof.on ? "あり／"+({white:"白カード",dark:"半透明黒",timeline:"年表"})[s.prof.style]+"／引きは2人分を下段、寄りは"+({auto:"顔を避けた側",left:"左",center:"中央",right:"右"})[s.prof.pos]+"・"+({auto:"中段",top:"上段",middle:"中段",bottom:"下段"})[s.prof.y] : "なし"));
    L.push("冒頭ダイジェスト: "+(s.digest?"あり":"なし"));
    L.push("カメラ割り: "+LB.camLabel(s.cam));
    L.push("BGM: "+LB.bgmLabel(s.bgm));
    return L;
  };
  LB.requestText = function(spec, pattern, opts){
    opts = opts||{};
    var p = pattern, L=[];
    L.push(opts.header || "【ポッドキャスト動画 編集依頼（Podcast Lookbook v1）】");
    (opts.pre||[]).forEach(function(x){ L.push(x); });
    L.push("パターン: "+p.id+" "+p.name+(p.ask?"（要相談）":""));
    L = L.concat(LB.specLines(spec));
    (opts.post||[]).forEach(function(x){ L.push(x); });
    if(p.ref) L.push("参考動画: https://www.youtube.com/watch?v="+p.ref.id+"&t="+(p.ref.start|0)+"s （"+p.ref.program+"）");
    if(opts.url) L.push("Podcast Lookbook のURL: "+opts.url);
    L.push("");
    L.push("--- style.json（Claude Code用） ---");
    L.push(JSON.stringify({version:1, pattern:p.id, pattern_name:p.name, ref: p.ref ? {youtube_id:p.ref.id, start_sec:p.ref.start} : null, hearing: opts.hearing||undefined, spec:spec}, null, 2));
    return L.join("\n");
  };
  LB.copyText = function(text, box, toast, okMsg){
    if(box){ box.value=text; box.classList.add("show"); }
    var done=function(){ toast(okMsg); };
    var fallback=function(){ if(box){ box.focus(); box.select(); } toast("コピーできない環境です。下の文をそのまま選んでコピーしてください"); };
    try{ if(navigator.clipboard && navigator.clipboard.writeText){ navigator.clipboard.writeText(text).then(done, fallback); } else fallback(); }catch(_){ fallback(); }
  };

  window.Lookbook = LB;
})();
