// api/verify.js
export default function handler(req, res) {
  const { key } = req.query;
  
  // Vercel 환경 변수에서 키 목록을 가져와 배열로 만듭니다.
  const rawKeys = process.env.MASTER_KEYS || "";
  const validKeys = rawKeys.split(",").map(k => k.trim());

  if (validKeys.includes(key)) {
    return res.status(200).json({ 
      success: true, 
      message: "ACCESS_GRANTED" 
    });
  } else {
    return res.status(401).json({ 
      success: false, 
      message: "INVALID_LICENSE_KEY" 
    });
  }
}
