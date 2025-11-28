import { Linkedin, Mail, Instagram, MessageCircle } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-4">
              İbrahim Abdullayev
            </h3>
            <p className="text-gray-400 text-sm sm:text-base">
              Turizm sahəsində aparıcı mütəxəssis. Aviabilet, otel, transfer, 
              sığorta və səfirlik xidmətləri üzrə peşəkar dəstək.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white mb-4">
              Səhifələr
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#home"
                  className="hover:text-primary-400 transition-colors"
                >
                  Ana Səhifə
                </a>
              </li>
              <li>
                <a
                  href="#about"
                  className="hover:text-primary-400 transition-colors"
                >
                  Haqqımda
                </a>
              </li>
              <li>
                <a
                  href="#projects"
                  className="hover:text-primary-400 transition-colors"
                >
                  Portfolio
                </a>
              </li>
              <li>
                <a
                  href="#services"
                  className="hover:text-primary-400 transition-colors"
                >
                  Xidmətlər
                </a>
              </li>
              <li>
                <a
                  href="#booking"
                  className="hover:text-primary-400 transition-colors"
                >
                  Rezervasiya
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="hover:text-primary-400 transition-colors"
                >
                  Əlaqə
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white mb-4">
              Sosial Media
            </h4>
            <div className="flex flex-wrap gap-3 sm:gap-4">
              <a
                href="https://linkedin.com/in/ibrahim-abdullayev-7bb887152"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 sm:p-3 bg-gray-800 rounded-lg hover:bg-primary-600 active:bg-primary-700 transition-colors touch-manipulation"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5 sm:w-6 sm:h-6" />
              </a>
              <a
                href="https://instagram.com/ibrahim_abdullar"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 sm:p-3 bg-gray-800 rounded-lg hover:bg-primary-600 active:bg-primary-700 transition-colors touch-manipulation"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5 sm:w-6 sm:h-6" />
              </a>
              <a
                href="https://wa.me/994555973923"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 sm:p-3 bg-gray-800 rounded-lg hover:bg-primary-600 active:bg-primary-700 transition-colors touch-manipulation"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
              </a>
              <a
                href="mailto:ibrahim.abdullayev1@gmail.com"
                className="p-2.5 sm:p-3 bg-gray-800 rounded-lg hover:bg-primary-600 active:bg-primary-700 transition-colors touch-manipulation"
                aria-label="Email"
              >
                <Mail className="w-5 h-5 sm:w-6 sm:h-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-gray-400">
            © {currentYear} İbrahim Abdullayev. Bütün hüquqlar qorunur.
          </p>
        </div>
      </div>
    </footer>
  )
}

