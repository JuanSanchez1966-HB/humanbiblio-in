import { useState } from 'react'
import { Search, MapPin, MessageCircle, Video, Building2, User, Star, TrendingUp, Phone } from 'lucide-react'

type View = 'home' | 'agora' | 'boulevard'

const mockProfessionals = [
  { id: 1, name: 'Dr. Maria Chen', profession: 'Cardiologist', distance: '2.3 km', trustScore: 98, avatar: '👩‍⚕️' },
  { id: 2, name: 'John Davidson', profession: 'Software Engineer', distance: '4.1 km', trustScore: 95, avatar: '👨‍💻' },
  { id: 3, name: 'Sarah Williams', profession: 'Marketing Director', distance: '1.8 km', trustScore: 97, avatar: '👩‍💼' },
  { id: 4, name: 'Ahmed Hassan', profession: 'Financial Advisor', distance: '5.5 km', trustScore: 93, avatar: '👨‍💼' },
]

const mockBusinesses = [
  { id: 1, name: 'Bella Vista Restaurant', category: 'Italian Restaurant', owner: 'Marco Rossi', distance: '1.2 km', rating: 4.8, trustScore: 96, avatar: '🍝' },
  { id: 2, name: 'TechFix Solutions', category: 'Computer Repair', owner: 'Lisa Thompson', distance: '3.4 km', rating: 4.9, trustScore: 98, avatar: '💻' },
  { id: 3, name: 'Green Leaf Spa', category: 'Wellness Center', owner: 'Emma Zhang', distance: '2.1 km', rating: 4.7, trustScore: 94, avatar: '🧘‍♀️' },
  { id: 4, name: 'Sunrise Bakery', category: 'Bakery & Cafe', owner: 'Pierre Dubois', distance: '0.8 km', rating: 4.9, trustScore: 97, avatar: '🥐' },
]

function App() {
  const [currentView, setCurrentView] = useState<View>('home')
  const [searchTerm, setSearchTerm] = useState('')

  console.log('🔍 HUMANBIBLIO APP - Current View:', currentView)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700">
      <div className="bg-green-500 text-white text-center py-2 font-bold text-sm">
        ✅ HUMANBIBLIO DEMO - VERSIÓN ACTUALIZADA CON TODAS LAS FUNCIONES
      </div>

      <nav className="bg-white shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentView('home')}>
              <span className="text-3xl">🏛️</span>
              <span className="text-xl font-bold text-blue-600">HUMANBIBLIO</span>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setCurrentView('agora')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  currentView === 'agora'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                ÁGORA
              </button>
              <button
                onClick={() => setCurrentView('boulevard')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  currentView === 'boulevard'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                World Boulevard
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {currentView === 'home' && (
          <>
            <div className="text-center text-white mb-12">
              <div className="text-6xl mb-4">🏛️</div>
              <h1 className="text-5xl font-bold mb-4">HUMANBIBLIO</h1>
              <p className="text-2xl mb-2">LinkedIn Local + Yelp in One Platform</p>
              <p className="text-xl opacity-90">Where Your Professional Identity & Business Share the Same Trust Score</p>
            </div>

            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-8">
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <button
                  onClick={() => setCurrentView('agora')}
                  className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl hover:shadow-xl transition-shadow cursor-pointer text-left"
                >
                  <h2 className="text-2xl font-bold mb-4">ÁGORA</h2>
                  <p className="text-lg mb-4">Local Professional Networking</p>
                  <ul className="space-y-2 text-sm">
                    <li>✓ Search within 10km radius</li>
                    <li>✓ Direct messaging & video calls</li>
                    <li>✓ Behavioral Trust Score</li>
                    <li>✓ 95% features FREE forever</li>
                  </ul>
                  <p className="mt-4 text-xs opacity-90">Click to see demo →</p>
                </button>

                <button
                  onClick={() => setCurrentView('boulevard')}
                  className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl hover:shadow-xl transition-shadow cursor-pointer text-left"
                >
                  <h2 className="text-2xl font-bold mb-4">WORLD BOULEVARD</h2>
                  <p className="text-lg mb-4">Business Discovery + Owner Connection</p>
                  <ul className="space-y-2 text-sm">
                    <li>✓ Discover local businesses</li>
                    <li>✓ Message owners directly</li>
                    <li>✓ See owner's professional profile</li>
                    <li>✓ Unified Trust Score</li>
                  </ul>
                  <p className="mt-4 text-xs opacity-90">Click to see demo →</p>
                </button>
              </div>

              <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-2 border-yellow-300 rounded-xl p-6 mb-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Investor Presentation Available</h3>
                <p className="text-center text-gray-700 mb-4">
                  Download our complete investor pitch deck based on Guy Kawasaki's framework
                </p>
                <div className="flex justify-center gap-4">
                  <a
                    href="/presentations/HUMANBIBLIO-Investor-Presentation-Standalone.html"
                    download
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                  >
                    📥 Download Presentation
                  </a>
                  <a
                    href="/presentations/HUMANBIBLIO-Investor-Presentation-Standalone.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                  >
                    👁️ View Online
                  </a>
                </div>
              </div>

              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">$1.5M Seed Round</h3>
                <p className="text-lg text-gray-700 mb-6">
                  $10M Post-Money | 15% Equity | Product 100% Built
                </p>
                <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
                  <div>
                    <p className="font-semibold text-gray-800">35,000 Users</p>
                    <p>Year 1 Target (Toronto)</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Month 14</p>
                    <p>Profitable</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">$112M</p>
                    <p>Year 5 Revenue</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-gray-200 text-center text-gray-600">
                <p className="font-semibold text-gray-800 mb-2">Dr. Juan de J. Sanchez | Allan Viquez</p>
                <p>📧 Humanbiblio@gmail.com | 📱 (289) 990-0450</p>
                <p className="mt-2 text-sm">📍 St. Catharines, Ontario, Canada</p>
              </div>
            </div>
          </>
        )}

        {currentView === 'agora' && (
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl p-8 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                  <User className="text-blue-600" size={32} />
                  ÁGORA - Professional Network
                </h2>
                <div className="text-sm text-gray-600">
                  <MapPin className="inline mr-1" size={16} />
                  Toronto, ON
                </div>
              </div>

              <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search professionals by name, skill, or industry..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>

              <p className="text-sm text-gray-600 mb-4">
                Found {mockProfessionals.length} professionals within 10km radius
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {mockProfessionals.map((prof) => (
                <div key={prof.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="text-4xl">{prof.avatar}</div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-800">{prof.name}</h3>
                        <p className="text-gray-600">{prof.profession}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-green-600 font-bold">
                        <TrendingUp size={16} />
                        {prof.trustScore}
                      </div>
                      <p className="text-xs text-gray-500">Trust Score</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                    <MapPin size={16} className="text-blue-600" />
                    <span>{prof.distance} away</span>
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors">
                      <MessageCircle size={18} />
                      Message
                    </button>
                    <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors">
                      <Video size={18} />
                      Video Call
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentView === 'boulevard' && (
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl p-8 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                  <Building2 className="text-green-600" size={32} />
                  World Boulevard - Business Directory
                </h2>
                <div className="text-sm text-gray-600">
                  <MapPin className="inline mr-1" size={16} />
                  Toronto, ON
                </div>
              </div>

              <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search businesses by name, category, or service..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                />
              </div>

              <p className="text-sm text-gray-600 mb-4">
                Found {mockBusinesses.length} businesses within 10km radius
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {mockBusinesses.map((business) => (
                <div key={business.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="text-4xl">{business.avatar}</div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-800">{business.name}</h3>
                        <p className="text-gray-600 text-sm">{business.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-yellow-500 font-bold">
                        <Star size={16} fill="currentColor" />
                        {business.rating}
                      </div>
                      <p className="text-xs text-gray-500">Rating</p>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <User size={14} className="text-blue-600" />
                      <span className="text-sm font-semibold text-gray-800">Owner: {business.owner}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp size={14} className="text-green-600" />
                      <span className="text-sm text-gray-600">Trust Score: {business.trustScore}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                    <MapPin size={16} className="text-green-600" />
                    <span>{business.distance} away</span>
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors">
                      <MessageCircle size={18} />
                      Contact Owner
                    </button>
                    <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors">
                      <Phone size={18} />
                      Call
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
