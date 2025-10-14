import Link from "next/link"
import Title from "../components/Title"

export default function PrivacyPolicy() {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <Title />
      </div>

      <div className="overflow-hidden rounded-xl shadow-[2px_2px_0_rgba(0,0,0,0.15),0_1px_2px_rgba(0,0,0,0.1)]">
        {/* Header */}
        <div className="bg-wordcherryYellow py-3 px-4 text-center">
          <h1 className="text-2xl font-bold text-wordcherryBlue">Privacy Policy</h1>
        </div>

        {/* Content */}
        <div className="bg-[#fff7d6] p-6 md:p-8">
          <div className="prose prose-gray max-w-none">
            <p className="text-sm text-gray-600 mb-6">
              <strong>Last updated:</strong> September 2025
            </p>

            <div className="space-y-6">
              <section>
                <h2 className="text-xl font-bold text-wordcherryBlue mb-3">
                  1. Information We Collect
                </h2>
                <div className="text-gray-700 space-y-2">
                  <p>
                    WordCherry is designed to be a simple, fun word game. We collect minimal
                    information:
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Game scores and statistics for gameplay purposes</li>
                    <li>Basic usage analytics to improve the game experience</li>
                    <li>
                      Any information you voluntarily provide (such as player names in multiplayer
                      games)
                    </li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold text-wordcherryBlue mb-3">
                  2. How We Use Information
                </h2>
                <div className="text-gray-700 space-y-2">
                  <p>We use the information we collect to:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Provide and improve the WordCherry game experience</li>
                    <li>Track game statistics and leaderboards</li>
                    <li>Analyze usage patterns to enhance gameplay features</li>
                    <li>Ensure the security and functionality of our services</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold text-wordcherryBlue mb-3">
                  3. Information Sharing
                </h2>
                <div className="text-gray-700 space-y-2">
                  <p>
                    We do not sell, trade, or otherwise transfer your information to third parties,
                    except:
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>When required by law or to protect our rights</li>
                    <li>With your explicit consent</li>
                    <li>
                      To trusted service providers who assist in operating our game (under strict
                      confidentiality agreements)
                    </li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold text-wordcherryBlue mb-3">4. Data Security</h2>
                <div className="text-gray-700 space-y-2">
                  <p>We implement appropriate security measures to protect your information:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Secure data transmission and storage</li>
                    <li>Regular security assessments</li>
                    <li>Limited access to personal information</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold text-wordcherryBlue mb-3">
                  5. Cookies and Local Storage
                </h2>
                <div className="text-gray-700 space-y-2">
                  <p>WordCherry may use:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Local storage to save game progress and preferences</li>
                    <li>Analytics cookies to understand how the game is used</li>
                    <li>Essential cookies for game functionality</li>
                  </ul>
                  <p>
                    You can disable cookies in your browser settings, though this may affect game
                    functionality.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold text-wordcherryBlue mb-3">
                  6. Third-Party Services
                </h2>
                <div className="text-gray-700 space-y-2">
                  <p>Our game may use third-party services for:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Analytics and performance monitoring</li>
                    <li>Game hosting and delivery</li>
                    <li>Content delivery networks</li>
                  </ul>
                  <p>
                    These services have their own privacy policies, and we encourage you to review
                    them.
                  </p>
                </div>
              </section>
              <section>
                <h2 className="text-xl font-bold text-wordcherryBlue mb-3">
                  8. Changes to This Policy
                </h2>
                <div className="text-gray-700 space-y-2">
                  <p>
                    We may update this privacy policy from time to time. We will notify users of any
                    material changes by updating the &quot;Last updated&quot; date at the top of
                    this policy.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold text-wordcherryBlue mb-3">9. Contact Us</h2>
                <div className="text-gray-700 space-y-2">
                  <p>
                    If you have any questions about this privacy policy or WordCherry&apos;s data
                    practices, please contact me at:
                  </p>
                  <div className="bg-gray-50 p-3 rounded-lg mt-2">
                    <p className="font-mono text-sm">sadiqdotdigital@gmail.com</p>
                  </div>
                </div>
              </section>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="text-center">
                <Link
                  href="/"
                  className="inline-block bg-wordcherryBlue text-white font-bold px-6 py-3 rounded-lg hover:bg-wordcherryBlue/90 transition-colors"
                >
                  Back to Game
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
