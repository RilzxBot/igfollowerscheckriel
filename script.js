const $ = id => document.getElementById(id);

function parseList(value){
  return [...new Set(
    value.split(/\r?\n|,|;/)
      .map(x => x.trim().replace(/^@/, ""))
      .filter(Boolean)
      .map(x => x.toLowerCase())
  )];
}
function updateCounts(){
  $("followersCount").textContent = parseList($("followers").value).length;
  $("followingCount").textContent = parseList($("following").value).length;
}
$("followers").addEventListener("input", updateCounts);
$("following").addEventListener("input", updateCounts);

$("demoBtn").addEventListener("click", ()=>{
  $("followers").value = `instagram
teman01
teman02
teman04
teman07
nazriel`;
  $("following").value = `instagram
teman01
teman02
teman03
teman04
teman05
teman07
akunlain`;
  updateCounts();
});

let notFollowBack = [];

$("analyzeBtn").addEventListener("click", ()=>{
  const followers = parseList($("followers").value);
  const following = parseList($("following").value);
  const followerSet = new Set(followers);

  notFollowBack = following.filter(x => !followerSet.has(x));
  const mutual = following.filter(x => followerSet.has(x));

  $("statFollowers").textContent = followers.length;
  $("statFollowing").textContent = following.length;
  $("statNotFollowBack").textContent = notFollowBack.length;
  $("statMutual").textContent = mutual.length;

  const list = $("resultList");
  list.innerHTML = "";
  if(!notFollowBack.length){
    list.innerHTML = '<div class="empty">Tidak ada akun dalam daftar following yang tidak muncul di daftar followers.</div>';
  } else {
    notFollowBack.forEach(name=>{
      const el = document.createElement("div");
      el.className = "result-item";
      el.textContent = "@" + name;
      list.appendChild(el);
    });
  }
  $("results").classList.remove("hidden");
  $("results").scrollIntoView({behavior:"smooth", block:"start"});
});

$("copyBtn").addEventListener("click", async ()=>{
  const text = notFollowBack.map(x=>"@"+x).join("\n");
  if(!text){ return; }
  await navigator.clipboard.writeText(text);
  const old = $("copyBtn").textContent;
  $("copyBtn").textContent = "Tersalin ✓";
  setTimeout(()=>$("copyBtn").textContent=old,1500);
});

$("downloadBtn").addEventListener("click", ()=>{
  const text = notFollowBack.length
    ? notFollowBack.map(x=>"@"+x).join("\n")
    : "Tidak ada hasil.";
  const blob = new Blob([text], {type:"text/plain;charset=utf-8"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "ig-tidak-follow-balik.txt";
  a.click();
  URL.revokeObjectURL(a.href);
});
updateCounts();
