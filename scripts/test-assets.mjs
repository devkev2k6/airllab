async function testAssets() {
  const res = await fetch("http://localhost:3000");
  const text = await res.text();
  const scriptMatches = [...text.matchAll(/src="(\/_next\/static\/[^"]+)"/g)].map((m) => m[1]);
  console.log("Found scripts count:", scriptMatches.length);
  for (const scriptPath of scriptMatches.slice(0, 5)) {
    const sRes = await fetch("http://localhost:3000" + scriptPath);
    console.log(scriptPath, "Status:", sRes.status);
  }
}
testAssets();
