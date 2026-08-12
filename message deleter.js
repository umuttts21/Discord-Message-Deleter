#!/usr/bin/env node
// undiscord-termux.js — Çok Dilli Canlı Webhook Güncelleyici & Arka Plan Koruması VIP Sürüm

const readline = require('readline');
const fs = require('fs');
const { exec } = require('child_process');

const BATCH_SIZE = 100;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const colors = {
  reset: "\x1b[0m", bold: "\x1b[1m", red: "\x1b[31m",
  green: "\x1b[32m", yellow: "\x1b[33m", blue: "\x1b[34m",
  cyan: "\x1b[36m", magenta: "\x1b[35m",
};

// 15 Farklı Dil Desteği ve Webhook Terimleri
const i18n = {
  "1": { name: "Türkçe", t: { askToken: "Discord Token giriniz:", askWeb: "Webhook URL (İsteğe bağlı, boş geçmek için Enter):", ready: "Sistem hazır! İptal için Ctrl+C.", askCh: "Kanal veya DM ID giriniz:", askUsr: "Kullanıcı Adı (Herkes için Enter):", scan: "Kanal geçmişi taranıyor... (Lütfen bekleyin)", foundMsg: "Bulunan hedef mesaj:", page: "Taranan sayfa:", noMsg: "Silinecek hiçbir mesaj bulunamadı.", startDel: "mesaj bulundu! Silme işlemi başlıyor...", deleted: "Silinen", total: "Toplam", rate: "Hız sınırı:", wait: "s bekleniyor...", done: "İŞLEM TAMAMLANDI", success: "Başarıyla Silinen", fail: "Başarısız Olan", unauth: "Yetki Olmayan Kişiler", err: "Hata oluştu:", whScanTitle: "🔍 Tarama İşlemi", whScanDesc: "Kanal taranıyor, hedefler hesaplanıyor...", whDelTitle: "🗑️ Silme İşlemi Devam Ediyor", whDoneTitle: "✅ İşlem Tamamlandı", whCrashTitle: "🚨 Sistem Durdu / Hata" } },
  "2": { name: "English", t: { askToken: "Enter Discord Token:", askWeb: "Webhook URL (Optional, press Enter to skip):", ready: "System ready! Ctrl+C to cancel.", askCh: "Enter Channel or DM ID:", askUsr: "Username (Enter for all):", scan: "Scanning channel history... (Please wait)", foundMsg: "Found target messages:", page: "Scanned page:", noMsg: "No messages found to delete.", startDel: "messages found! Starting deletion...", deleted: "Deleted", total: "Total", rate: "Rate limit:", wait: "s waiting...", done: "PROCESS COMPLETED", success: "Successfully Deleted", fail: "Failed", unauth: "Unauthorized Users", err: "Error occurred:", whScanTitle: "🔍 Scanning Process", whScanDesc: "Scanning channel, calculating targets...", whDelTitle: "🗑️ Deletion in Progress", whDoneTitle: "✅ Process Completed", whCrashTitle: "🚨 System Crashed / Error" } },
  "3": { name: "Русский (Russian)", t: { askToken: "Введите токен Discord:", askWeb: "URL вебхука (Необязательно, Enter для пропуска):", ready: "Система готова! Ctrl+C для отмены.", askCh: "Введите ID канала или ЛС:", askUsr: "Имя пользователя (Enter для всех):", scan: "Сканирование истории... (Подождите)", foundMsg: "Найдено сообщений:", page: "Просканировано страниц:", noMsg: "Сообщения для удаления не найдены.", startDel: "сообщений найдено! Начинаем удаление...", deleted: "Удалено", total: "Всего", rate: "Лимит запросов:", wait: "с ожидание...", done: "ПРОЦЕСС ЗАВЕРШЕН", success: "Успешно удалено", fail: "Ошибка", unauth: "Нет прав на пользователей", err: "Произошла ошибка:", whScanTitle: "🔍 Сканирование", whScanDesc: "Сканирование канала...", whDelTitle: "🗑️ Удаление в процессе", whDoneTitle: "✅ Процесс завершен", whCrashTitle: "🚨 Ошибка системы" } },
  "4": { name: "Deutsch (German)", t: { askToken: "Discord-Token eingeben:", askWeb: "Webhook-URL (Optional, Enter zum Überspringen):", ready: "System bereit! Ctrl+C zum Abbrechen.", askCh: "Kanal- oder DM-ID eingeben:", askUsr: "Benutzername (Enter für alle):", scan: "Verlauf wird gescannt... (Bitte warten)", foundMsg: "Gefundene Nachrichten:", page: "Gescannte Seite:", noMsg: "Keine Nachrichten zum Löschen gefunden.", startDel: "Nachrichten gefunden! Löschen beginnt...", deleted: "Gelöscht", total: "Gesamt", rate: "Ratenlimit:", wait: "s warten...", done: "VORGANG ABGESCHLOSSEN", success: "Erfolgreich gelöscht", fail: "Fehlgeschlagen", unauth: "Unbefugte Benutzer", err: "Fehler aufgetreten:", whScanTitle: "🔍 Scanvorgang", whScanDesc: "Kanal wird gescannt...", whDelTitle: "🗑️ Löschvorgang läuft", whDoneTitle: "✅ Vorgang abgeschlossen", whCrashTitle: "🚨 Systemabsturz / Fehler" } },
  "5": { name: "العربية (Arabic)", t: { askToken: "أدخل توكن ديسكورد:", askWeb: "رابط الويب هوك (اختياري، اضغط Enter للتخطي):", ready: "النظام جاهز! Ctrl+C للإلغاء.", askCh: "أدخل معرف القناة أو الخاص:", askUsr: "اسم المستخدم (Enter للكل):", scan: "جاري مسح السجل... (يرجى الانتظار)", foundMsg: "الرسائل المستهدفة:", page: "الصفحات الممسوحة:", noMsg: "لم يتم العثور على رسائل.", startDel: "رسالة وجدت! جاري الحذف...", deleted: "تم الحذف", total: "المجموع", rate: "حد المعدل:", wait: "ثانية انتظار...", done: "اكتملت العملية", success: "تم الحذف بنجاح", fail: "فشل", unauth: "مستخدمون غير مصرح لهم", err: "حدث خطأ:", whScanTitle: "🔍 عملية المسح", whScanDesc: "جاري مسح القناة...", whDelTitle: "🗑️ جاري الحذف", whDoneTitle: "✅ اكتملت العملية", whCrashTitle: "🚨 خطأ في النظام" } },
  "6": { name: "Français (French)", t: { askToken: "Entrez le token Discord:", askWeb: "URL Webhook (Optionnel):", ready: "Prêt ! Ctrl+C pour annuler.", askCh: "ID du canal ou MP:", askUsr: "Nom d'utilisateur (Entrée pour tous):", scan: "Analyse de l'historique...", foundMsg: "Messages trouvés:", page: "Page analysée:", noMsg: "Aucun message à supprimer.", startDel: "messages trouvés! Suppression...", deleted: "Supprimé", total: "Total", rate: "Limite de taux:", wait: "s d'attente...", done: "PROCESSUS TERMINÉ", success: "Supprimé avec succès", fail: "Échoué", unauth: "Utilisateurs non autorisés", err: "Erreur:", whScanTitle: "🔍 Analyse", whScanDesc: "Analyse du canal...", whDelTitle: "🗑️ Suppression en cours", whDoneTitle: "✅ Processus terminé", whCrashTitle: "🚨 Erreur système" } },
  "7": { name: "Español (Spanish)", t: { askToken: "Ingrese el token de Discord:", askWeb: "URL del Webhook (Opcional):", ready: "¡Listo! Ctrl+C para cancelar.", askCh: "ID del canal o MD:", askUsr: "Usuario (Enter para todos):", scan: "Escaneando historial...", foundMsg: "Mensajes encontrados:", page: "Página escaneada:", noMsg: "No se encontraron mensajes.", startDel: "mensajes encontrados! Eliminando...", deleted: "Eliminado", total: "Total", rate: "Límite de tasa:", wait: "s esperando...", done: "PROCESO COMPLETADO", success: "Eliminado exitosamente", fail: "Fallido", unauth: "Usuarios no autorizados", err: "Error:", whScanTitle: "🔍 Escaneo", whScanDesc: "Escaneando canal...", whDelTitle: "🗑️ Eliminación en curso", whDoneTitle: "✅ Proceso completado", whCrashTitle: "🚨 Error del sistema" } },
  "8": { name: "Italiano (Italian)", t: { askToken: "Inserisci il token Discord:", askWeb: "URL Webhook (Opzionale):", ready: "Pronto! Ctrl+C per annullare.", askCh: "ID canale o DM:", askUsr: "Nome utente (Invio per tutti):", scan: "Scansione della cronologia...", foundMsg: "Messaggi trovati:", page: "Pagina scansionata:", noMsg: "Nessun messaggio trovato.", startDel: "messaggi trovati! Eliminazione...", deleted: "Eliminato", total: "Totale", rate: "Limite di frequenza:", wait: "s di attesa...", done: "PROCESSO COMPLETATO", success: "Eliminato con successo", fail: "Fallito", unauth: "Utenti non autorizzati", err: "Errore:", whScanTitle: "🔍 Scansione", whScanDesc: "Scansione canale...", whDelTitle: "🗑️ Eliminazione in corso", whDoneTitle: "✅ Processo completato", whCrashTitle: "🚨 Errore di sistema" } },
  "9": { name: "Português (Portuguese)", t: { askToken: "Insira o token do Discord:", askWeb: "URL do Webhook (Opcional):", ready: "Pronto! Ctrl+C para cancelar.", askCh: "ID do canal ou DM:", askUsr: "Nome de usuário (Enter para todos):", scan: "A analisar o histórico...", foundMsg: "Mensagens encontradas:", page: "Página analisada:", noMsg: "Nenhuma mensagem encontrada.", startDel: "mensagens encontradas! A eliminar...", deleted: "Eliminado", total: "Total", rate: "Limite de taxa:", wait: "s de espera...", done: "PROCESSO CONCLUÍDO", success: "Eliminado com sucesso", fail: "Falhou", unauth: "Utilizadores não autorizados", err: "Erro:", whScanTitle: "🔍 Análise", whScanDesc: "A analisar canal...", whDelTitle: "🗑️ A eliminar...", whDoneTitle: "✅ Processo concluído", whCrashTitle: "🚨 Erro do sistema" } },
  "10": { name: "Polski (Polish)", t: { askToken: "Podaj token Discord:", askWeb: "URL Webhooka (Opcjonalnie):", ready: "Gotowe! Ctrl+C aby anulować.", askCh: "ID kanału lub DM:", askUsr: "Nazwa użytkownika (Enter dla wszystkich):", scan: "Skanowanie historii...", foundMsg: "Znalezione wiadomości:", page: "Przeskanowana strona:", noMsg: "Nie znaleziono wiadomości.", startDel: "wiadomości! Usuwanie...", deleted: "Usunięto", total: "Suma", rate: "Limit zapytań:", wait: "s oczekiwania...", done: "PROCES ZAKOŃCZONY", success: "Usunięto pomyślnie", fail: "Niepowodzenie", unauth: "Nieautoryzowani", err: "Błąd:", whScanTitle: "🔍 Skanowanie", whScanDesc: "Skanowanie kanału...", whDelTitle: "🗑️ Usuwanie w tracie", whDoneTitle: "✅ Proces zakończony", whCrashTitle: "🚨 Błąd systemu" } },
  "11": { name: "日本語 (Japanese)", t: { askToken: "Discordトークンを入力:", askWeb: "Webhook URL (任意):", ready: "準備完了！ Ctrl+Cでキャンセル。", askCh: "チャンネル/DMのIDを入力:", askUsr: "ユーザー名 (Enterで全員):", scan: "履歴をスキャン中...", foundMsg: "見つかったメッセージ:", page: "スキャンしたページ:", noMsg: "削除するメッセージはありません。", startDel: "件のメッセージ！削除を開始します...", deleted: "削除済み", total: "合計", rate: "レート制限:", wait: "秒待機...", done: "プロセス完了", success: "削除成功", fail: "失敗", unauth: "権限のないユーザー", err: "エラー:", whScanTitle: "🔍 スキャン中", whScanDesc: "チャンネルをスキャンしています...", whDelTitle: "🗑️ 削除を実行中", whDoneTitle: "✅ 処理完了", whCrashTitle: "🚨 システムエラー" } },
  "12": { name: "한국어 (Korean)", t: { askToken: "디스코드 토큰 입력:", askWeb: "Webhook URL (선택):", ready: "준비 완료! Ctrl+C로 취소.", askCh: "채널 또는 DM ID 입력:", askUsr: "사용자 이름 (Enter 누르면 전체):", scan: "기록 스캔 중...", foundMsg: "찾은 메시지:", page: "스캔된 페이지:", noMsg: "삭제할 메시지가 없습니다.", startDel: "개의 메시지 발견! 삭제 시작...", deleted: "삭제됨", total: "총", rate: "속도 제한:", wait: "초 대기 중...", done: "프로세스 완료", success: "성공적으로 삭제됨", fail: "실패", unauth: "권한 없는 사용자", err: "오류:", whScanTitle: "🔍 스캔 중", whScanDesc: "채널 스캔 중...", whDelTitle: "🗑️ 삭제 진행 중", whDoneTitle: "✅ 프로세스 완료", whCrashTitle: "🚨 시스템 오류" } },
  "13": { name: "中文 (Chinese)", t: { askToken: "输入Discord Token:", askWeb: "Webhook URL (可选):", ready: "准备就绪！按Ctrl+C取消。", askCh: "输入频道或DM ID:", askUsr: "用户名 (回车代表全部):", scan: "正在扫描历史记录...", foundMsg: "找到的消息:", page: "已扫描页数:", noMsg: "没有找到要删除的消息。", startDel: "条消息！开始删除...", deleted: "已删除", total: "总计", rate: "速率限制:", wait: "秒等待中...", done: "处理完成", success: "成功删除", fail: "失败", unauth: "无权限的用户", err: "发生错误:", whScanTitle: "🔍 扫描中", whScanDesc: "正在扫描频道...", whDelTitle: "🗑️ 正在删除", whDoneTitle: "✅ 处理完成", whCrashTitle: "🚨 系统错误" } },
  "14": { name: "हिन्दी (Hindi)", t: { askToken: "Discord Token दर्ज करें:", askWeb: "Webhook URL (वैकल्पिक):", ready: "तैयार! रद्द करने के लिए Ctrl+C।", askCh: "चैनल या DM ID दर्ज करें:", askUsr: "उपयोगकर्ता नाम (सभी के लिए Enter):", scan: "इतिहास स्कैन किया जा رہا है...", foundMsg: "मिले हुए संदेश:", page: "स्कैन किए गए पेज:", noMsg: "हटाने के लिए कोई संदेश नहीं मिला।", startDel: "संदेश मिले! हटाना शुरू हो रहा है...", deleted: "हटा दिया गया", total: "कुल", rate: "दर सीमा:", wait: "सेकंड प्रतीक्षा...", done: "प्रक्रिया पूरी हुई", success: "सफलतापूर्वक हटाया गया", fail: "विफल", unauth: "अनधिकृत उपयोगकर्ता", err: "त्रुटि:", whScanTitle: "🔍 स्कैनिंग", whScanDesc: "चैनल स्कैन हो रहा है...", whDelTitle: "🗑️ हटाना जारी है", whDoneTitle: "✅ प्रक्रिया पूरी हुई", whCrashTitle: "🚨 सिस्टम त्रुटि" } },
  "15": { name: "Nederlands (Dutch)", t: { askToken: "Voer Discord-token in:", askWeb: "Webhook URL (Optioneel):", ready: "Klaar! Ctrl+C om te annuleren.", askCh: "Kanaal of DM ID:", askUsr: "Gebruikersnaam (Enter voor alle):", scan: "Geschiedenis scannen...", foundMsg: "Gevonden berichten:", page: "Gescande pagina:", noMsg: "Geen berichten gevonden.", startDel: "berichten gevonden! Verwijderen...", deleted: "Verwijderd", total: "Totaal", rate: "Snelheidslimiet:", wait: "s wachten...", done: "PROCES VOLTOOID", success: "Succesvol verwijderd", fail: "Mislukt", unauth: "Onbevoegde gebruikers", err: "Fout opgetreden:", whScanTitle: "🔍 Scannen", whScanDesc: "Kanaal scannen...", whDelTitle: "🗑️ Bezig met verwijderen", whDoneTitle: "✅ Proces voltooid", whCrashTitle: "🚨 Systeemfout" } }
};

let L = i18n["1"].t; 
global.activeWebhook = null; 

// --- Termux Arka Plan Koruması (Wake-Lock) ---
function enableTermuxWakeLock() {
  exec('termux-wake-lock', (err) => {
    if (!err) {
      console.log(`\n${colors.yellow}>> [!] Termux Wake-Lock aktif: Cihaz ekranı kapansa bile işlem arka planda devam edecek.${colors.reset}`);
    }
  });
}

// --- Canlı Webhook Güncelleyici Fonksiyonlar (PATCH) ---
async function sendWebhookInitial(url, title, desc, colorHex) {
  if (!url) return null;
  try {
    const res = await fetch(`${url}?wait=true`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ embeds: [{ title: title, description: desc, color: colorHex }] })
    });
    if (res.ok) {
      const data = await res.json();
      return data.id; 
    }
  } catch (e) {}
  return null;
}

async function updateWebhookMessage(url, messageId, title, desc, colorHex) {
  if (!url || !messageId) return;
  try {
    await fetch(`${url}/messages/${messageId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ embeds: [{ title: title, description: desc, color: colorHex }] })
    });
  } catch (e) {}
}

async function logCrashAndExit(reason, errorDetails) {
  const time = new Date().toLocaleString();
  const logMessage = `\n=================================\n[TARIH/TIME]: ${time}\n[DURUM/STATUS]: ${reason}\n[HATA/ERROR]: ${errorDetails}\n=================================\n`;
  
  try {
    fs.appendFileSync('undiscord_crash_log.txt', logMessage);
    console.log(`\n${colors.red}[!] İşlem durdu! Detaylar 'undiscord_crash_log.txt' dosyasına kaydedildi.${colors.reset}`);
  } catch (e) {
    console.log(`\n${colors.red}[!] Log dosyasına yazılamadı.${colors.reset}`);
  }

  if (global.activeWebhook) {
    await sendWebhookInitial(global.activeWebhook, L.whCrashTitle, `**Sebep / Reason:** ${reason}\n**Detay:** \`\`\`${errorDetails}\`\`\``, 0xe74c3c);
  }
}

process.on('uncaughtException', async (err) => {
  await logCrashAndExit('Kritik Hata (Uncaught Exception)', err.stack || err.message);
  process.exit(1);
});

process.on('unhandledRejection', async (reason) => {
  await logCrashAndExit('Bilinmeyen Reddedilme (Unhandled Rejection)', reason);
  process.exit(1);
});

process.on('SIGINT', async () => {
  console.log(`\n${colors.yellow}Program kullanıcı (Ctrl+C) tarafından durduruldu.${colors.reset}`);
  await logCrashAndExit('Kullanıcı Tarafından İptal (Ctrl+C)', 'İşlem manuel olarak sonlandırıldı.');
  process.exit(0);
});

// --- Yardımcı Fonksiyonlar ---
function extractChannelId(input) {
  const m = input.match(/(\d{15,25})$/);
  return m ? m[1] : input;
}

function drawProgressBar(current, total) {
  const barLength = 30; 
  const progress = total === 0 ? 1 : current / total;
  const filled = Math.round(barLength * progress);
  const empty = barLength - filled;

  let color = colors.red;
  if (progress >= 0.66) color = colors.green;
  else if (progress >= 0.33) color = colors.yellow;

  const bar = '█'.repeat(filled) + '░'.repeat(empty);
  const percent = (progress * 100).toFixed(1);

  process.stdout.write(`\r${color}[${bar}] %${percent} | ${L.deleted}: ${current}/${total}${colors.reset}  `);
}

// --- Ana İşlemler ---
async function fetchBatch(channelId, headers, beforeId) {
  let url = `https://discord.com/api/v9/channels/${channelId}/messages?limit=${BATCH_SIZE}`;
  if (beforeId) url += `&before=${beforeId}`;
  for (;;) {
    const res = await fetch(url, { headers });
    if (res.ok) return res.json();
    if (res.status === 429) {
      const { retry_after = 5 } = await res.json();
      process.stdout.write(`\r${colors.yellow}[!] ${L.rate} ${retry_after}${L.wait}${colors.reset}       `);
      await sleep(retry_after * 1000);
      continue;
    }
    if (res.status === 401) throw new Error('Token 401 (Invalid/Geçersiz)');
    throw new Error(`HTTP ${res.status}`);
  }
}

async function deleteOne(channelId, headers, msg, counts) {
  const url = `https://discord.com/api/v9/channels/${channelId}/messages/${msg.id}`;
  for (;;) {
    const res = await fetch(url, { method: 'DELETE', headers });
    if (res.ok) { counts.deleted++; return; }
    if (res.status === 429) {
      const { retry_after = 5 } = await res.json();
      await sleep(retry_after * 1000);
      continue;
    }
    counts.failed++;
    counts.blocked.add(msg.author.username);
    return;
  }
}

async function runOne(channelIdRaw, targetUser, headers, webhook) {
  const channelId = extractChannelId(channelIdRaw);
  const counts = { deleted: 0, failed: 0, blocked: new Set() };
  
  console.log(`\n${colors.cyan}>> [1] ${L.scan}${colors.reset}`);
  
  let liveMsgId = await sendWebhookInitial(webhook, L.whScanTitle, `**Kanal/Channel ID:** ${channelId}\n**Hedef/Target:** ${targetUser || "Hepsi/All"}\n⏳ ${L.whScanDesc}`, 0x3498db);

  let allTargetMessages = [];
  let before = null;
  let scannedBatches = 0;

  for (;;) {
    const batch = await fetchBatch(channelId, headers, before);
    if (batch.length === 0) break;
    scannedBatches++;

    let toDelete = batch.filter((m) => m.type !== 3); 
    if (targetUser) toDelete = toDelete.filter((m) => m.author.username.toLowerCase() === targetUser);
    
    allTargetMessages.push(...toDelete);
    before = batch[batch.length - 1].id;

    process.stdout.write(`\r${colors.blue}${L.foundMsg} ${colors.bold}${allTargetMessages.length}${colors.reset} (${L.page} ${scannedBatches})`);

    if (scannedBatches % 5 === 0) {
      await updateWebhookMessage(webhook, liveMsgId, L.whScanTitle, `**Kanal/Channel ID:** ${channelId}\n📊 Taranan Mesaj: ${allTargetMessages.length}`, 0x3498db);
    }

    if (batch.length < BATCH_SIZE) break;
    await sleep(100); 
  }

  const total = allTargetMessages.length;
  console.log(); 
  
  if (total === 0) {
    console.log(`${colors.yellow}${L.noMsg}${colors.reset}`);
    await updateWebhookMessage(webhook, liveMsgId, L.whScanTitle, `⚠️ ${L.noMsg}`, 0xf1c40f);
    return;
  }

  console.log(`\n${colors.green}>> [2] ${colors.bold}${total}${colors.reset} ${colors.green}${L.startDel}${colors.reset}\n`);

  drawProgressBar(0, total);

  let lastUpdateTime = Date.now();

  for (const msg of allTargetMessages) {
    if (counts.blocked.has(msg.author.username)) {
      counts.failed++;
    } else {
      await deleteOne(channelId, headers, msg, counts);
    }
    
    const currentProgress = counts.deleted + counts.failed;
    drawProgressBar(currentProgress, total);

    if (Date.now() - lastUpdateTime > 3000 || currentProgress === total) {
      const percent = ((currentProgress / total) * 100).toFixed(1);
      await updateWebhookMessage(
        webhook, 
        liveMsgId, 
        L.whDelTitle, 
        `**ID:** ${channelId}\n📈 **İlerleme:** %${percent}\n🗑️ **${L.deleted}:** ${counts.deleted}/${total}\n❌ **${L.fail}:** ${counts.failed}`, 
        0x2ecc71
      );
      lastUpdateTime = Date.now();
    }

    await sleep(250 + Math.random() * 450); 
  }

  console.log(`\n\n${colors.cyan}${colors.bold}=== ${L.done} ===${colors.reset}`);
  console.log(`${colors.green}${L.success}: ${counts.deleted}${colors.reset}`);
  if (counts.failed > 0) console.log(`${colors.red}${L.fail}: ${counts.failed}${colors.reset}`);
  if (counts.blocked.size) console.log(`${colors.yellow}${L.unauth}: ${[...counts.blocked].join(', ')}${colors.reset}`);

  await updateWebhookMessage(
    webhook, 
    liveMsgId, 
    L.whDoneTitle, 
    `**ID:** ${channelId}\n\n✅ **${L.success}:** ${counts.deleted}\n❌ **${L.fail}:** ${counts.failed}`, 
    0x9b59b6
  );
}

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => new Promise((resolve) => rl.question(q, resolve));

(async () => {
  console.clear();
  console.log(`${colors.magenta}${colors.bold}===========================================${colors.reset}`);
  console.log(`${colors.cyan}${colors.bold}       UNDISCORD (TERMUX VIP EDITION)      ${colors.reset}`);
  console.log(`${colors.magenta}${colors.bold}===========================================${colors.reset}\n`);

  console.log("Diller / Languages:");
  for (const [key, lang] of Object.entries(i18n)) {
    console.log(`  ${colors.yellow}[${key}]${colors.reset} ${lang.name}`);
  }
  
  const langChoice = (await ask(`\n${colors.cyan}? Select Language / Dil Seçin (1-15): ${colors.reset}`)).trim() || "1";
  if (i18n[langChoice]) L = i18n[langChoice].t;
  else console.log(`${colors.red}Geçersiz seçim, Türkçe devam ediliyor...${colors.reset}\n`);

  const token = (await ask(`\n${colors.yellow}? ${L.askToken} ${colors.reset}`)).trim();
  if (!token) { process.exit(1); }
  const headers = { Authorization: token };

  const webhookUrl = (await ask(`${colors.yellow}? ${L.askWeb} ${colors.reset}`)).trim();
  if (webhookUrl) global.activeWebhook = webhookUrl; 

  enableTermuxWakeLock();

  console.log(`\n${colors.green}✓ ${L.ready}${colors.reset}\n`);
  
  for (;;) {
    console.log(`${colors.blue}-------------------------------------------${colors.reset}`);
    const channelIdRaw = (await ask(`${colors.yellow}? ${L.askCh} ${colors.reset}`)).trim();
    if (!channelIdRaw) continue;
    
    const userRaw = (await ask(`${colors.yellow}? ${L.askUsr} ${colors.reset}`)).trim();
    const targetUser = userRaw ? userRaw.toLowerCase() : null;

    try {
      await runOne(channelIdRaw, targetUser, headers, webhookUrl);
    } catch (e) {
      console.log(`\n${colors.red}${L.err} ${e.message}${colors.reset}`);
      fs.appendFileSync('undiscord_crash_log.txt', `\n[${new Date().toLocaleString()}] DONGU HATASI: ${e.message}\n`);
    }
    console.log();
  }
})();
