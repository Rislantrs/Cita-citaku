import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      "app_name": "Cita-citaku",
      "home": "Home",
      "dashboard": "Dashboard",
      "login_with_google": "Login with Google",
      "logout": "Logout",
      "explore_roadmap": "Explore Roadmap",
      "test_riasec": "Personality Test (RIASEC)",
      "ai_counselor": "AI Counselor",
      "community": "Community",
      "hero_title": "Discover Your True Path",
      "hero_subtitle": "An educational and career platform to help you find your identity and plan your future career roadmap.",
      "start_journey": "Start Your Journey",
      "select_language": "Select Language",
      "question": "Question",
      "agree": "Agree",
      "disagree": "Disagree",
      "test_complete": "Test Complete!",
      "your_result": "Your Result:",
      "save_result": "Save Result",
      "ai_counselor_greeting": "Hello! I am your AI Career Counselor. Tell me about your interests, or ask for advice!",
      "type_message": "Type your message...",
      "send": "Send",
      "record_audio": "Record Audio",
      "stop_audio": "Stop Recording",
      "microphone_permission_denied": "Microphone permission denied.",
      "community_title": "Community Submissions"
    }
  },
  id: {
    translation: {
      "app_name": "Cita-citaku",
      "home": "Beranda",
      "dashboard": "Dasbor",
      "login_with_google": "Masuk dengan Google",
      "logout": "Keluar",
      "explore_roadmap": "Eksplor Peta Jalan",
      "test_riasec": "Tes Kepribadian (RIASEC)",
      "ai_counselor": "Konselor AI",
      "community": "Komunitas",
      "hero_title": "Temukan Jati Dirimu",
      "hero_subtitle": "Platform edukasi dan karir untuk membantu kamu menemukan identitas dan merencanakan peta jalan karir masa depan.",
      "start_journey": "Mulai Perjalananmu",
      "select_language": "Pilih Bahasa",
      "question": "Pertanyaan",
      "agree": "Setuju",
      "disagree": "Tidak Setuju",
      "test_complete": "Tes Selesai!",
      "your_result": "Hasil Kamu:",
      "save_result": "Simpan Hasil",
      "ai_counselor_greeting": "Halo! Saya adalah Konselor Karir AI kamu. Ceritakan tentang minat kamu, atau mintalah saran!",
      "type_message": "Ketik pesanmu...",
      "send": "Kirim",
      "record_audio": "Rekam Suara",
      "stop_audio": "Berhenti Merekam",
      "microphone_permission_denied": "Izin mikrofon ditolak.",
      "community_title": "Kontribusi Komunitas"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "id", // default language
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
