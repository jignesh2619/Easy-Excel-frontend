export function DashboardPreviewSection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 via-[#00A878]/5 to-gray-50 relative overflow-hidden">
      {/* Gradient orbs */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-gradient-to-br from-[#00A878]/20 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-gradient-to-tr from-[#00c98c]/10 to-transparent rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-gray-900 via-[#00A878] to-gray-900 bg-clip-text text-transparent">
            From Messy Data to Clear Insights—Automatically
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            See how LazyExcel transforms your raw data into professional, interactive dashboards.
          </p>
        </div>

        {/* Dashboard Mockup */}
        <div className="max-w-6xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden hover:shadow-3xl hover:scale-[1.02] transition-smooth hover-lift">
            {/* Dashboard Header */}
            <div className="bg-gradient-to-r from-[#00A878] to-[#00c98c] px-8 py-6 text-white">
              <h3 className="mb-2">Sales Dashboard</h3>
              <p className="text-white/90">Last updated: Nov 2025</p>
            </div>

            {/* Dashboard Content */}
            <div className="p-8">
              {/* KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-br from-[#00A878]/10 via-white to-[#00c98c]/5 rounded-xl p-6 border border-[#00A878]/20 hover:shadow-lg hover:scale-105 transition-smooth cursor-pointer relative overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#00A878]/20 to-transparent rounded-full blur-xl"></div>
                  <div className="relative z-10">
                    <p className="text-gray-600 mb-2">Total Revenue</p>
                    <p className="text-gray-900">$124,583</p>
                    <div className="flex items-center gap-1 mt-2">
                      <span className="text-[#00A878]">↑ 12.5%</span>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-[#00A878]/10 via-white to-[#00c98c]/5 rounded-xl p-6 border border-[#00A878]/20 hover:shadow-lg hover:scale-105 transition-smooth cursor-pointer relative overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#00A878]/20 to-transparent rounded-full blur-xl"></div>
                  <div className="relative z-10">
                    <p className="text-gray-600 mb-2">Active Users</p>
                    <p className="text-gray-900">8,432</p>
                    <div className="flex items-center gap-1 mt-2">
                      <span className="text-[#00A878]">↑ 8.2%</span>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-[#00A878]/10 via-white to-[#00c98c]/5 rounded-xl p-6 border border-[#00A878]/20 hover:shadow-lg hover:scale-105 transition-smooth cursor-pointer relative overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#00A878]/20 to-transparent rounded-full blur-xl"></div>
                  <div className="relative z-10">
                    <p className="text-gray-600 mb-2">Conversion Rate</p>
                    <p className="text-gray-900">24.8%</p>
                    <div className="flex items-center gap-1 mt-2">
                      <span className="text-[#00A878]">↑ 3.1%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Charts Area */}
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Bar Chart Mockup */}
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-smooth animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                  <p className="text-gray-700 mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Monthly Revenue</p>
                  <div className="flex items-end justify-between gap-2 h-48">
                    <div className="flex-1 bg-gradient-to-t from-[#00A878] to-[#00c98c] rounded-t-lg hover:scale-105 transition-transform" style={{ height: "45%" }}></div>
                    <div className="flex-1 bg-gradient-to-t from-[#00A878] to-[#00c98c] rounded-t-lg hover:scale-105 transition-transform" style={{ height: "60%" }}></div>
                    <div className="flex-1 bg-gradient-to-t from-[#00A878] to-[#00c98c] rounded-t-lg hover:scale-105 transition-transform" style={{ height: "75%" }}></div>
                    <div className="flex-1 bg-gradient-to-t from-[#00A878] to-[#00c98c] rounded-t-lg hover:scale-105 transition-transform" style={{ height: "55%" }}></div>
                    <div className="flex-1 bg-gradient-to-t from-[#00A878] to-[#00c98c] rounded-t-lg hover:scale-105 transition-transform" style={{ height: "85%" }}></div>
                    <div className="flex-1 bg-gradient-to-t from-[#00A878] to-[#00c98c] rounded-t-lg hover:scale-105 transition-transform" style={{ height: "100%" }}></div>
                  </div>
                  <div className="flex justify-between mt-2 text-gray-500">
                    <span>Jun</span>
                    <span>Jul</span>
                    <span>Aug</span>
                    <span>Sep</span>
                    <span>Oct</span>
                    <span>Nov</span>
                  </div>
                </div>

                {/* Line Chart Mockup */}
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-smooth animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                  <p className="text-gray-700 mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">User Growth</p>
                  <div className="relative h-48">
                    <svg className="w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="none">
                      <polyline
                        fill="none"
                        stroke="#00A878"
                        strokeWidth="3"
                        points="0,150 66,120 132,100 198,110 264,70 330,50 400,30"
                      />
                      <polyline
                        fill="url(#gradient)"
                        stroke="none"
                        points="0,150 66,120 132,100 198,110 264,70 330,50 400,30 400,200 0,200"
                      />
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" style={{ stopColor: "#00A878", stopOpacity: 0.2 }} />
                          <stop offset="100%" style={{ stopColor: "#00A878", stopOpacity: 0 }} />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                  <div className="flex justify-between mt-2 text-gray-500">
                    <span>Jun</span>
                    <span>Jul</span>
                    <span>Aug</span>
                    <span>Sep</span>
                    <span>Oct</span>
                    <span>Nov</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}