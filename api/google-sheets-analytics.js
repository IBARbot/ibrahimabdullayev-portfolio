// Köhnə açıq endpoint bağlanıb: analytics yazısı indi yalnız /api/analytics/track
// daxilindən, limitlə edilir (server/analyticsSheets.js).
export default function handler(req, res) {
  return res.status(410).json({ success: false, message: 'Gone' });
}
